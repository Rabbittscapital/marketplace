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

    const result = await prisma.$transaction(async (tx) => {
      // Verifica que la cotización exista
      const quoteExists = await tx.quote.findUnique({
        where: { id: quoteId },
        select: { id: true, unitId: true },
      });
      if (!quoteExists) throw new Error('not_found');

      // ¿Ya existe recibo para esta cotización?
      const existing = await tx.receipt.findUnique({
        where: { quoteId }, // quoteId es @unique
        select: { id: true },
      });

      if (existing) {
        await tx.receipt.update({
          where: { quoteId },
          data: { url: receiptUrl.trim() },
        });
      } else {
        await tx.receipt.create({
          data: {
            url: receiptUrl.trim(),
            quote: { connect: { id: quoteId } },
          },
        });

        // (Opcional) al subir recibo por primera vez, marcar la unidad como no disponible
        if (quoteExists.unitId) {
          await tx.unit.update({
            where: { id: quoteExists.unitId },
            data: { available: false },
          });
        }
      }

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
