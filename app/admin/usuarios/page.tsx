"use client";

import { useEffect, useState } from "react";
import { getAllUsers, type UserProfile } from "@/lib/firebase/firestore";

export default function AdminUsuariosPage() {
  const [users, setUsers]     = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState("");

  useEffect(() => {
    getAllUsers().then(u => { setUsers(u); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.nombre?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Usuarios</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre o correo…"
        className="w-full max-w-sm rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>{["Nombre", "Correo", "Onboarding", "Creado"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-low">
              {filtered.map(u => (
                <tr key={u.uid}>
                  <td className="px-4 py-3 font-medium text-on-surface">{u.nombre}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.onboardingCompleto ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {u.onboardingCompleto ? "Completo" : "Pendiente"}
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
      )}
    </div>
  );
}
