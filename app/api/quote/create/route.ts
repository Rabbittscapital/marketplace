// app/api/quote/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type CreateQuoteBody = {
  unitId: string;
  client?: {
    id?: string;
    name?: string;
    email?: string | null;
    phone?: string | null;
  };
  downPaymentPct: number | string;
  installments: number | string;
  installmentValue: number | string;
  currency?: string; // opcional; si no viene, usa unit.project.currency
};

// Genera un número único simple para la cotización
async function generateQuoteNumber(): Promise<string> {
  // Formato: Q-YYYYMMDD-HHMMSS-<4dig>
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  let number = `Q-${y}${m}${d}-${hh}${mm}${ss}-${rand}`;

  // En caso MUY raro de colisión, reintenta unas veces
  for (let i = 0; i < 3; i++) {
    const exists = await prisma.quote.findUnique({ where: { number } });
    if (!exists) return number;
    number = `Q-${y}${m}${d}-${hh}${mm}${ss}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;
  }
  return number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id ?? null;
    if (!brokerId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as CreateQuoteBody;

    // Validaciones básicas
    if (!body?.unitId) {
      return NextResponse.json({ error: 'unit_id_required' }, { status: 400 });
    }
    const dp = Number(body.downPaymentPct);
    const installments = Number(body.installments);
    const installmentValue = Number(body.installmentValue);

    if (
      Number.isNaN(dp) ||
      Number.isNaN(installments) ||
      Number.isNaN(installmentValue)
    ) {
      return NextResponse.json({ error: 'invalid_numbers' }, { status: 400 });
    }

    // Busca la unidad con el proyecto (para leer currency)
    const unit = await prisma.unit.findFirst({
      where: { id: body.unitId, available: true },
      include: { project: true },
    });
    if (!unit) {
      // no encontrada o no disponible
      return NextResponse.json(
        { error: 'unit_not_found_or_unavailable' },
        { status: 404 }
      );
    }

    // Determinar moneda: prioridad payload > project.currency
    const currency =
      (body.currency ?? '').trim() || unit.project.currency || 'USD';

    // Resolver cliente:
    // 1) Si viene id -> lo usamos
    // 2) Si viene email -> intentamos encontrar uno del mismo broker
    // 3) Si no existe -> lo creamos (name/email/phone, brokerId)
    let clientId: string | null = null;

    if (body.client?.id) {
      const existing = await prisma.client.findUnique({
        where: { id: body.client.id },
      });
      if (!existing) {
        return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
      }
      clientId = existing.id;
    } else if (body.client?.email) {
      const byEmail = await prisma.client.findFirst({
        where: {
          email: body.client.email,
          // Si quieres forzar pertenencia al broker:
          // brokerId: brokerId,
        },
      });

      if (byEmail) {
        clientId = byEmail.id;
      } else {
        const created = await prisma.client.create({
          data: {
            name: (body.client?.name ?? '').trim() || 'Sin nombre',
            email: body.client?.email ?? null,
            phone: body.client?.phone ?? null,
            brokerId, // asigna el cliente al broker logueado
          },
        });
        clientId = created.id;
      }
    } else {
      // No id ni email -> creamos cliente mínimo
      const created = await prisma.client.create({
        data: {
          name: (body.client?.name ?? '').trim() || 'Sin nombre',
          email: body.client?.email ?? null,
          phone: body.client?.phone ?? null,
          brokerId,
        },
      });
      clientId = created.id;
    }

    // Crear número único de cotización
    const number = await generateQuoteNumber();

    // Crear Quote conectando relaciones
    const quote = await prisma.quote.create({
      data: {
        number,
        downPaymentPct: dp,
        installments,
        installmentValue,
        currency,
        unit: { connect: { id: unit.id } },
        client: { connect: { id: clientId! } },
      },
      include: {
        unit: { include: { project: true } },
        client: true,
        receipt: true,
      },
    });

    // NO cambiamos availability aquí. Se bloquearía al subir el Receipt.
    // Si quisieras bloquear de inmediato, descomenta:
    // await prisma.unit.update({ where: { id: unit.id }, data: { available: false } });

    return NextResponse.json(quote, { status: 201 });
  } catch (err) {
    console.error('quote:create error', err);
    // Si el fallo es por unique(number), reintenta 1 vez
    const msg = `${err}`;
    if (msg.includes('Unique constraint failed on the fields: (`number`)')) {
      try {
        const retryNumber = await generateQuoteNumber();
        // No podemos reusar variables locales (unit, clientId, currency, etc.) fuera del scope,
        // así que mejor retornamos error específico para reintento desde el frontend si quieres.
        return NextResponse.json(
          { error: 'quote_number_collision', retry: true },
          { status: 409 }
        );
      } catch {
        /* ignore */
      }
    }
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
