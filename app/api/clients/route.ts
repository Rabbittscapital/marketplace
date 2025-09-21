// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function asTrimmed(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

async function readPayload(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';

  // Soporta formData (multipart o x-www-form-urlencoded)
  if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
    const fd = await req.formData();
    return {
      name: asTrimmed(fd.get('name')),
      firstName: asTrimmed(fd.get('firstName')),
      lastName: asTrimmed(fd.get('lastName')),
      email: asTrimmed(fd.get('email')),
      phone: asTrimmed(fd.get('phone')),
    };
  }

  // Por defecto, intenta JSON
  const body = (await req.json().catch(() => ({}))) as any;
  return {
    name: asTrimmed(body?.name),
    firstName: asTrimmed(body?.firstName),
    lastName: asTrimmed(body?.lastName),
    email: asTrimmed(body?.email),
    phone: asTrimmed(body?.phone),
  };
}

// POST /api/clients — crea un cliente
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = (session?.user as any)?.id as string | undefined;

    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const p = await readPayload(req);

    // Si no viene "name", lo armamos con firstName + lastName
    const name = (p.name || `${p.firstName} ${p.lastName}`.trim()).trim();
    if (!name) {
      return NextResponse.json({ error: 'name_required' }, { status: 400 });
    }

    await prisma.client.create({
      data: {
        name,
        email: p.email || undefined,
        phone: p.phone || undefined,
        brokerId, // relación al usuario (broker) actual
      },
    });

    // Redirige al dashboard tras crear
    return NextResponse.redirect(new URL('/dashboard', req.url), 302);
  } catch (err) {
    console.error('POST /api/clients error:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
