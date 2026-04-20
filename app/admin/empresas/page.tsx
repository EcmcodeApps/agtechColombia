"use client";

import { useEffect, useState } from "react";
import { getAllCompanies, activateCompany, type CompanyRecord } from "@/lib/firebase/firestore";

export default function AdminEmpresasPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");

  useEffect(() => {
    getAllCompanies().then(c => { setCompanies(c); setLoading(false); });
  }, []);

  async function handleActivate(uid: string, active: boolean) {
    await activateCompany(uid, active);
    setCompanies(prev => prev.map(c => c.uid === uid ? { ...c, activa: active } : c));
  }

  const filtered = companies.filter(c =>
    c.nombre?.toLowerCase().includes(query.toLowerCase()) ||
    c.nit?.includes(query)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Empresas</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre o NIT…"
        className="w-full max-w-sm rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>{["Empresa", "NIT", "Ciudad", "Plan", "Estado", "Acción"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-low">
              {filtered.map(c => (
                <tr key={c.uid}>
                  <td className="px-4 py-3 font-medium text-on-surface">{c.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.nit ?? "—"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.ciudad ?? "—"}</td>
                  <td className="px-4 py-3 capitalize text-on-surface-variant">{c.plan ?? "gratuito"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.activa ? "bg-green-100 text-green-800" : "bg-surface-container text-on-surface-variant"}`}>
                      {c.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleActivate(c.uid, !c.activa)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        c.activa ? "border border-error text-error hover:bg-error-container" : "bg-primary text-on-primary hover:opacity-90"
                      }`}>
                      {c.activa ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
