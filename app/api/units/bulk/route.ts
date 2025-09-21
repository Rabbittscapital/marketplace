import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session as any)?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { projectId, csv } = await req.json();

  const rows = csv
    .split(/\r?\n/)
    .map((l: string) => l.trim())
    .filter(Boolean);

  // es CSV simple con encabezado
  const header = rows.shift();
  if (!header) return NextResponse.json({ error: "empty_csv" }, { status: 400 });

  const created = [];
  for (const row of rows) {
    const [code, typology, m2, bedrooms, bathrooms, price, currency, status] = row.split(",");
    const u = await prisma.unit.create({
      data: {
        projectId,
        code: code.trim(),
        typology: typology.trim(),
        m2: parseInt(m2),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        price: parseInt(price),
        currency: (currency || "USD").trim(),
        status: (status || "AVAILABLE").trim(),
      },
    });
    created.push(u.id);
  }

  return NextResponse.json({ ok: true, count: created.length });
}
