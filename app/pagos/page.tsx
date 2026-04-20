"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserPagos, type PagoRecord } from "@/lib/firebase/firestore";

const ESTADO_COLOR: Record<string, string> = {
  pendiente:  "bg-yellow-100 text-yellow-800",
  aprobado:   "bg-green-100  text-green-800",
  rechazado:  "bg-red-100    text-red-800",
};

export default function PagosPage() {
  const { user }  = useAuth();
  const [pagos, setPagos]   = useState<PagoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserPagos(user.uid).then(p => { setPagos(p); setLoading(false); });
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface font-headline">Mis pagos</h1>
        <a href="/pagos/nuevo"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity">
          + Registrar pago
        </a>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : pagos.length === 0 ? (
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-10 text-center">
          <p className="text-4xl mb-3">💳</p>
          <p className="font-semibold text-on-surface">Sin registros de pago</p>
          <p className="text-sm text-on-surface-variant mt-1">Registra tu primer comprobante de pago</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pagos.map(p => (
            <div key={p.id} className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface text-sm truncate">{p.plan}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {p.createdAt?.toDate?.().toLocaleDateString("es-CO") ?? "—"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-on-surface">${p.monto?.toLocaleString("es-CO")}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_COLOR[p.estado] ?? "bg-surface-container text-on-surface-variant"}`}>
                  {p.estado}
                </span>
              </div>
              {p.comprobanteUrl && (
                <a href={p.comprobanteUrl} target="_blank" rel="noreferrer"
                  className="shrink-0 text-xs text-primary hover:underline">Ver</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
