// app/api/quote/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Espera un body JSON como:
 * {
 *   "unitId": "string",
 *   "clientId": "string",
 *   "downPaymentPct": 20,         // porcentaje pie (0-100)
 *   "installments": 24            // cantidad de cuotas (>0)
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const brokerId = session.user.id;

    const { unitId, clientId, downPaymentPct, installments } = await request.json();

    // Validaciones básicas del payload
    if (!unitId || !clientId) {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }
    if (
      typeof downPaymentPct !== "number" ||
      downPaymentPct < 0 ||
      downPaymentPct > 100
    ) {
      return NextResponse.json({ error: "invalid_downPaymentPct" }, { status: 400 });
    }
    if (typeof installments !== "number" || installments <= 0) {
      return NextResponse.json({ error: "invalid_installments" }, { status: 400 });
    }

    // 1) Traer unidad y cliente
    const [unit, client] = await Promise.all([
      prisma.unit.findUnique({ where: { id: unitId }, include: { project: true } }),
      prisma.client.findFirst({ where: { id: clientId, brokerId } }), // el cliente debe pertenecer al broker logueado
    ]);

    if (!unit) {
      return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
    }
    // IMPORTANTE: tu modelo usa 'available: boolean' (no 'status')
    if (!unit.available) {
      return NextResponse.json({ error: "unit_not_available" }, { status: 400 });
    }
    if (!client) {
      return NextResponse.json({ error: "client_not_found_or_not_owned" }, { status: 404 });
    }

    // 2) Calcular cuotas
    const financedPct = (100 - downPaymentPct) / 100;
    const installmentValue = Math.round((unit.price * financedPct) / installments);

    // 3) Crear la cotización y opcionalmente marcar unidad en “reservada pendiente”
    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        brokerId,
        downPaymentPct,
        installments,
        installmentValue,
        currency: unit.project.currency, // si tu Project tiene currency ("USD" | "UF")
      },
      include: {
        unit: { include: { project: true } },
        client: true,
      },
    });

    // (Opcional) actualizar disponibilidad si tu flujo lo requiere:
    // await prisma.unit.update({ where: { id: unit.id }, data: { available: false } });

    return NextResponse.json({ ok: true, quote }, { status: 201 });
  } catch (err) {
    console.error("quote/create error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
