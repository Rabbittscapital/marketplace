import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  try {
    // Admin
    await prisma.user.upsert({
      where: { email: "admin@demo.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@demo.com",
        passwordHash: await hash("admin123", 10),
        role: "ADMIN"
      }
    });

    // Broker demo
    const broker = await prisma.user.upsert({
      where: { email: "broker@demo.com" },
      update: {},
      create: {
        name: "Broker Demo",
        email: "broker@demo.com",
        passwordHash: await hash("broker123", 10),
        role: "BROKER"
      }
    });

    // Cliente demo del broker
    const client = await prisma.client.upsert({
      where: { email: "cliente@demo.com" },
      update: {},
      create: {
        firstName: "Juan",
        lastName: "Pérez",
        email: "cliente@demo.com",
        phone: "+56 9 5555 5555",
        brokerId: broker.id
      }
    });

    // Proyecto + Unidades
    const project = await prisma.project.upsert({
      where: { name: "Edificio Demo" },
      update: {},
      create: {
        name: "Edificio Demo",
        address: "Av. Principal 123",
        city: "Santiago",
        country: "Chile",
        units: {
          create: [
            {
              code: "A101",
              typology: "1D1B",
              m2: 42,
              bedrooms: 1,
              bathrooms: 1,
              price: 3200,
              currency: "UF",
              status: "AVAILABLE"
            },
            {
              code: "B405",
              typology: "2D2B",
              m2: 68,
              bedrooms: 2,
              bathrooms: 2,
              price: 125000,
              currency: "USD",
              status: "AVAILABLE"
            }
          ]
        }
      },
      include: { units: true }
    });

    return NextResponse.json({
      ok: true,
      brokerId: broker.id,
      clientId: client.id,
      projectId: project.id,
      unitIds: project.units.map(u => u.id)
    });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}
