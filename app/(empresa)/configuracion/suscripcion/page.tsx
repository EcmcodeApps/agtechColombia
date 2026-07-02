"use client";

import { useEffect, useRef, useState } from "react";

type Invoice = { id: string; date: string; amount: string; paid: boolean };

const INVOICES: Invoice[] = [
  { id: "INV-2023-09", date: "12 Sept, 2023", amount: "$120.000 COP", paid: true },
  { id: "INV-2023-08", date: "12 Ago, 2023",  amount: "$120.000 COP", paid: true },
  { id: "INV-2023-07", date: "12 Jul, 2023",  amount: "$120.000 COP", paid: true },
];

const FEATURES = ["Soporte Prioritario", "Filtros Avanzados", "WhatsApp Directo"];

const card = "bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant";

// Animated progress bar
function UsageBar({ pct }: { pct: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setWidth(pct); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct]);

  return (
    <div ref={ref} className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
      <div className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%` }} />
    </div>
  );
}

export default function SuscripcionPage() {
  return (
    <div className="px-margin-mobile md:px-gutter py-xl">
      <div className="mb-xl">
        <h2 className="text-headline-lg text-primary mb-xs">Gestión de Suscripción</h2>
        <p className="text-body-md text-on-surface-variant">Administra tu plan, métodos de pago y consulta tus facturas recientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter max-w-5xl">

        {/* ── Plan actual ────────────────────────────────────────────── */}
        <div className={`${card} p-xl lg:col-span-2 flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-start mb-lg flex-wrap gap-md">
              <div>
                <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full text-label-sm font-bold uppercase tracking-wider mb-sm inline-block">
                  Plan Actual
                </span>
                <h3 className="text-headline-md text-primary">PYME Pro</h3>
                <p className="text-body-sm text-on-surface-variant">Facturación mensual: $120.000 COP</p>
              </div>
              <button className="bg-energy-orange text-white px-lg py-sm rounded-xl text-label-md shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-sm">
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                Mejorar Plan
              </button>
            </div>

            <div className="space-y-md mt-xl">
              <div className="flex justify-between items-end">
                <span className="text-label-md text-on-surface">Uso de Vacantes</span>
                <span className="text-label-md text-primary">3 de 5 activas</span>
              </div>
              <UsageBar pct={60} />
              <p className="text-label-sm text-on-surface-variant">Próximo ciclo de facturación: 12 de Octubre, 2023</p>
            </div>
          </div>

          <div className="mt-xl pt-lg border-t border-outline-variant grid grid-cols-1 md:grid-cols-3 gap-sm">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-body-sm text-on-surface-variant">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Métodos de pago ─────────────────────────────────────────── */}
        <div className={`${card} p-xl flex flex-col`}>
          <h3 className="text-label-md text-primary mb-lg flex items-center gap-sm uppercase tracking-wide">
            <span className="material-symbols-outlined">credit_card</span>
            Métodos de Pago
          </h3>

          <div className="space-y-md flex-1">
            {/* Tarjeta registrada */}
            <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-white hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-md">
                <div className="w-10 h-6 bg-slate-100 rounded flex items-center justify-center">
                  <span className="font-bold text-[10px] text-slate-500 italic">VISA</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">•••• 4242</p>
                  <p className="text-label-sm text-on-surface-variant uppercase">Expira 12/26</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>

            <button className="w-full py-md border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant text-label-md flex items-center justify-center gap-sm hover:border-primary hover:text-primary hover:bg-white transition-all active:scale-95">
              <span className="material-symbols-outlined">add_circle</span>
              Añadir Tarjeta o PSE
            </button>
          </div>

          <p className="text-label-sm text-on-surface-variant mt-lg leading-relaxed">
            Pagos protegidos con encriptación 256-bit SSL de grado bancario.
          </p>
        </div>

        {/* ── Facturas recientes ──────────────────────────────────────── */}
        <div className={`${card} p-xl lg:col-span-3`}>
          <div className="flex justify-between items-center mb-xl flex-wrap gap-md">
            <h3 className="text-headline-md text-primary">Facturas Recientes</h3>
            <button className="text-primary text-label-md flex items-center gap-xs hover:underline">
              Ver todo el historial
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-outline-variant">
                  {["Factura", "Fecha", "Monto", "Estado", ""].map((h, i) => (
                    <th key={i} className={`pb-md text-label-sm text-on-surface-variant uppercase tracking-wider ${i >= 2 ? "text-right" : ""} ${i === 3 ? "text-center" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {INVOICES.map(inv => (
                  <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-lg text-label-md text-primary">{inv.id}</td>
                    <td className="py-lg text-body-sm text-on-surface-variant">{inv.date}</td>
                    <td className="py-lg text-label-md text-on-surface text-right">{inv.amount}</td>
                    <td className="py-lg text-center">
                      <span className={`px-sm py-xs rounded-full text-label-sm font-bold ${inv.paid ? "bg-green-100 text-green-700" : "bg-error-container text-error"}`}>
                        {inv.paid ? "Pagado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="py-lg text-right">
                      <button className="text-primary hover:text-energy-orange transition-colors" aria-label="Descargar factura">
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
