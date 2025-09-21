import Link from "next/link";

export default function AdminHome() {
  return (
    <div>
      <h1>Administrador</h1>
      <div className="card">
        <ul>
          <li><Link href="/admin/proyectos/nuevo">+ Crear proyecto</Link></li>
          <li><Link href="/admin/unidades/carga">Cargar stock masivo</Link></li>
        </ul>
      </div>
    </div>
  );
}
