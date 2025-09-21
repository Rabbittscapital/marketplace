// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/clients  -> lista
export async function GET() {
  const session = await getServerSession(authOptions);
  const brokerId = session?.user?.id;
  if (!brokerId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: {
      // brokerId,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(clients);
}

// POST /api/clients -> crea
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const brokerId = session?.user?.id;
  if (!brokerId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const rawName: string | undefined = body.name?.trim();
  const firstNameFromBody: string | undefined = body.firstName?.trim();
  const lastNameFromBody: string | undefined = body.lastName?.trim();
  const emailRaw: string | undefined = body.email?.trim() || undefined;
  const phoneRaw: string | undefined = body.phone?.trim() || undefined;

  // Resolver firstName/lastName desde name si vino junto
  let firstName = firstNameFromBody;
  let lastName = lastNameFromBody;

  if (!firstName && rawName) {
    const parts = rawName.split(/\s+/);
    firstName = parts.shift() || rawName;
    lastName = parts.length ? parts.join(' ') : '';
  }

  if (!firstName) {
    return NextResponse.json({ error: 'firstName_required' }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      firstName,
      lastName: lastName || null,
      email: emailRaw || null,
      phone: phoneRaw || null,
      // si tu modelo tiene brokerId y quieres asociar:
      // brokerId,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
