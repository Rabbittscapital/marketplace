import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET -> lista del broker
export async function GET() {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;
  if (!brokerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { brokerId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

// POST -> crear cliente
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;
  if (!brokerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { firstName, lastName, email, phone } = await req.json();
  const c = await prisma.client.create({
    data: { firstName, lastName, email, phone, brokerId },
  });
  return NextResponse.json({ ok: true, client: c });
}
