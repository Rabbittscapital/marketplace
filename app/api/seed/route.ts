// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Admin
    const adminEmail = 'admin@demo.com';

    // crea o actualiza admin
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: 'Admin',
        email: adminEmail,
        // OJO: en tu schema el campo es "password", no "passwordHash"
        password: await hash('admin123', 10),
        role: 'ADMIN',
      },
    });

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, email: admin.email, role: admin.role },
      note:
        'Seed OK. Admin creado/asegurado. Credenciales por defecto admin@demo.com / admin123',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: 'seed_failed' },
      { status: 500 }
    );
  }
}
