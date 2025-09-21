// app/api/units/bulk/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { projectId, rows } = await req.json();
    if (!projectId || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }

    const created: string[] = [];
    for (const r of rows) {
      const {
        code,
        typology,
        m2,
        bedrooms,
        bathrooms,
        floor,
        price,
        available,
      } = r;

      await prisma.unit.create({
        data: {
          projectId,
          code: String(code).trim(),
          typology: String(typology).trim(),
          m2: Number(m2),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          floor: floor == null ? null : Number(floor),
          price: Number(price),
          available: available == null ? true : Boolean(available),
        },
      });

      created.push(code);
    }

    return NextResponse.json({ ok: true, createdCount: created.length });
  } catch (err) {
    console.error('units/bulk error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
