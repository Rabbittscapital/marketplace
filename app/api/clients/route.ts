// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id ?? null;
    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    // Aceptamos { name, email, phone } o un solo string "name"
    let name = (body?.name ?? body?.firstName ?? '').toString().trim(); // por si tu form aún manda firstName
    const emailRaw = (body?.email ?? null) as string | null;
    const phoneRaw = (body?.phone ?? null) as string | null;

    if (!name && !emailRaw && !phoneRaw) {
      return NextResponse.json(
        { error: 'missing_fields', detail: 'Envíe name, email o phone' },
        { status: 400 }
      );
    }
    if (!name) name = 'Sin nombre';

    // Si viene email, intentamos encontrar uno existente (para no romper unique)
    let existing = null as null | { id: string };
    if (emailRaw) {
      existing = await prisma.client.findFirst({
        where: { email: emailRaw },
        select: { id: true },
      });
    }

    const client = existing
      ? await prisma.client.update({
          where: { id: existing.id },
          data: {
            // actualizamos datos útiles y asociamos broker si no tenía
            name,
            phone: phoneRaw ?? undefined,
            brokerId, // si ya tenía otro broker, puedes quitar esta línea
          },
        })
      : await prisma.client.create({
          data: {
            name,
            email: emailRaw,
            phone: phoneRaw,
            brokerId,
          },
        });

    return NextResponse.json(client, { status: 201 });
  } catch (e) {
    console.error('clients:POST error', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
