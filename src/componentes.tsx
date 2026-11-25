import type { ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export const inputCls = "w-full border rounded px-3 py-2";
export const btnCls = "bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50";

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </label>
  );
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <button className="border px-3 py-1 rounded disabled:opacity-40" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>Página {page} de {Math.max(totalPages, 1)}</span>
      <button className="border px-3 py-1 rounded disabled:opacity-40" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente
      </button>
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white rounded shadow p-4 mb-3">{children}</div>;
}

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <div className="flex gap-4">
          <Link to="/dashboard" className="font-bold">Actividades</Link>
          <Link to="/my-enrollments" className="text-blue-600">Mis inscripciones</Link>
        </div>
        <button className="text-red-600" onClick={logout}>Cerrar sesión</button>
      </nav>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </div>
  );
}

export function Protected({ children }: { children: ReactNode }) {
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}
