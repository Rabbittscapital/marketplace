"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const [name,setName]=useState(""); const [coverUrl,setCover]=useState("");
  const [address,setAddress]=useState(""); const [city,setCity]=useState("");
  const [country,setCountry]=useState(""); const [deliveryDate,setDate]=useState("");
  const router = useRouter();

  async function save(e:React.FormEvent){
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, coverUrl, address, city, country, deliveryDate }),
    });
    if(res.ok){ alert("Proyecto creado"); router.push("/admin"); } else alert("Error");
  }

  return (
    <div className="card" style={{ maxWidth:600 }}>
      <h2>Nuevo proyecto</h2>
      <form onSubmit={save} style={{ display:"grid", gap:10 }}>
        <input className="input" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Cover URL" value={coverUrl} onChange={e=>setCover(e.target.value)} />
        <input className="input" placeholder="Dirección" value={address} onChange={e=>setAddress(e.target.value)} />
        <input className="input" placeholder="Ciudad" value={city} onChange={e=>setCity(e.target.value)} />
        <input className="input" placeholder="País" value={country} onChange={e=>setCountry(e.target.value)} />
        <label className="label">Fecha entrega</label>
        <input className="input" type="date" value={deliveryDate} onChange={e=>setDate(e.target.value)} />
        <button className="btn">Guardar</button>
      </form>
    </div>
  );
}
