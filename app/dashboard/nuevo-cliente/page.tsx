"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientPage() {
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone }),
    });
    if (res.ok) router.push("/dashboard");
    else alert("Error creando cliente");
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Nuevo cliente</h2>
      <form onSubmit={save} style={{ display:"grid", gap:10 }}>
        <label className="label">Nombre</label>
        <input className="input" value={firstName} onChange={e=>setFirst(e.target.value)} />
        <label className="label">Apellido</label>
        <input className="input" value={lastName} onChange={e=>setLast(e.target.value)} />
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="label">Teléfono</label>
        <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} />
        <button className="btn">Guardar</button>
      </form>
    </div>
  );
}
