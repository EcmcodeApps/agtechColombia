"use client";

import { useEffect, useState } from "react";
import { getAllCompanies, activateCompany, type CompanyRecord } from "@/lib/firebase/firestore";

export default function AdminEmpresasPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState("");

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
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">🏢 Empresas</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">{companies.length} empresas registradas</p>
        </div>
      </div>

      {/* Buscador */}
      <input
        value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por nombre o NIT…"
        className="w-full max-w-sm rounded-xl border border-outline-variant bg-white
                   px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant text-sm">No se encontraron empresas.</div>
      ) : (
        <>
          {/* ── Tabla desktop ── */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-outline-variant shadow-sm">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  {["Empresa", "NIT", "Ciudad", "Plan", "Estado", "Acción"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-white">
                {filtered.map(c => (
                  <tr key={c.uid} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface max-w-[180px] truncate">
                      {c.nombre ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant font-mono text-xs">{c.nit ?? "—"}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.ciudad ?? "—"}</td>
                    <td className="px-4 py-3 capitalize text-on-surface-variant">{c.plan ?? "gratuito"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.activa ? "bg-green-100 text-green-800" : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {c.activa ? "✓ Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleActivate(c.uid, !c.activa)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                          c.activa
                            ? "border border-error text-error hover:bg-error-container"
                            : "bg-primary text-on-primary hover:opacity-90"
                        }`}>
                        {c.activa ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Cards móvil ── */}
          <div className="sm:hidden flex flex-col gap-3">
            {filtered.map(c => (
              <div key={c.uid}
                className="bg-white rounded-2xl border border-outline-variant/40 p-4 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">{c.nombre ?? "—"}</p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">{c.nit ?? "Sin NIT"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                    c.activa ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}>
                    {c.activa ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  {c.ciudad && <span>📍 {c.ciudad}</span>}
                  <span className="capitalize">📦 {c.plan ?? "gratuito"}</span>
                </div>
                <button onClick={() => handleActivate(c.uid, !c.activa)}
                  className={`w-full rounded-xl py-2 text-xs font-semibold transition-colors ${
                    c.activa
                      ? "border border-error text-error hover:bg-error-container"
                      : "bg-primary text-on-primary"
                  }`}>
                  {c.activa ? "Desactivar empresa" : "Activar empresa"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
