// app/api/quotes/mine/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const brokerId = session.user.id;

    const quotes = await prisma.quote.findMany({
      where: { brokerId },
      include: {
        client: true,
        unit: { include: { project: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, quotes });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: 'quotes_fetch_failed' },
      { status: 500 },
    );
  }
}
