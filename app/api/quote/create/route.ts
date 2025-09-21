// app/api/quote/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateQuoteBody = {
  unitId: string;
  clientId: string;
  downPaymentPct: number; // 0..100
  installments: number;   // cuotas (>=1)
};

export async function POST(req: Request) {
  try {
    // 1) Autenticación
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id;
    if (!brokerId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // 2) Body y validaciones básicas
    const body = (await req.json()) as CreateQuoteBody;
    const { unitId, clientId, downPaymentPct, installments } = body ?? {};

    if (!unitId || !clientId) {
      return NextResponse.json(
        { error: "missing_params" },
        { status: 400 }
      );
    }
    const downPct = Number(downPaymentPct);
    const cuotas = Number(installments);

    if (
      !Number.isFinite(downPct) ||
      downPct < 0 ||
      downPct > 100 ||
      !Number.isInteger(cuotas) ||
      cuotas < 1
    ) {
      return NextResponse.json(
        { error: "invalid_params" },
        { status: 400 }
      );
    }

    // 3) Leer unidad con precio y moneda desde el proyecto
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        price: true,
        available: true,
        project: { select: { id: true, currency: true } },
      },
    });

    if (!unit) {
      return NextResponse.json(
        { error: "unit_not_found" },
        { status: 404 }
      );
    }
    if (!unit.available) {
      return NextResponse.json(
        { error: "unit_not_available" },
        { status: 400 }
      );
    }

    // 4) Verificar que el cliente pertenece al broker logueado
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

    // 5) Calcular valor de cuotas
    const total = unit.price;
    const downPaymentValue = Math.round((total * downPct) / 100);
    const financed = Math.max(total - downPaymentValue, 0);
    const installmentValue =
      cuotas > 0 ? Math.round(financed / cuotas) : financed;

    // 6) Crear la cotización
    //  - currency VIENE de unit.project.currency
    //  - brokerId se guarda para que el vendedor vea sus propias cotizaciones
    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        brokerId, // <-- requiere que el modelo Quote tenga brokerId String @db.Uuid (o similar) y relación con User
        currency: unit.project.currency, // <-- se lee desde el proyecto
        downPaymentPct: downPct,
        installments: cuotas,
        installmentValue,
        totalPrice: total,
      },
      select: {
        id: true,
        currency: true,
        downPaymentPct: true,
        installments: true,
        installmentValue: true,
        totalPrice: true,
        createdAt: true,
        unit: {
          select: {
            id: true,
            number: true,
            project: { select: { id: true, name: true, currency: true } },
          },
        },
        client: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({ ok: true, quote }, { status: 201 });
  } catch (err) {
    console.error("[quote.create] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
