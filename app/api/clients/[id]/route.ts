// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Crea un cliente nuevo
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = (session?.user as any)?.id as string | undefined;

    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Aceptamos tanto { name } como { firstName, lastName } desde el formulario
    const form = await req.formData();

    const rawName = (form.get('name') as string | null)?.trim() ?? '';
    const firstName = (form.get('firstName') as string | null)?.trim() ?? '';
    const lastName = (form.get('lastName') as string | null)?.trim() ?? '';

    // Si no viene name, lo construimos con firstName + lastName
    const name = (rawName || `${firstName} ${lastName}`.trim()).trim();

    const emailRaw = (form.get('email') as string | null)?.trim() ?? '';
    const phoneRaw = (form.get('phone') as string | null)?.trim() ?? '';

    if (!name) {
      return NextResponse.json({ error: 'name_required' }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email: emailRaw || undefined,
        phone: phoneRaw || undefined,
        brokerId, // ← relación opcional al usuario (broker) logueado
      },
    });

    // Redirige al dashboard (ajusta si quieres ir a otra ruta)
    return NextResponse.redirect(new URL('/dashboard', req.url), 302);
  } catch (err) {
    console.error('POST /api/clients error:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
