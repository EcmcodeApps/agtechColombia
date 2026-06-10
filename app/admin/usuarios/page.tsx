"use client";

import { useEffect, useState } from "react";
import { getAllUsers, type UserProfile } from "@/lib/firebase/firestore";

export default function AdminUsuariosPage() {
  const [users,   setUsers]   = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState("");

  useEffect(() => {
    getAllUsers().then(u => { setUsers(u); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.nombre?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">👥 Usuarios</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{users.length} usuarios registrados</p>
      </div>

      {/* Buscador */}
      <input
        value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por nombre o correo…"
        className="w-full max-w-sm rounded-xl border border-outline-variant bg-white
                   px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant text-sm">No se encontraron usuarios.</div>
      ) : (
        <>
          {/* ── Tabla desktop ── */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-outline-variant shadow-sm">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  {["Nombre", "Correo", "Onboarding", "Registrado"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-white">
                {filtered.map(u => (
                  <tr key={u.uid} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface max-w-[160px] truncate">
                      {u.nombre ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs max-w-[200px] truncate">
                      {u.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.onboardingCompleto
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {u.onboardingCompleto ? "✓ Completo" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {u.createdAt?.toDate?.().toLocaleDateString("es-CO") ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Cards móvil ── */}
          <div className="sm:hidden flex flex-col gap-3">
            {filtered.map(u => (
              <div key={u.uid}
                className="bg-white rounded-2xl border border-outline-variant/40 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">{u.nombre ?? "Sin nombre"}</p>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">{u.email ?? "—"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                    u.onboardingCompleto
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {u.onboardingCompleto ? "Completo" : "Pendiente"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  📅 {u.createdAt?.toDate?.().toLocaleDateString("es-CO") ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
