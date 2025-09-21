// app/api/quote/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1) Autenticación
    const session = await getServerSession(authOptions);
    const brokerId =
      (session as any)?.user?.id ??
      (session as any)?.userId ??
      ""; // asegúrate de que tu callback de NextAuth ponga user.id

    if (!brokerId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // 2) Body
    const { unitId, clientId, downPaymentPct, installments } = await req.json();

    if (!unitId || !clientId) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    if (
      !Number.isInteger(downPaymentPct) ||
      !Number.isInteger(installments) ||
      installments <= 0
    ) {
      return NextResponse.json({ error: "invalid_numbers" }, { status: 400 });
    }

    // 3) Cargar unidad con currency desde el proyecto
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        price: true,
        available: true,
        project: { select: { id: true, currency: true } }, // <-- currency viene del proyecto
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    }
    if (!unit.available) {
      return NextResponse.json(
        { error: "unit_not_available" },
        { status: 400 }
      );
    }

    // 4) Validar que el cliente pertenece al broker autenticado
    const client = await prisma.client.findFirst({
      where: { id: clientId, brokerId },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: "client_not_found_or_not_owned" },
        { status: 404 }
      );
    }

    // 5) Cálculos
    const financedBase = Math.round(
      (unit.price * (100 - Number(downPaymentPct))) / 100
    );
    const installmentValue = Math.round(financedBase / Number(installments));
    const totalPrice = unit.price;

    // 6) Crear cotización
    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        brokerId, // <- requiere que exista el campo brokerId en tu modelo Quote
        downPaymentPct: Number(downPaymentPct),
        installments: Number(installments),
        installmentValue,
        totalPrice,
        currency: unit.project.currency, // <- ahora viene del proyecto
      },
    });

    return NextResponse.json({ ok: true, quoteId: quote.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
