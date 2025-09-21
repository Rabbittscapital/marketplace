// app/api/quotes/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const brokerId = (session.user as any)?.id;

  const quotes = await prisma.quote.findMany({
    where: { client: { brokerId } }, // ← filtra por el broker del cliente
    include: {
      client: true,
      unit: { include: { project: true } },
      receipt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(quotes);
}
