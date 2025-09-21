// app/api/quotes/[id]/receipt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/quotes/:id/receipt
// Body: { receiptUrl: string }
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { receiptUrl } = (await req.json().catch(() => ({}))) as {
      receiptUrl?: string;
    };

    if (!receiptUrl || typeof receiptUrl !== 'string' || !receiptUrl.trim()) {
      return NextResponse.json({ error: 'receipt_url_required' }, { status: 400 });
    }

    const quoteId = params.id;

    // Transacción: si ya hay receipt -> update; si no -> create.
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.quote.findUnique({
        where: { id: quoteId },
        select: { id: true, receiptId: true, unitId: true },
      });

      if (!current) {
        throw new Error('not_found');
      }

      if (current.receiptId) {
        // Actualiza el URL del recibo existente
        await tx.receipt.update({
          where: { id: current.receiptId },
          data: { url: receiptUrl.trim() },
        });
      } else {
        // Crea el recibo y lo asocia a la cotización
        await tx.receipt.create({
          data: {
            url: receiptUrl.trim(),
            quote: { connect: { id: quoteId } },
          },
        });

        // (Opcional) Marcar la unidad como no disponible al adjuntar recibo por primera vez
        if (current.unitId) {
          await tx.unit.update({
            where: { id: current.unitId },
            data: { available: false },
          });
        }
      }

      // Devuelve la cotización con relaciones útiles
      return tx.quote.findUnique({
        where: { id: quoteId },
        include: {
          unit: { include: { project: true } },
          client: true,
          receipt: true,
        },
      });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err?.message === 'not_found') {
      return NextResponse.json({ error: 'quote_not_found' }, { status: 404 });
    }
    console.error('POST /quotes/[id]/receipt error:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
