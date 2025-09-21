// ...imports iguales
export async function GET() {
  // Admin
  const adminEmail = "admin@demo.com";
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

  // Broker demo (igual)
  const email = "broker@demo.com";
  const broker = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Broker Demo",
      email,
      passwordHash: await hash("demo1234", 8),
      role: "BROKER",
    },
  });

  // ...resto del seed (proyectos & unidades) igual...
  // (devuelve también credenciales admin)
  return NextResponse.json({
    ok: true,
    admin: { email: adminEmail, pass: "admin1234" },
    broker: { email: broker.email, pass: "demo1234" },
    // projects...
  });
}
