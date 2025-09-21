async function getClients(brokerId: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/clients?brokerId=${brokerId}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  // Para demo pegamos brokerId manual. En producción sale de la sesión del usuario.
  const demoBrokerId = ""; // puedes dejarlo vacío; crea clientes con el form
  const clients = demoBrokerId ? await getClients(demoBrokerId) : [];

  return (
    <main style={{maxWidth:900,margin:"40px auto",padding:"0 16px"}}>
      <h2>Dashboard (demo)</h2>

      <section style={{marginTop:24}}>
        <h3>Crear cliente</h3>
        <form action="/api/clients" method="post" style={{display:"grid",gap:10,maxWidth:560}}>
          <label>Broker ID (demo)
            <input name="brokerId" required placeholder="Pega tu brokerId (seed crea uno)"/>
          </label>
          <label>Nombre
            <input name="firstName" required/>
          </label>
          <label>Apellido
            <input name="lastName" required/>
          </label>
          <label>Email
            <input type="email" name="email" required/>
          </label>
          <label>Teléfono
            <input name="phone" />
          </label>
          <button className="btn">Crear</button>
        </form>
      </section>

      <section style={{marginTop:32}}>
        <h3>Mis clientes (demo)</h3>
        {!demoBrokerId && <p style={{opacity:.7}}>Define <code>demoBrokerId</code> en este archivo para ver un listado.</p>}
        <ul>
          {clients.map((c: any) => (
            <li key={c.id}>{c.firstName} {c.lastName} — {c.email}</li>
          ))}
        </ul>
      </section>

      <style jsx>{`.btn{padding:10px 14px;border-radius:8px;background:#111;color:#fff;border:0}`}</style>
    </main>
  );
}
