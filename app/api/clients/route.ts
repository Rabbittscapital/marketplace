// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const brokerId = (session.user as any)?.id;
  const clients = await prisma.client.findMany({
    where: { brokerId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const brokerId = (session.user as any)?.id;

  const body = await req.json();
  // Aceptamos name o (firstName + lastName) y lo mapeamos
  const name =
    (body.name && String(body.name).trim()) ||
    [body.firstName, body.lastName].filter(Boolean).join(' ').trim();

  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });

  const email = body.email ? String(body.email).trim() : null;
  const phone = body.phone ? String(body.phone).trim() : null;

  const client = await prisma.client.create({
    data: {
      name,
      email,
      phone,
      brokerId,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
