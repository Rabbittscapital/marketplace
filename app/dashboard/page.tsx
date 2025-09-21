// app/dashboard/page.tsx

export default function Dashboard() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "2rem 1.25rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Panel de control</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          Gestiona proyectos, unidades, clientes y cotizaciones.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        <a
          href="/proyectos"
          style={{
            display: "block",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "1rem",
            textDecoration: "none",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Proyectos</h3>
          <p style={{ margin: 0, color: "#555" }}>
            Ver listado de proyectos y stock.
          </p>
        </a>

        <a
          href="/clientes"
          style={{
            display: "block",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "1rem",
            textDecoration: "none",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Clientes</h3>
          <p style={{ margin: 0, color: "#555" }}>
            Crear y administrar tus clientes.
          </p>
        </a>

        <a
          href="/cotizaciones"
          style={{
            display: "block",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "1rem",
            textDecoration: "none",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Cotizaciones</h3>
          <p style={{ margin: 0, color: "#555" }}>
            Revisa e imprime cotizaciones.
          </p>
        </a>

        <a
          href="/reservas"
          style={{
            display: "block",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "1rem",
            textDecoration: "none",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Reservas</h3>
          <p style={{ margin: 0, color: "#555" }}>
            Sube comprobantes y gestiona estados.
          </p>
        </a>
      </section>
    </main>
  );
}
