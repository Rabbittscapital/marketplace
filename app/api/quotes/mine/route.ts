import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;
  if (!brokerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const quotes = await prisma.quote.findMany({
    where: { brokerId },
    include: {
      client: true,
      unit: { include: { project: true } },
      receipt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}
