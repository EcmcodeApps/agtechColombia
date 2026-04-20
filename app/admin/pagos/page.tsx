"use client";

import { useEffect, useState } from "react";
import { getAllPagos, updatePagoEstado, type PagoRecord } from "@/lib/firebase/firestore";

const ESTADO_COLOR: Record<string, string> = {
  pendiente:  "bg-yellow-100 text-yellow-800",
  aprobado:   "bg-green-100  text-green-800",
  rechazado:  "bg-red-100    text-red-800",
};

export default function AdminPagosPage() {
  const [pagos, setPagos]     = useState<PagoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("todos");

  useEffect(() => {
    getAllPagos().then(p => { setPagos(p); setLoading(false); });
  }, []);

  async function handleEstado(id: string, estado: string) {
    await updatePagoEstado(id, estado as "aprobado" | "rechazado" | "pendiente");
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  }

  const filtered = filter === "todos" ? pagos : pagos.filter(p => p.estado === filter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Pagos</h1>

      <div className="flex gap-2">
        {["todos", "pendiente", "aprobado", "rechazado"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-auto rounded-2xl border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>{["UID", "Plan", "Monto", "Estado", "Comprobante", "Acciones"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-low">
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-xs text-on-surface-variant font-mono max-w-[120px] truncate">{p.uid}</td>
                  <td className="px-4 py-3 text-on-surface">{p.plan}</td>
                  <td className="px-4 py-3 font-semibold text-on-surface">${p.monto?.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_COLOR[p.estado] ?? ""}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.comprobanteUrl
                      ? <a href={p.comprobanteUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Ver</a>
                      : <span className="text-xs text-on-surface-variant">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {p.estado === "pendiente" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEstado(p.id!, "aprobado")}
                          className="rounded-xl bg-primary px-3 py-1 text-xs font-medium text-on-primary hover:opacity-90">
                          Aprobar
                        </button>
                        <button onClick={() => handleEstado(p.id!, "rechazado")}
                          className="rounded-xl border border-error px-3 py-1 text-xs font-medium text-error hover:bg-error-container">
                          Rechazar
                        </button>
                      </div>
                    )}
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
