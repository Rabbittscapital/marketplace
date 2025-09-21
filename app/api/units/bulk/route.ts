// app/api/units/bulk/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { projectId, rows } = await req.json() as {
    projectId: string;
    rows: Array<Record<string, string | number | null | undefined>>;
  };

  if (!projectId || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  // Normalizamos claves esperadas
  const prepared = rows.map((r) => {
    const code = String(r.code ?? '').trim();
    const typology = String(r.typology ?? '').trim();
    const m2 = Number(r.m2 ?? 0);
    const bedrooms = Number(r.bedrooms ?? 0);
    const bathrooms = Number(r.bathrooms ?? 0);
    const price = r.price == null || r.price === '' ? null : Number(r.price);
    const available = r.available == null ? true : Boolean(r.available);

    if (!code || !typology || Number.isNaN(m2)) {
      throw new Error('invalid_row');
    }

    return {
      projectId,
      code,
      typology,
      m2,
      bedrooms,
      bathrooms,
      price,
      available,
    };
  });

  // Opcional: eliminar existentes por code + projectId para reimportar limpio
  // await prisma.unit.deleteMany({ where: { projectId } });

  // createMany ignora duplicados si seteas skipDuplicates
  const result = await prisma.unit.createMany({
    data: prepared,
    skipDuplicates: true,
  });

  return NextResponse.json({ inserted: result.count });
}
