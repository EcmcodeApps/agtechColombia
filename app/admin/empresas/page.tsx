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
    (c.nombreComercial ?? c.nombre ?? "").toLowerCase().includes(query.toLowerCase()) ||
    (c.nit ?? "").includes(query)
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-on-surface font-headline">🏢 Empresas</h1>
        <span className="text-sm text-on-surface-variant">
          {filtered.length} empresa{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por nombre o NIT…"
        className="w-full sm:max-w-sm rounded-xl border border-outline-variant bg-surface
                   px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"/>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"/>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-on-surface-variant py-16 text-sm">
          No se encontraron empresas.
        </p>
      ) : (
        <>
          {/* ── TABLA: solo md+ ── */}
          <div className="hidden md:block overflow-auto rounded-2xl border border-outline-variant shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  {["Empresa","NIT","Ciudad","Plan","Estado","Acción"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 bg-white">
                {filtered.map(c => (
                  <tr key={c.uid} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface">
                      {c.nombreComercial ?? c.nombre ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">{c.nit ?? "—"}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">{c.ciudad ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-medium text-on-surface-variant
                                       bg-surface-container px-2 py-0.5 rounded-full">
                        {c.plan ?? "gratuito"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        c.activa ? "bg-green-100 text-green-800" : "bg-red-50 text-red-600"
                      }`}>
                        {c.activa ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleActivate(c.uid, !c.activa)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                          c.activa
                            ? "border border-red-300 text-red-600 hover:bg-red-50"
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

          {/* ── TARJETAS: solo móvil ── */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map(c => (
              <div key={c.uid}
                className="bg-white rounded-2xl border border-outline-variant/40 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">
                      {c.nombreComercial ?? c.nombre ?? "—"}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">NIT: {c.nit ?? "—"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${
                    c.activa ? "bg-green-100 text-green-800" : "bg-red-50 text-red-600"
                  }`}>
                    {c.activa ? "Activa" : "Inactiva"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
                  {c.ciudad && <span>📍 {c.ciudad}</span>}
                  <span className="bg-surface-container px-2 py-0.5 rounded-full capitalize">
                    {c.plan ?? "gratuito"}
                  </span>
                </div>

                <button onClick={() => handleActivate(c.uid, !c.activa)}
                  className={`w-full rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                    c.activa
                      ? "border border-red-300 text-red-600 hover:bg-red-50"
                      : "bg-primary text-on-primary hover:opacity-90"
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
