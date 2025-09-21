import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session as any)?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { name, coverUrl, address, city, country, deliveryDate } = await req.json();
  const p = await prisma.project.create({
    data: { name, coverUrl, address, city, country, deliveryDate: new Date(deliveryDate) },
  });
  return NextResponse.json({ ok: true, project: p });
}
