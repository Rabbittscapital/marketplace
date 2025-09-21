// app/api/quotes/[id]/receipt/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { receiptUrl, statusAfter } = await req.json(); // statusAfter p.ej.: "RESERVED_PENDING" | "RESERVED_CONFIRMED"
    if (!receiptUrl) {
      return NextResponse.json({ error: "missing_receipt_url" }, { status: 400 });
    }

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: { receiptUrl },
      include: { unit: true },
    });

    if (statusAfter && typeof statusAfter === "string") {
      await prisma.unit.update({
        where: { id: quote.unitId },
        data: { status: statusAfter },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
