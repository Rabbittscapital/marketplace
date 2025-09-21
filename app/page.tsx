type Unit = {
  id: string; code: string; typology: string; m2: number; bedrooms: number; bathrooms: number;
  price: number; currency: string; status: string;
  project: { id: string; name: string };
};

async function getUnit(id: string): Promise<Unit | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/units/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function UnitPage({ params }: { params: { id: string } }) {
  const unit = await getUnit(params.id);
  if (!unit) {
    return <main style={{maxWidth:780,margin:"40px auto",padding:"0 16px"}}>Unidad no encontrada.</main>;
  }

  return (
    <main style={{maxWidth:780,margin:"40px auto",padding:"0 16px"}}>
      <h2>Unidad {unit.code} — {unit.project.name}</h2>
      <p>
        {unit.typology} • {unit.m2} m² • {unit.bedrooms}D/{unit.bathrooms}B
      </p>
      <p>
        <b>Precio:</b> {unit.currency} {unit.price.toLocaleString()} — <b>Estado:</b> {unit.status}
      </p>

      <h3 style={{marginTop:24}}>Crear cotización (demo)</h3>
      <form action={`/api/quotes`} method="post" style={{display:"grid",gap:10,maxWidth:420}}>
        <input type="hidden" name="unitId" value={unit.id}/>
        {/* En producción, brokerId vendrá del usuario logueado (NextAuth) */}
        <label>
          Broker ID (demo)
          <input name="brokerId" required placeholder="pegue el id de broker (seed)" />
        </label>
        <label>
          Cliente
          <select name="clientId" required>
            {/* Para demo, el endpoint de seed crea un cliente "cliente@demo.com".
                Podríamos listar clientes del broker con otro fetch;
                para simplificar, permitimos pegar el ID aquí también. */}
            <option value="">-- Seleccionar (o pegue ID) --</option>
          </select>
        </label>
        <label>
          ClienteID manual (si no aparece arriba)
          <input name="clientIdManual" placeholder="si no tienes lista, pega aquí el ID" />
        </label>
        <label>
          Pie (%) 
          <input type="number" name="downPaymentPct" defaultValue={20} min={0} max={90}/>
        </label>
        <label>
          Cuotas
          <input type="number" name="installments" defaultValue={120} min={1}/>
        </label>

        <button className="btn" type="submit">Guardar cotización</button>
      </form>

      <p style={{fontSize:12,opacity:.7,marginTop:8}}>
        Tip: primero ejecuta <code>POST /api/seed</code> para crear el broker/cliente demo.
      </p>

      <style jsx>{`
        label{display:grid;gap:4px}
        input, select{padding:8px;border:1px solid #ddd;border-radius:8px}
        .btn{padding:10px 14px;border-radius:8px;background:#111;color:#fff;border:0}
      `}</style>
    </main>
  );
}
