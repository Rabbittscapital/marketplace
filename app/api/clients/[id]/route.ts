import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;
  if (!brokerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const c = await prisma.client.findFirst({ where: { id: params.id, brokerId } });
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;
  if (!brokerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const exists = await prisma.client.findFirst({ where: { id: params.id, brokerId } });
  if (!exists) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { firstName, lastName, email, phone } = await req.json();
  const updated = await prisma.client.update({
    where: { id: params.id },
    data: { firstName, lastName, email, phone },
  });
  return NextResponse.json({ ok: true, client: updated });
}
