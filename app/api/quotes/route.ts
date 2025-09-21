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

    // 2) Cotizaciones del broker logueado
    const quotes = await prisma.quote.findMany({
      where: { brokerId },
      include: {
        client: true,
        unit: {
          include: {
            project: true, // para leer currency desde unit.project.currency
          },
        },
        // ⛔ OJO: NO pongas receipt aquí porque no existe en tu schema actual.
        // Si más adelante agregas un modelo/relación Receipt, recién ahí lo activamos.
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, quotes });
  } catch (err) {
    console.error("[quotes.mine] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
