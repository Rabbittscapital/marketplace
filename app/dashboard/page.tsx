// app/dashboard/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const brokerId = (session as any)?.user?.id;

  const [clients, quotes] = await Promise.all([
    prisma.client.findMany({ where: { brokerId }, orderBy: { createdAt: "desc" } }),
    prisma.quote.findMany({
      where: { brokerId },
      include: { client: true, unit: { include: { project: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1>Mi panel</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Mis clientes</h3>
        <Link className="btn" href="/dashboard/nuevo-cliente">+ Nuevo cliente</Link>
        <div style={{ marginTop: 12 }}>
          {clients.length === 0 && <div>No tienes clientes aún.</div>}
          {clients.map(c => (
            <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <b>{c.firstName} {c.lastName}</b> — {c.email} — {c.phone}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Mis cotizaciones</h3>
        {quotes.length === 0 && <div>No tienes cotizaciones aún.</div>}
        {quotes.map(q => (
          <div key={q.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <div>
              <b>{q.unit.project.name} — {q.unit.code}</b> · Cliente: {q.client.firstName} {q.client.lastName}
            </div>
            <div style={{ color:"#666", fontSize:14 }}>
              Pie {q.downPaymentPct}% · {q.installments} cuotas ·
              Est. cuota: {q.unit.currency} {q.installmentValue.toLocaleString()}
            </div>
            <div style={{ marginTop: 6 }}>
              <Link className="btn" href={`/quotes/${q.id}`}>Ver / Imprimir</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
