import { prisma } from "@/lib/prisma";

export default async function QuotePrint({ params }: { params: { id: string } }) {
  const q = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      unit: { include: { project: true } },
    },
  });
  if (!q) return <div className="card">Cotización no existe.</div>;

  const { unit, client } = q;
  return (
    <div className="card" style={{ background: "#fff" }}>
      <h2>Rabbitts Capital — Cotización</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div>
          <h3>Cliente</h3>
          <div><b>{client.firstName} {client.lastName}</b></div>
          <div>{client.email}</div>
          <div>{client.phone}</div>
        </div>
        <div>
          <h3>Unidad</h3>
          <div><b>{unit.project.name}</b> — {unit.code}</div>
          <div>{unit.typology} · {unit.m2} m² · {unit.bedrooms}D/{unit.bathrooms}B</div>
          <div><b>{unit.currency} {unit.price.toLocaleString()}</b></div>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>Financiamiento</h3>
      <div>Pie: {q.downPaymentPct}% — Cuotas: {q.installments}</div>
      <div>Cuota estimada: <b>{unit.currency} {q.installmentValue.toLocaleString()}</b></div>

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={()=>window.print()}>Imprimir</button>
      </div>
    </div>
  );
}
