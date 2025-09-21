// app/api/quotes/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id ?? null;
    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const quotes = await prisma.quote.findMany({
      where: { client: { brokerId } }, // 🔹 cambio aquí
      include: {
        client: true,
        unit: { include: { project: true } },
        receipt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quotes, { status: 200 });
  } catch (e) {
    console.error('quotes:GET error', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
