// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function genQuoteNumber() {
  // Ej: Q-20250921-123456
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const s = String(Math.floor(Math.random() * 1e6)).padStart(6, '0');
  return `Q-${y}${m}${day}-${s}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { unitId, clientId, downPaymentPct, installments, installmentValue, currency } =
    await req.json();

  if (!unitId || !clientId) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { project: true },
  });

  if (!unit) return NextResponse.json({ error: 'unit_not_found' }, { status: 404 });
  if (!unit.available) {
    return NextResponse.json({ error: 'unit_not_available' }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return NextResponse.json({ error: 'client_not_found' }, { status: 404 });

  const number = genQuoteNumber();

  const quote = await prisma.quote.create({
    data: {
      number,
      downPaymentPct: Number(downPaymentPct),
      installments: Number(installments),
      installmentValue: Number(installmentValue),
      currency: String(currency || unit.project.currency),
      unit: { connect: { id: unit.id } },
      client: { connect: { id: client.id } },
    },
    include: {
      client: true,
      unit: { include: { project: true } },
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
