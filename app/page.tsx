// app/page.tsx
export default function Home() {
  return (
    <main
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "70vh",
        textAlign: "center",
        padding: "3rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Bienvenido a Rabbitts Marketplace 🚀
        </h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Tu plataforma está funcionando correctamente en Vercel.
        </p>

        <nav style={{ display: "inline-flex", gap: "1rem" }}>
          <a href="/login" style={{ textDecoration: "underline" }}>
            Ingresar
          </a>
          <a href="/proyectos" style={{ textDecoration: "underline" }}>
            Ver proyectos
          </a>
        </nav>
      </div>
    </main>
  );
}
