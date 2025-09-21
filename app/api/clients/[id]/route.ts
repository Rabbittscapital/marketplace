// app/api/clients/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const brokerId = session?.user?.id;
  if (!brokerId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Si quieres restringir por broker, descomenta brokerId en where
  const client = await prisma.client.findFirst({
    where: {
      id: params.id,
      // brokerId,
    },
  });

  if (!client) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json(client);
}
