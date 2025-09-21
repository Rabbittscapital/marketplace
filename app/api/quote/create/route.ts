// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Body = {
  unitId: string;
  clientId?: string;
  downPaymentPct?: number;
  installments?: number;
  installmentValue?: number;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id;
    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as Body;

    const unitId = body.unitId?.trim();
    const clientId = body.clientId?.trim();
    const dp = Number(body.downPaymentPct ?? 0);
    const installments = Number(body.installments ?? 0);
    const installmentValue = Number(body.installmentValue ?? 0);

    if (!unitId) {
      return NextResponse.json({ error: 'unitId_required' }, { status: 400 });
    }
    if (!clientId) {
      return NextResponse.json({ error: 'clientId_required' }, { status: 400 });
    }

    // Traer la unidad con el proyecto (para currency) y validar disponibilidad
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { project: true },
    });

    if (!unit) {
      return NextResponse.json({ error: 'unit_not_found' }, { status: 404 });
    }

    // En este modelo usamos "available" (boolean) en vez de "status"
    if (!unit.available) {
      return NextResponse.json(
        { error: 'unit_not_available' },
        { status: 400 }
      );
    }

    // Moneda desde el proyecto
    const currency = unit.project?.currency ?? 'USD';

    // Crear quote usando relaciones (connect), NO unitId/clientId directos
    const quote = await prisma.quote.create({
      data: {
        downPaymentPct: dp,
        installments,
        installmentValue,
        currency,
        unit: { connect: { id: unit.id } },
        client: { connect: { id: clientId } },
        // Si tu schema requiere "number" (único) sin default,
        // descomenta y usa un generador simple:
        // number: `Q-${Date.now()}`,
      },
      include: {
        unit: { include: { project: true } },
        client: true,
        // Si tu modelo tiene relación opcional a Receipt:
        // receipt: true,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (err) {
    console.error('quote:create error', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
