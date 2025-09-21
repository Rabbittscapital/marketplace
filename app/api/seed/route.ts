import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// Opcional: asegura que esta ruta no se cachee en Vercel
export const dynamic = "force-dynamic";

export async function GET() {
  // 1) Usuarios demo: ADMIN y BROKER
  const adminEmail = "admin@demo.com";
  const brokerEmail = "broker@demo.com";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      passwordHash: await hash("admin1234", 8),
      role: "ADMIN",
    },
  });

  const broker = await prisma.user.upsert({
    where: { email: brokerEmail },
    update: {},
    create: {
      name: "Broker Demo",
      email: brokerEmail,
      passwordHash: await hash("demo1234", 8),
      role: "BROKER",
    },
  });

  // 2) Proyecto demo
  const project = await prisma.project.upsert({
    where: { id: "proj-demo-1" }, // clave estable para no duplicar
    update: {},
    create: {
      id: "proj-demo-1",
      name: "Demo Tower Downtown",
      coverUrl: "https://images.unsplash.com/photo-1467987506553-8f3916508521?q=80&w=1200&auto=format&fit=crop",
      address: "123 Main St",
      city: "Miami",
      country: "USA",
      deliveryDate: new Date(new Date().getFullYear(), 11, 31),
    },
  });

  // 3) Unidades demo (USD)
  const existingUnits = await prisma.unit.findMany({ where: { projectId: project.id } });
  if (existingUnits.length === 0) {
    await prisma.unit.createMany({
      data: [
        {
          projectId: project.id,
          code: "A-101",
          typology: "1D1B",
          m2: 42,
          bedrooms: 1,
          bathrooms: 1,
          price: 180000,
          currency: "USD",
          status: "AVAILABLE",
        },
        {
          projectId: project.id,
          code: "A-102",
          typology: "2D2B",
          m2: 65,
          bedrooms: 2,
          bathrooms: 2,
          price: 260000,
          currency: "USD",
          status: "AVAILABLE",
        },
        {
          projectId: project.id,
          code: "B-301",
          typology: "3D2B",
          m2: 85,
          bedrooms: 3,
          bathrooms: 2,
          price: 395000,
          currency: "USD",
          status: "AVAILABLE",
        },
      ],
    });
  }

  return NextResponse.json({
    ok: true,
    admin: { email: adminEmail, pass: "admin1234" },
    broker: { email: broker.email, pass: "demo1234" },
    project: { id: project.id, name: project.name },
    seededUnits: existingUnits.length === 0 ? 3 : existingUnits.length,
  });
}
