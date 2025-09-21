// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // si necesitas exigir sesión para crear la cotización, descomenta:
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { unitId, clientId, downPaymentPct, installments } = body as {
      unitId: string;
      clientId: string;
      downPaymentPct: number; // porcentaje 0..100
      installments: number;   // número de cuotas
    };

    if (!unitId || !clientId || downPaymentPct == null || installments == null) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 });
    }

    // Traemos la unidad con su proyecto (para tomar la currency) y su disponibilidad
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

    // Aquí usamos available en vez de status
    if (!unit.available) {
      return NextResponse.json({ error: 'unit_not_available' }, { status: 400 });
    }

    // Verificamos que exista el cliente (si necesitas validar pertenencia al broker, ajusta aquí)
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'client_not_found' },
        { status: 404 }
      );
    }

    // Cálculo de la cuota: (precio * (100 - pie%)) / cuotas
    const amountToFinance = Math.round((unit.price * (100 - downPaymentPct)) / 100);
    const installmentValue = Math.round(amountToFinance / installments);

    const currency = unit.project.currency;

    // Creamos la cotización. NO cambiamos la disponibilidad aquí;
    // la reserva/confirmación debe hacerse cuando suban el comprobante, etc.
    const quote = await prisma.quote.create({
      data: {
        unitId: unit.id,
        clientId: client.id,
        downPaymentPct,
        installments,
        installmentValue,
        currency, // viene de unit.project.currency
        // Si tu modelo Quote tiene brokerId y quieres guardarlo:
        // brokerId: session?.user?.id ?? undefined,
      },
      select: {
        id: true,
        createdAt: true,
      },
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
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    );
  }
}
 
