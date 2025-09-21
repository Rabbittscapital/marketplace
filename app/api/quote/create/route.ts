// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Si necesitas obligar sesión, descomenta:
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { unitId, clientId, downPaymentPct, installments } = body as {
      unitId: string;
      clientId: string;
      downPaymentPct: number; // 0..100
      installments: number;   // >=1
    };

    if (!unitId || !clientId || downPaymentPct == null || installments == null) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 });
    }

    // Trae unidad con proyecto (para currency) y disponibilidad
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
      return NextResponse.json({ error: 'unit_not_found' }, { status: 404 });
    }

    if (!unit.available) {
      return NextResponse.json({ error: 'unit_not_available' }, { status: 400 });
    }

    // Verifica cliente
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    // Cálculos
    const amountToFinance = Math.round((unit.price * (100 - downPaymentPct)) / 100);
    const installmentValue = Math.round(amountToFinance / installments);
    const currency = unit.project.currency;

    // CREATE usando relaciones anidadas (connect) en vez de unitId/clientId
    const quote = await prisma.quote.create({
      data: {
        // Si tu modelo tiene un campo "number" autogenerado en middleware/trigger, omite esto.
        // Si NO lo autogeneras y es requerido, crea uno aquí:
        // number: `Q-${Date.now()}`,
        unit: { connect: { id: unit.id } },
        client: { connect: { id: client.id } },
        // Si tu modelo tiene broker y quieres asociar:
        // broker: session?.user?.id ? { connect: { id: session.user.id } } : undefined,
        downPaymentPct,
        installments,
        installmentValue,
        currency,
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json(
      {
        ok: true,
        quoteId: quote.id,
        currency,
        installmentValue,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[quote:create] error', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
