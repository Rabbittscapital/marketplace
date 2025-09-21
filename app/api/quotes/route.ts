// app/api/quotes/mine/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1) Autenticación
    const session = await getServerSession(authOptions);
    const brokerId = session?.user?.id;
    if (!brokerId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // 2) Traer cotizaciones del broker logueado
    const quotes = await prisma.quote.findMany({
      where: { brokerId },
      include: {
        client: true,
        unit: { include: { project: true } },
        // receipt: true, // <- NO EXISTE en tu schema actual. Si algún día agregas la relación, re-actívalo.
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, quotes });
  } catch (err) {
    console.error("[quotes.mine] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
