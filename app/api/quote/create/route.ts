import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;
  if (!brokerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { unitId, clientId, downPaymentPct, installments } = await req.json();

  const [unit, client] = await Promise.all([
    prisma.unit.findUnique({ where: { id: unitId } }),
    prisma.client.findFirst({ where: { id: clientId, brokerId } }),
  ]);

  if (!unit) return NextResponse.json({ error: "unit_not_found" }, { status: 404 });
  if (unit.status !== "AVAILABLE") return NextResponse.json({ error: "unit_not_available" }, { status: 400 });
  if (!client) return NextResponse.json({ error: "client_not_found_or_not_owned" }, { status: 404 });

  const installmentValue = Math.round((unit.price * (100 - downPaymentPct)) / 100 / installments);

  const quote = await prisma.quote.create({
    data: {
      unitId,
      brokerId,
      clientId,
      downPaymentPct,
      installments,
      calculatedDownPayment: Math.round((unit.price * downPaymentPct) / 100),
      installmentValue,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, quoteId: quote.id });
}
