// app/api/quote/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const brokerId = session.user.id;

    const { unitId, clientId, downPaymentPct, installments } = await req.json();

    if (!unitId || !clientId || typeof downPaymentPct !== "number" || typeof installments !== "number") {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { project: true },
    });
    if (!unit) {
      return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    }
    if (unit.status !== "AVAILABLE") {
      return NextResponse.json({ error: "unit_not_available" }, { status: 400 });
    }

    const client = await prisma.client.findFirst({
      where: { id: clientId, brokerId },
    });
    if (!client) {
      return NextResponse.json({ error: "client_not_found_or_not_owned" }, { status: 404 });
    }

    const installmentValue = Math.round((unit.price * (100 - downPaymentPct)) / 100 / installments);
    const totalPrice = unit.price;
    const currency = unit.project.currency;

    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        brokerId,
        downPaymentPct,
        installments,
        installmentValue,
        totalPrice,
        currency,
        receiptUrl: null,
      },
      include: {
        unit: { include: { project: true } },
        client: true,
      },
    });

    return NextResponse.json(quote);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
