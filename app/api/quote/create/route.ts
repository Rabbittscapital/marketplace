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

    // Buscar la unidad con el proyecto y la moneda
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        price: true,
        available: true,
        project: {
          select: { currency: true }
        }
      }
    });

    if (!unit) {
      return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    }

    if (!unit.available) {
      return NextResponse.json({ error: "unit_not_available" }, { status: 400 });
    }

    const client = await prisma.client.findFirst({
      where: { id: clientId, brokerId }
    });

    if (!client) {
      return NextResponse.json(
        { error: "client_not_found_or_not_owned" },
        { status: 404 }
      );
    }

    // Calcular valor de la cuota
    const installmentValue = Math.round(
      (unit.price * (100 - downPaymentPct)) / 100 / installments
    );

    // Crear la cotización
    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        brokerId,
        downPaymentPct,
        installments,
        installmentValue,
        totalPrice: unit.price,
        currency: unit.project.currency
      }
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}
