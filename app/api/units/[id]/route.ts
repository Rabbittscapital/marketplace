import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const unit = await prisma.unit.findUnique({
    where: { id: params.id },
    include: { project: true }
  });
  if (!unit) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(unit);
}
