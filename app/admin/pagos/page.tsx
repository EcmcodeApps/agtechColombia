"use client";

import { useEffect, useState } from "react";
import { getAllPagos, updatePagoEstado, type PagoRecord } from "@/lib/firebase/firestore";

const ESTADO_COLOR: Record<string, string> = {
  pendiente:  "bg-yellow-100 text-yellow-800",
  aprobado:   "bg-green-100  text-green-800",
  rechazado:  "bg-red-100    text-red-800",
};

export default function AdminPagosPage() {
  const [pagos,   setPagos]   = useState<PagoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("todos");

  useEffect(() => {
    getAllPagos().then(p => { setPagos(p); setLoading(false); });
  }, []);

  async function handleEstado(id: string, estado: string) {
    await updatePagoEstado(id, estado as "aprobado" | "rechazado" | "pendiente");
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  }

  const filtered = filter === "todos" ? pagos : pagos.filter(p => p.estado === filter);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">💳 Pagos</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">{pagos.length} pagos en total</p>
      </div>

      {/* Filtros — scroll horizontal en móvil */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {["todos", "pendiente", "aprobado", "rechazado"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
              filter === f
                ? "bg-primary text-on-primary shadow-sm"
                : "border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant text-sm">No hay pagos en esta categoría.</div>
      ) : (
        <>
          {/* ── Tabla desktop ── */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-outline-variant shadow-sm">
            <table className="w-full text-sm min-w-[620px]">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  {["UID", "Plan", "Monto", "Estado", "Comprobante", "Acciones"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-white">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-on-surface-variant font-mono max-w-[120px] truncate">
                      {p.uid}
                    </td>
                    <td className="px-4 py-3 text-on-surface capitalize">{p.plan}</td>
                    <td className="px-4 py-3 font-semibold text-on-surface">
                      ${p.monto?.toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ESTADO_COLOR[p.estado] ?? ""}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.comprobanteUrl
                        ? <a href={p.comprobanteUrl} target="_blank" rel="noreferrer"
                             className="text-xs text-primary hover:underline font-medium">Ver 📎</a>
                        : <span className="text-xs text-on-surface-variant">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {p.estado === "pendiente" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleEstado(p.id!, "aprobado")}
                            className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:opacity-90">
                            ✓ Aprobar
                          </button>
                          <button onClick={() => handleEstado(p.id!, "rechazado")}
                            className="rounded-xl border border-error px-3 py-1.5 text-xs font-semibold text-error hover:bg-error-container">
                            ✗ Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Cards móvil ── */}
          <div className="sm:hidden flex flex-col gap-3">
            {filtered.map(p => (
              <div key={p.id}
                className="bg-white rounded-2xl border border-outline-variant/40 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-on-surface capitalize">{p.plan}</p>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5 truncate max-w-[180px]">
                      {p.uid}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0 ${ESTADO_COLOR[p.estado] ?? ""}`}>
                    {p.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-on-surface">
                    ${p.monto?.toLocaleString("es-CO")}
                  </span>
                  {p.comprobanteUrl && (
                    <a href={p.comprobanteUrl} target="_blank" rel="noreferrer"
                       className="text-xs text-primary hover:underline font-medium">
                      Ver comprobante 📎
                    </a>
                  )}
                </div>

                {p.estado === "pendiente" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => handleEstado(p.id!, "aprobado")}
                      className="rounded-xl bg-primary py-2 text-xs font-semibold text-on-primary">
                      ✓ Aprobar
                    </button>
                    <button onClick={() => handleEstado(p.id!, "rechazado")}
                      className="rounded-xl border border-error py-2 text-xs font-semibold text-error">
                      ✗ Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
