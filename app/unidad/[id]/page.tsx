// ... (import y estado previos)
type Client = { id: string; firstName: string; lastName: string; email: string };

const [clients, setClients] = useState<Client[]>([]);
const [clientId, setClientId] = useState<string>("");

useEffect(() => {
  fetch(`/api/units/${params.id}`).then(r => r.json()).then(setUnit).finally(()=>setLoading(false));
  fetch(`/api/clients`).then(r => r.json()).then(setClients);
}, [params.id]);

// ...

<div className="card">
  <h3>Plan de pago</h3>

  {/* Seleccionar cliente */}
  <div style={{ marginBottom: 12 }}>
    <label className="label">Cliente</label>
    <select className="input" value={clientId} onChange={(e)=>setClientId(e.target.value)}>
      <option value="">Selecciona un cliente…</option>
      {clients.map(c=>(
        <option key={c.id} value={c.id}>{c.firstName} {c.lastName} — {c.email}</option>
      ))}
    </select>
    <div style={{ fontSize:12, marginTop:6 }}>
      ¿Cliente nuevo? <a href="/dashboard/nuevo-cliente">crearlo aquí</a> y vuelve.
    </div>
  </div>

  {/* Resto del formulario (pie/cuotas) se mantiene */}
  {/* ... */}

  <div style={{ marginTop: 16 }}>
    <button className="btn" disabled={creating || !clientId} onClick={createQuote}>
      {creating ? "Creando…" : "Generar cotización"}
    </button>
  </div>

  {/* ... subir recibo ... */}
</div>

// En createQuote(), añade clientId:
body: JSON.stringify({
  unitId: unit.id,
  clientId,             // <---- nuevo
  downPaymentPct: downPct,
  installments,
}),
