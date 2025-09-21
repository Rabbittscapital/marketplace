// app/api/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/**
 * Semilla mínima:
 * - Crea/asegura un usuario ADMIN con email admin@demo.com y pass admin123
 * - Idempotente: usa upsert por email
 */
export async function GET() {
  try {
    // Opcional: limitar a entornos no productivos
    // if (process.env.NODE_ENV === "production") {
    //   return NextResponse.json({ error: "forbidden" }, { status: 403 });
    // }

    const adminEmail = "admin@demo.com";

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {}, // si ya existe, no cambia nada
      create: {
        name: "Admin",
        email: adminEmail,
        // OJO: el campo correcto es "password", no "passwordHash"
        password: await hash("admin123", 10),
        role: "ADMIN",
      },
    });

    return NextResponse.json({ ok: true, seeded: ["admin@demo.com"] });
  } catch (err) {
    console.error("[SEED ERROR]", err);
    return NextResponse.json({ error: "seed_failed" }, { status: 500 });
  }
}
