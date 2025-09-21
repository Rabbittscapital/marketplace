// app/(components)/CreateQuoteForm.tsx
"use client";

import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string | null;
  email: string | null;
};

type Project = {
  id: string;
  name: string;
  currency: string;
};

type Unit = {
  id: string;
  code: string | null;
  typology: string | null;
  m2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  price: number | null;
  available: boolean;
  project?: Project | null;
};

export default function CreateQuoteForm() {
  const [clients, setClients] = useState<Client[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [clientId, setClientId] = useState("");
  const [unitId, setUnitId] = useState("");

  const [downPaymentPct, setDownPaymentPct] = useState<number | string>("");
  const [installments, setInstallments] = useState<number | string>("");
  const [installmentValue, setInstallmentValue] = useState<number | string>("");
  const [currency, setCurrency] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cambia estas URLs si tus endpoints son distintos
  const CLIENTS_URL = "/api/clients"; // GET: lista de clientes (del broker actual)
  // Opción A (común): /api/units?available=1
  const UNITS_URL = "/api/units?available=1";
  // Opción B (si tienes un endpoint dedicado): "/api/units/available"

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, uRes] = await Promise.all([fetch(CLIENTS_URL), fetch(UNITS_URL)]);
        const [cJson, uJson] = await Promise.all([cRes.json(), uRes.json()]);
        setClients(Array.isArray(cJson) ? cJson : []);
        setUnits(Array.isArray(uJson) ? uJson : []);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar clientes/unidades.");
      }
    };
    load();
  }, []);

  // Cuando seleccionas una unidad, si tiene project.currency y el campo currency está vacío, lo autocompleta
  useEffect(() => {
    if (!currency && unitId) {
      const u = units.find((x) => x.id === unitId);
      if (u?.project?.currency) setCurrency(u.project.currency);
    }
  }, [unitId, units, currency]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreated(null);

    try {
      const res = await fetch("/api/quote/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          clientId,
          downPaymentPct: Number(downPaymentPct || 0),
          installments: Number(installments || 0),
          installmentValue: Number(installmentValue || 0),
          currency: currency || undefined, // el server usa la del proyecto si viene vacío
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Error al crear la cotización.");
      } else {
        setCreated(json);
        // Limpieza rápida
        setDownPaymentPct("");
        setInstallments("");
        setInstallmentValue("");
        // deja unitId / clientId tal cual por si creas varias
      }
    } catch (e) {
      console.error(e);
      setError("Error de red al crear la cotización.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Crear Cotización</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1">Cliente</label>
          <select
            className="w-full border p-2 rounded"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.email || c.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Unidad</label>
          <select
            className="w-full border p-2 rounded"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            required
          >
            <option value="">Selecciona una unidad</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.project?.name ? `${u.project.name} — ` : ""}
                {u.code || u.typology || u.id}
                {u.m2 ? ` — ${u.m2} m²` : ""}
                {u.price ? ` — ${u.price}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm mb-1">% Pie (downPaymentPct)</label>
          <input
            type="number"
            min={0}
            step="1"
            className="w-full border p-2 rounded"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(e.target.value)}
            placeholder="Ej: 20"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">N° Cuotas (installments)</label>
          <input
            type="number"
            min={0}
            step="1"
            className="w-full border p-2 rounded"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            placeholder="Ej: 24"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Valor Cuota (installmentValue)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full border p-2 rounded"
            value={installmentValue}
            onChange={(e) => setInstallmentValue(e.target.value)}
            placeholder="Ej: 500"
          />
        </div>
      </div>

      <div className="max-w-sm">
        <label className="block text-sm mb-1">Moneda</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="USD / UF / CLP"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si lo dejas vacío y la unidad tiene proyecto con moneda, se usa esa.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !clientId || !unitId}
        className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Creando..." : "Crear Cotización"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {created && (
        <div className="text-sm p-2 border rounded">
          <p className="font-medium">¡Cotización creada!</p>
          <pre className="text-xs overflow-auto">{JSON.stringify(created, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
