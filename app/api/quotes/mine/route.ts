import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// Usa el alias "@/lib/*". Si tu proyecto no resuelve "@", cambia estas dos líneas por rutas relativas:
// import { authOptions } from "../../../../lib/auth";
// import { prisma } from "../../../../lib/prisma";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Asegura que el broker esté autenticado
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const brokerId = session.user.id;

    const quotes = await prisma.quote.findMany({
      where: { brokerId },
      include: {
        client: true,
        // Trae la unidad y el proyecto para poder leer currency desde unit.project.currency
        unit: { include: { project: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // NOTA: `receiptUrl` es un campo escalar del modelo Quote,
    // no hace falta "include" para verlo; viene en cada item de `quotes`.
    return NextResponse.json(quotes);
  } catch (err) {
    console.error("[GET /api/quotes/mine] ", err);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
