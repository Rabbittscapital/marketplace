// app/api/quotes/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id;
    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Filtrar por el broker a través del cliente: client.brokerId
    const quotes = await prisma.quote.findMany({
      where: {
        client: { brokerId }, // <- aquí está el cambio clave
      },
      include: {
        client: true,
        unit: { include: { project: true } },
        // Si tu modelo Quote tiene relación 'receipt', puedes habilitar esto:
        // receipt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quotes);
  } catch (err) {
    console.error('quotes:list error', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
