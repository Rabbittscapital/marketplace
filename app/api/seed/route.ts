// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminEmail = 'admin@demo.com';

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: 'Admin',
        email: adminEmail,
        password: await hash('admin123', 10), // en tu schema el campo es "password"
        role: 'ADMIN',
      },
    });

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, email: admin.email, role: admin.role },
      note: 'Seed OK. Admin admin@demo.com / admin123',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'seed_failed' }, { status: 500 });
  }
}
