// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { unitId, clientId, downPaymentPct, installments } = await req.json();

    if (!unitId || !clientId) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        price: true,
        available: true,
        project: { select: { currency: true } }, // 👈 currency viene del proyecto
      },
    });

    if (!unit) {
      return NextResponse.json({ error: 'unit_not_found' }, { status: 404 });
    }

    if (!unit.available) {
      return NextResponse.json({ error: 'unit_not_available' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const dp = Number(downPaymentPct ?? 0);
    const inst = Number(installments ?? 1);
    if (isNaN(dp) || isNaN(inst) || inst <= 0) {
      return NextResponse.json({ error: 'invalid_financing' }, { status: 400 });
    }

    const installmentValue = Math.round((unit.price * (100 - dp)) / 100 / inst);
    const currency = unit.project.currency; // 👈 desde Project

    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        downPaymentPct: dp,
        installments: inst,
        installmentValue,
        currency,
      },
      include: {
        client: true,
        unit: { include: { project: true } },
        receipt: true, // por si existiera luego
      },
    });

    return NextResponse.json({ ok: true, quote }, { status: 201 });
  } catch (err) {
    console.error('quote/create error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
