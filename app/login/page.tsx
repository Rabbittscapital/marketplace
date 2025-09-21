"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if ((res as any)?.error) {
      setErr((res as any).error);
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 380, margin: "40px auto", fontFamily: "ui-sans-serif" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Ingresar</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "#111827",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>
    </main>
  );
}
