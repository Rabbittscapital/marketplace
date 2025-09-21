// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = (session?.user as any)?.id || null;

    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const c = await prisma.client.findFirst({
      where: { id: params.id, brokerId },
    });

    if (!c) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json(c);
  } catch (err) {
    console.error('GET /api/clients/[id] error:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
