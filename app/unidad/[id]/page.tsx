"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Unit = {
  id: string;
  code: string;
  typology: string;
  m2: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  currency: string; // "USD" | "UF"
  status: string;   // "AVAILABLE" | ...
  project: { id: string; name: string };
};

type Client = { id: string; firstName: string; lastName: string; email: string };

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  // btoa funciona en cliente
  return typeof window !== "undefined" ? window.btoa(binary) : "";
}

export default function UnitPage({ params }: { params: { id: string } }) {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

  // plan de pago
  const [installments, setInstallments] = useState(12);
  const [downPct, setDownPct] = useState(20);

  // clientes del broker
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>("");

  // cotización
  const [creating, setCreating] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  // comprobante
  const [receipt, setReceipt] = useState<File | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/units/${params.id}`).then((r) => r.json()),
      fetch(`/api/clients`).then((r) => r.json()),
    ])
      .then(([u, cs]) => {
        setUnit(u);
        setClients(Array.isArray(cs) ? cs : []);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="card">Cargando…</div>;
  if (!unit) return <div className="card">Unidad no encontrada.</div>;

  const calcDown = Math.round((unit.price * downPct) / 100);
  const rest = unit.price - calcDown;
  const perInstall = Math.round(rest / Math.max(1, installments));

  async function createQuote() {
    if (!clientId) {
      alert("Selecciona un cliente primero.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`/api/quote/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId: unit.id,
          clientId,               // <-- importante
          downPaymentPct: downPct,
          installments,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Error creando cotización");
      }
      const data = await res.json();
      setQuoteId(data.quoteId);
      alert("Cotización creada. Ahora sube el comprobante para reservar.");
    } catch (e: any) {
      alert(e.message || "Error creando cotización.");
    } finally {
      setCreating(false);
    }
  }

  async function uploadReceipt() {
    if (!quoteId || !receipt) {
      alert("Primero crea la cotización y selecciona el archivo de comprobante.");
      return;
    }
    try {
      const content = await receipt.arrayBuffer();
      const base64 = arrayBufferToBase64(content);
      const res = await fetch(`/api/receipt/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          fileName: receipt.name,
          mimeType: receipt.type || "application/octet-stream",
          contentB64: base64,
          note: "Reserva online",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert("Comprobante recibido y unidad reservada.");
        window.location.href = `/proyectos/${unit.project.id}`;
      } else {
        throw new Error(data.error || "Error subiendo comprobante.");
      }
    } catch (e: any) {
      alert(e.message || "No se pudo subir el comprobante.");
    }
  }

  return (
    <div>
      <Link href={`/proyectos/${unit.project.id}`} className="btn secondary" style={{ marginBottom: 16 }}>
        ← Volver al proyecto
      </Link>

      <div className="card" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>
          {unit.project.name} — {unit.code}
        </h1>
        <div style={{ color: "#666", marginTop: 6 }}>
          {unit.typology} · {unit.m2} m² · {unit.bedrooms}D/{unit.bathrooms}B
        </div>
        <div style={{ marginTop: 8, fontSize: 18 }}>
          <b>
            {unit.currency} {Number(unit.price).toLocaleString()}
          </b>{" "}
          — <span style={{ color: unit.status === "AVAILABLE" ? "green" : "#b00" }}>{unit.status}</span>
        </div>
      </div>

      <div className="card">
        <h3>Plan de pago</h3>

        {/* Selección de cliente */}
        <div style={{ marginBottom: 12 }}>
          <label className="label">Cliente</label>
          <select className="input" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Selecciona un cliente…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} — {c.email}
              </option>
            ))}
          </select>
          <div style={{ fontSize: 12, marginTop: 6 }}>
            ¿Cliente nuevo? <a href="/dashboard/nuevo-cliente">créalo aquí</a> y vuelve.
          </div>
        </div>

        {/* Parámetros de la cotización */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div>
            <label className="label">Pie (%)</label>
            <input
              className="input"
              type="number"
              min={0}
              max={90}
              value={downPct}
              onChange={(e) => setDownPct(parseInt(e.target.value || "0", 10))}
            />
          </div>
          <div>
            <label className="label">Cuotas</label>
            <input
              className="input"
              type="number"
              min={1}
              max={60}
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value || "1", 10))}
            />
          </div>
          <div>
            <label className="label">Pie (monto estimado)</label>
            <div className="input" style={{ background: "#fafafa" }}>
              {unit.currency} {calcDown.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="label">Saldo</label>
            <div className="input" style={{ background: "#fafafa" }}>
              {unit.currency} {rest.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="label">Cuota estimada</label>
            <div className="input" style={{ background: "#fafafa" }}>
              {unit.currency} {perInstall.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn" disabled={creating || !clientId} onClick={createQuote}>
            {creating ? "Creando…" : "Generar cotización"}
          </button>
        </div>

        <hr style={{ margin: "18px 0" }} />

        <h4>Subir comprobante de reserva</h4>
        <input type="file" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={uploadReceipt} disabled={!quoteId}>
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  );
}
