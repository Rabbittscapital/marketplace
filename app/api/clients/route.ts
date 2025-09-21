import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const brokerId = searchParams.get("brokerId") ?? "";
  if (!brokerId) return NextResponse.json([], { status: 200 });

  const clients = await prisma.client.findMany({
    where: { brokerId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const data = await req.formData();
  const brokerId   = (data.get("brokerId") as string) || "";
  const firstName  = (data.get("firstName") as string) || "";
  const lastName   = (data.get("lastName") as string) || "";
  const email      = (data.get("email") as string) || "";
  const phone      = (data.get("phone") as string) || null;

  if (!brokerId || !firstName || !lastName || !email) {
    return NextResponse.json({ ok:false, error:"missing_fields" }, { status:400 });
  }

  const client = await prisma.client.create({
    data: { brokerId, firstName, lastName, email, phone }
  });

  return NextResponse.redirect(new URL("/dashboard", req.url), 302);
}
