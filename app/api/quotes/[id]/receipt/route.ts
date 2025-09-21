// app/api/quotes/[id]/receipt/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // Asegúrate de que existe la quote
  const quote = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!quote) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // 1–1: si ya hay Receipt, la actualizamos; si no, la creamos
  const receipt = await prisma.receipt.upsert({
    where: { quoteId: quote.id },
    create: { quoteId: quote.id, url },
    update: { url },
  });

  return NextResponse.json(receipt, { status: 201 });
}
