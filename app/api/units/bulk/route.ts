// app/api/units/bulk/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, rows } = body as {
      projectId: string;
      rows: Array<{
        code?: string | null;
        typology?: string | null;
        m2?: string | number | null;
        bedrooms?: string | number | null;
        bathrooms?: string | number | null;
        // floor?: string | number | null; // <- quitado
        price?: string | number | null;
        available?: string | boolean | null;
      }>;
    };

    if (!projectId || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }

    const created = [];
    for (const r of rows) {
      const {
        code = '',
        typology = '',
        m2 = null,
        bedrooms = null,
        bathrooms = null,
        // floor = null,                  // <- quitado
        price = null,
        available = null,
      } = r ?? {};

      const unit = await prisma.unit.create({
        data: {
          projectId,
          code: (code ?? '').trim(),
          typology: (typology ?? '').trim(),
          m2: m2 == null ? 0 : Number(m2),
          bedrooms: bedrooms == null ? 0 : Number(bedrooms),
          bathrooms: bathrooms == null ? 0 : Number(bathrooms),
          // floor: floor == null ? null : Number(floor),  // <- quitado
          price: price == null ? 0 : Number(price),
          available: available == null ? true : Boolean(available),
        },
      });

      created.push(unit.id);
    }

    return NextResponse.json({ ok: true, created });
  } catch (err) {
    console.error('units:bulk error', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
