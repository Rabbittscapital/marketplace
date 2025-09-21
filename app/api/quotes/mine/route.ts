// app/api/quotes/mine/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Si quieres filtrar por broker más adelante, agrega brokerId en Quote y aquí úsalo.
    const quotes = await prisma.quote.findMany({
      include: {
        client: true,
        unit: { include: { project: true } },
        receipt: true, // 👈 ya es válido por el modelo Receipt
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, quotes });
  } catch (err) {
    console.error('quotes/mine error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
