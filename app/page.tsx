export default function Home() {
  return (
    <main style={{maxWidth:880,margin:"60px auto",padding:"0 16px"}}>
      <h1>Bienvenido a Rabbitts Marketplace 🚀</h1>
      <p>Tu plataforma está funcionando correctamente en Vercel.</p>

      <div style={{marginTop:24,display:"flex",gap:12,flexWrap:"wrap"}}>
        <a className="btn" href="/login">Iniciar sesión</a>
        <a className="btn" href="/proyectos">Ver proyectos</a>
        <a className="btn secondary" href="/dashboard">Panel (requiere login)</a>
      </div>

      <style jsx>{`
        .btn{padding:10px 14px;border-radius:8px;background:#111;color:#fff;text-decoration:none}
        .btn.secondary{background:#eee;color:#111}
      `}</style>
    </main>
  );
}
