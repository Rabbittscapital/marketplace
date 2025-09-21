import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.formData();

  const unitId        = (data.get("unitId") as string) || "";
  const rawClientId   = (data.get("clientId") as string) || "";
  const clientIdManual= (data.get("clientIdManual") as string) || "";
  const clientId      = rawClientId || clientIdManual;
  const brokerId      = (data.get("brokerId") as string) || "";
  const downPaymentPct= Number(data.get("downPaymentPct") || 20);
  const installments  = Number(data.get("installments") || 120);

  if (!unitId || !clientId || !brokerId) {
    return NextResponse.json({ ok:false, error:"missing_fields" }, { status:400 });
  }

  const unit = await prisma.unit.findUnique({ where: { id: unitId } });
  if (!unit) return NextResponse.json({ ok:false, error:"unit_not_found" }, { status:404 });

  const calculatedDownPayment = Math.round(unit.price * (downPaymentPct/100));

  const quote = await prisma.quote.create({
    data: {
      unitId,
      clientId,
      brokerId,
      downPaymentPct,
      installments,
      calculatedDownPayment
    }
  });

  return NextResponse.redirect(new URL(`/proyectos`, req.url), 302);
}
