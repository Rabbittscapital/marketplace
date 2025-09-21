import Link from "next/link";

type Unit = {
  id: string; code: string; price: number; currency: string; status: string;
};
type Project = {
  id: string; name: string; address: string; city: string; country: string; units: Unit[];
};

async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/projects`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProyectosPage() {
  const projects = await getProjects();
  return (
    <main style={{maxWidth:1000,margin:"40px auto",padding:"0 16px"}}>
      <h2>Proyectos</h2>
      {projects.length === 0 && <p>Sin proyectos.</p>}
      {projects.map(p => (
        <section key={p.id} style={{padding:"16px 0",borderBottom:"1px solid #eee"}}>
          <h3>{p.name}</h3>
          <p>{p.address} — {p.city}, {p.country}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:10}}>
            {p.units.map(u => (
              <div key={u.id} style={{border:"1px solid #ddd",borderRadius:8,padding:12}}>
                <div><b>{u.code}</b> | {u.currency} {u.price.toLocaleString()}</div>
                <div style={{fontSize:12,opacity:.7}}>Estado: {u.status}</div>
                <Link href={`/unidad/${u.id}`} className="btn" style={{display:"inline-block",marginTop:8}}>Ver / Cotizar</Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
