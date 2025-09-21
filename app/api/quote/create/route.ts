import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Nota TS: si no has extendido los tipos de NextAuth para incluir user.id,
    // hacemos un cast para evitar errores de build.
    const brokerId = (session.user as any).id as string | undefined;
    if (!brokerId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { unitId, clientId, downPaymentPct, installments } = await req.json();

    if (!unitId || !clientId || typeof downPaymentPct !== "number" || typeof installments !== "number") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    // Traer unidad y cliente
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: { id: true, price: true, currency: true, available: true },
    });

    const client = await prisma.client.findFirst({
      where: { id: clientId, brokerId }, // cliente debe pertenecer al broker actual
      select: { id: true },
    });

    if (!unit) return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    if (!unit.available) return NextResponse.json({ error: "unit_not_available" }, { status: 400 });
    if (!client) return NextResponse.json({ error: "client_not_found_or_not_owned" }, { status: 404 });

    // Cálculos
    const financiaPorcentaje = 100 - downPaymentPct;
    if (downPaymentPct < 0 || downPaymentPct > 100) {
      return NextResponse.json({ error: "downPaymentPct_out_of_range" }, { status: 400 });
    }
    if (installments <= 0) {
      return NextResponse.json({ error: "installments_invalid" }, { status: 400 });
    }

    const financed = Math.round((unit.price * financiaPorcentaje) / 100);
    const installmentValue = Math.round(financed / installments);
    const totalPrice = unit.price;

    // Crear la cotización
    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        brokerId,                // <-- ya existe en el schema
        downPaymentPct,
        installments,
        installmentValue,
        totalPrice,
        currency: unit.currency,
      },
    });

    return NextResponse.json({ ok: true, quote }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
