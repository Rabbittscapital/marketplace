// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const brokerId = (session.user as any)?.id;

  const c = await prisma.client.findFirst({
    where: { id: params.id, brokerId },
  });

  if (!c) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(c);
}
