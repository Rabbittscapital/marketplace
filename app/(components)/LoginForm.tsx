"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
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
      redirect: false,
    });

    if (res?.error) {
      setErr("Credenciales inválidas");
      setLoading(false);
    } else if (res?.ok) {
      window.location.href = "/dashboard";
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      padding: "2rem",
      borderRadius: "16px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      backdropFilter: "blur(10px)",
      maxWidth: "400px",
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        color: "#1f2937",
        textAlign: "center",
      }}>
        Iniciar Sesión
      </h2>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.5rem",
          }}>
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <div>
          <label style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "0.5rem",
          }}>
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginTop: "0.5rem",
          }}
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>

        {err && (
          <p style={{
            color: "#dc2626",
            fontSize: "0.875rem",
            textAlign: "center",
            margin: "0.5rem 0 0 0",
          }}>
            {err}
          </p>
        )}
      </form>

      <div style={{
        margin: "1.5rem 0",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "center",
        }}>
          <div style={{
            width: "100%",
            height: "1px",
            background: "#d1d5db",
          }} />
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}>
          <span style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "0 1rem",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}>
            O continúa con
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "white",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.borderColor = "#9ca3af";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#d1d5db";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>
    </div>
  );
}