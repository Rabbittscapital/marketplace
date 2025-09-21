"use client";
import { useState } from "react";

export default function BulkUnits() {
  const [projectId, setProjectId] = useState("");
  const [text, setText] = useState(`code,typology,m2,bedrooms,bathrooms,price,currency,status
A-101,1D1B,42,1,1,180000,USD,AVAILABLE
A-102,2D2B,65,2,2,260000,USD,AVAILABLE`);

  async function upload() {
    const res = await fetch("/api/units/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, csv: text }),
    });
    if (res.ok) alert("Unidades cargadas"); else alert("Error");
  }

  return (
    <div className="card">
      <h2>Cargar stock masivo</h2>
      <input className="input" placeholder="Project ID" value={projectId} onChange={e=>setProjectId(e.target.value)} />
      <p style={{fontSize:12,color:"#666"}}>Pega CSV con columnas: code,typology,m2,bedrooms,bathrooms,price,currency,status</p>
      <textarea className="input" style={{ height:220 }} value={text} onChange={e=>setText(e.target.value)} />
      <button className="btn" onClick={upload}>Subir</button>
    </div>
  );
}
