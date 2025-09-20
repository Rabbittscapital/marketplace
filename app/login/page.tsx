"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const r = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");

  async function onSubmit(e:React.FormEvent){
    e.preventDefault(); setErr("");
    const res = await signIn("credentials",{ email, password, redirect:false });
    if(res?.ok) r.push("/marketplace"); else setErr("Credenciales inválidas");
  }

  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24}}>
      <form onSubmit={onSubmit} style={{maxWidth:380,width:"100%",background:"#fff",padding:24,borderRadius:12,boxShadow:"0 12px 28px rgba(0,0,0,.06)"}}>
        <h1 style={{margin:"6px 0 18px"}}>Acceso Brokers</h1>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={{width:"100%",margin:"6px 0 12px"}}/>
        <label>Clave</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required style={{width:"100%",margin:"6px 0 16px"}}/>
        {err && <div style={{color:"#b00020",marginBottom:8}}>{err}</div>}
        <button type="submit" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #111"}}>Ingresar</button>
      </form>
    </div>
  );
}
