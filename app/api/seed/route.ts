// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Crea admin si no existe
    const adminEmail = 'admin@demo.com';
    const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!exists) {
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          password: await hash('admin123', 10), // 👈 ahora se llama "password"
          role: 'ADMIN',
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('seed error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
