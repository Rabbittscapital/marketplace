// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function pad(n: number, w: number) {
  return n.toString().padStart(w, '0');
}

async function nextQuoteNumber() {
  // Formato: Q-YYYYMM-#### (ej: Q-202509-0001)
  const now = new Date();
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1, 2);
  const prefix = `Q-${y}${m}-`;

  const last = await prisma.quote.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: 'desc' },
    select: { number: true },
  });

  const lastSeq = last?.number ? parseInt(last.number.slice(prefix.length), 10) : 0;
  const nextSeq = pad((lastSeq || 0) + 1, 4);
  return `${prefix}${nextSeq}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id ?? null;
    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      unitId,
      clientId,
      downPaymentPct,
      installments,
      installmentValue,
      currency,
    } = body ?? {};

    if (!unitId || !clientId) {
      return NextResponse.json({ error: 'missing_unit_or_client' }, { status: 400 });
    }

    // Traer unidad + proyecto para tomar currency por defecto si no viene
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { project: true },
    });
    if (!unit) {
      return NextResponse.json({ error: 'unit_not_found' }, { status: 404 });
    }
    if (unit.available === false) {
      return NextResponse.json({ error: 'unit_not_available' }, { status: 400 });
    }

    // Validar que el cliente pertenezca al broker (si usas brokerId opcional, se permite null)
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, brokerId: true },
    });
    if (!client) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }
    if (client.brokerId && client.brokerId !== brokerId) {
      return NextResponse.json({ error: 'forbidden_client' }, { status: 403 });
    }

    const number = await nextQuoteNumber();

    const quote = await prisma.quote.create({
      data: {
        number,
        downPaymentPct: Number(downPaymentPct ?? 0),
        installments: Number(installments ?? 0),
        installmentValue: Number(installmentValue ?? 0),
        currency: currency || unit.project?.currency || 'USD',
        unit: { connect: { id: unit.id } },
        client: { connect: { id: client.id } },
      },
      include: {
        client: true,
        unit: { include: { project: true } },
        receipt: true,
      },
    });

    // (Opcional) Marcar unidad como no disponible inmediatamente:
    // await prisma.unit.update({ where: { id: unit.id }, data: { available: false } });

    return NextResponse.json(quote, { status: 201 });
  } catch (e) {
    console.error('quote:create error', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
