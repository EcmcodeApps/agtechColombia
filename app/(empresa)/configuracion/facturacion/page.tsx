"use client";

import Link from "next/link";
import { useState } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type InvoiceStatus = "pagada" | "pendiente" | "vencida";

interface Invoice {
  id: string;
  number: string;
  date: string;
  period: string;
  plan: string;
  amount: number;
  status: InvoiceStatus;
}

// ── Datos demo ─────────────────────────────────────────────────────────────────
const INVOICES: Invoice[] = [
  { id: "1", number: "TY-2026-0006", date: "2026-06-01", period: "Jun 2026",  plan: "PYME Pro",  amount: 129000, status: "pendiente" },
  { id: "2", number: "TY-2026-0005", date: "2026-05-01", period: "May 2026",  plan: "PYME Pro",  amount: 129000, status: "pagada"    },
  { id: "3", number: "TY-2026-0004", date: "2026-04-01", period: "Abr 2026",  plan: "PYME Pro",  amount: 129000, status: "pagada"    },
  { id: "4", number: "TY-2026-0003", date: "2026-03-01", period: "Mar 2026",  plan: "PYME Pro",  amount: 129000, status: "pagada"    },
  { id: "5", number: "TY-2026-0002", date: "2026-02-01", period: "Feb 2026",  plan: "Gratis",    amount: 0,      status: "pagada"    },
  { id: "6", number: "TY-2026-0001", date: "2026-01-01", period: "Ene 2026",  plan: "Gratis",    amount: 0,      status: "pagada"    },
];

const PAYMENT_METHOD = {
  type: "Visa",
  last4: "4242",
  expiry: "08/28",
  holder: "Inversiones Antioquia S.A.S",
};

const STATUS_CFG: Record<InvoiceStatus, { label: string; color: string; icon: string }> = {
  pagada:   { label: "Pagada",   color: "bg-brand-green/10 text-brand-green", icon: "check_circle" },
  pendiente:{ label: "Pendiente",color: "bg-[#FF9800]/10 text-[#FF9800]",     icon: "schedule"     },
  vencida:  { label: "Vencida",  color: "bg-error/10 text-error",             icon: "error"        },
};

const fmt = (n: number) =>
  n === 0 ? "Gratis" : "$" + n.toLocaleString("es-CO");

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const card = "bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

// ═══════════════════════════════════════════════════════════════════════════════
export default function FacturacionPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showNitForm,  setShowNitForm]  = useState(false);
  const [downloading,  setDownloading]  = useState<string | null>(null);

  // Datos formulario tarjeta (demo)
  const [cardNum,  setCardNum]  = useState("");
  const [cardExp,  setCardExp]  = useState("");
  const [cardCvc,  setCardCvc]  = useState("");
  const [cardName, setCardName] = useState("");

  // Datos facturación (NIT)
  const [razon,    setRazon]    = useState("Inversiones Antioquia S.A.S");
  const [nit,      setNit]      = useState("900.123.456-7");
  const [dir,      setDir]      = useState("Cra. 43A # 1-50, El Poblado");
  const [ciudad,   setCiudad]   = useState("Medellín");
  const [emailFac, setEmailFac] = useState("contabilidad@inversiones.co");
  const [nitSaved, setNitSaved] = useState(false);

  const handleDownload = (id: string) => {
    setDownloading(id);
    // TODO: generar PDF desde Firestore / Cloud Function
    setTimeout(() => setDownloading(null), 1500);
  };

  const handleNitSave = () => {
    setNitSaved(true);
    setShowNitForm(false);
    setTimeout(() => setNitSaved(false), 3000);
  };

  const totalPagado = INVOICES.filter(i => i.status === "pagada").reduce((a, i) => a + i.amount, 0);
  const pendiente   = INVOICES.find(i => i.status === "pendiente");

  const inputCls =
    "w-full bg-surface-container-low border border-outline-variant rounded-xl h-12 px-md " +
    "text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent " +
    "transition-all placeholder:text-outline";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="px-margin-mobile md:px-gutter py-xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs text-on-surface-variant mb-xl">
        <Link href="/configuracion" className="text-label-sm hover:text-primary transition-colors">Configuración</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-label-sm font-semibold text-primary">Facturación</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-5xl">

        {/* ── Columna principal ─────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-gutter">

          {/* ── Alerta factura pendiente ─────────────────────────────────── */}
          {pendiente && (
            <div className="flex items-start gap-md p-lg bg-[#FF9800]/10 border border-[#FF9800]/30 rounded-2xl">
              <span className="material-symbols-outlined text-[#FF9800] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div className="flex-1 min-w-0">
                <p className="text-label-md text-[#FF9800] font-bold">Tienes una factura pendiente</p>
                <p className="text-body-sm text-on-surface-variant mt-xs">
                  Factura {pendiente.number} por {fmt(pendiente.amount)} — {pendiente.period}. Será cobrada automáticamente el <strong>15 de jun 2026</strong>.
                </p>
              </div>
              <button className="flex-shrink-0 px-md py-xs bg-[#FF9800] text-white rounded-xl text-label-sm font-bold hover:brightness-110 active:scale-95 transition-all">
                Pagar ahora
              </button>
            </div>
          )}

          {/* ── Plan actual ──────────────────────────────────────────────── */}
          <div className={`${card} p-xl`}>
            <div className="flex items-start justify-between gap-md mb-xl">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface">Plan actual</h2>
                  <p className="text-body-sm text-on-surface-variant">Próxima renovación: 1 jul 2026</p>
                </div>
              </div>
              <Link href="/configuracion/suscripcion"
                className="px-md py-xs border border-primary text-primary rounded-xl text-label-sm hover:bg-primary/5 transition-colors flex-shrink-0">
                Cambiar plan
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-lg">
              {/* Plan badge */}
              <div className="flex-1 bg-primary rounded-2xl p-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-label-sm opacity-80 mb-xs">Plan activo</p>
                  <p className="text-display-sm font-black tracking-tight">PYME Pro</p>
                  <p className="text-headline-md font-bold mt-xs">$129.000<span className="text-label-md font-normal opacity-80">/mes</span></p>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">workspace_premium</span>
                </div>
              </div>

              {/* Beneficios del plan */}
              <div className="flex-1 space-y-sm">
                {[
                  { icon: "work",       label: "Hasta 10 vacantes activas"     },
                  { icon: "psychology", label: "Matches de IA ilimitados"       },
                  { icon: "group",      label: "500 candidatos/mes"             },
                  { icon: "chat",       label: "Mensajería directa"             },
                  { icon: "bar_chart",  label: "Reportes y analytics"           },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-brand-green text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-body-sm text-on-surface">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Historial de facturas ────────────────────────────────────── */}
          <div className={`${card} overflow-hidden`}>
            <div className="px-xl pt-xl pb-lg border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <h2 className="text-headline-md text-on-surface">Historial de facturas</h2>
                <p className="text-body-sm text-on-surface-variant">{INVOICES.length} facturas · Total pagado: {fmt(totalPagado)}</p>
              </div>
            </div>

            {/* Cabecera tabla — solo desktop */}
            <div className="hidden sm:grid grid-cols-[1fr_120px_120px_80px_40px] gap-md px-xl py-sm bg-surface-container-low border-b border-outline-variant/20 text-label-sm text-on-surface-variant">
              <span>Factura</span>
              <span>Período</span>
              <span>Monto</span>
              <span>Estado</span>
              <span />
            </div>

            <div>
              {INVOICES.map((inv) => {
                const st = STATUS_CFG[inv.status];
                const isOpen = expandedId === inv.id;
                return (
                  <div key={inv.id} className="border-b border-outline-variant/20 last:border-0">
                    {/* Fila */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : inv.id)}
                      className="w-full text-left px-xl py-lg hover:bg-surface-container-low/50 transition-colors"
                    >
                      {/* Mobile */}
                      <div className="flex items-center justify-between gap-md sm:hidden">
                        <div>
                          <p className="text-label-md text-on-surface">{inv.number}</p>
                          <p className="text-body-sm text-on-surface-variant">{inv.period} · {fmt(inv.amount)}</p>
                        </div>
                        <div className="flex items-center gap-sm">
                          <span className={`px-sm py-xs rounded-full text-label-sm font-semibold ${st.color}`}>{st.label}</span>
                          <span className={`material-symbols-outlined text-[20px] text-outline-variant transition-transform ${isOpen ? "rotate-180" : ""}`}>expand_more</span>
                        </div>
                      </div>

                      {/* Desktop */}
                      <div className="hidden sm:grid grid-cols-[1fr_120px_120px_80px_40px] gap-md items-center">
                        <div>
                          <p className="text-label-md text-on-surface">{inv.number}</p>
                          <p className="text-body-sm text-on-surface-variant">{inv.plan} · {fmtDate(inv.date)}</p>
                        </div>
                        <p className="text-body-sm text-on-surface-variant">{inv.period}</p>
                        <p className="text-label-md text-on-surface font-semibold">{fmt(inv.amount)}</p>
                        <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full text-label-sm font-semibold w-fit ${st.color}`}>
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{st.icon}</span>
                          {st.label}
                        </span>
                        <span className={`material-symbols-outlined text-[20px] text-outline-variant transition-transform ${isOpen ? "rotate-180" : ""}`}>expand_more</span>
                      </div>
                    </button>

                    {/* Detalle expandido */}
                    {isOpen && (
                      <div className="px-xl pb-lg bg-surface-container-low/40 border-t border-outline-variant/20">
                        <div className="py-md grid grid-cols-1 sm:grid-cols-3 gap-md">
                          <div>
                            <p className="text-label-sm text-on-surface-variant mb-xs">Número</p>
                            <p className="text-label-md text-on-surface font-mono">{inv.number}</p>
                          </div>
                          <div>
                            <p className="text-label-sm text-on-surface-variant mb-xs">Fecha de emisión</p>
                            <p className="text-label-md text-on-surface">{fmtDate(inv.date)}</p>
                          </div>
                          <div>
                            <p className="text-label-sm text-on-surface-variant mb-xs">Plan facturado</p>
                            <p className="text-label-md text-on-surface">{inv.plan}</p>
                          </div>
                          <div>
                            <p className="text-label-sm text-on-surface-variant mb-xs">NIT receptor</p>
                            <p className="text-label-md text-on-surface">{nit}</p>
                          </div>
                          <div>
                            <p className="text-label-sm text-on-surface-variant mb-xs">Razón social</p>
                            <p className="text-label-md text-on-surface">{razon}</p>
                          </div>
                          <div>
                            <p className="text-label-sm text-on-surface-variant mb-xs">Subtotal + IVA</p>
                            <p className="text-label-md text-on-surface">{fmt(inv.amount)}</p>
                          </div>
                        </div>
                        <div className="flex gap-sm pt-md border-t border-outline-variant/20">
                          <button
                            onClick={() => handleDownload(inv.id)}
                            disabled={inv.amount === 0}
                            className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-xl text-label-sm font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {downloading === inv.id ? (
                              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                            ) : (
                              <span className="material-symbols-outlined text-[18px]">download</span>
                            )}
                            {inv.amount === 0 ? "Sin documento" : "Descargar PDF"}
                          </button>
                          {inv.status === "pendiente" && (
                            <button className="flex items-center gap-xs px-md py-sm bg-[#FF9800] text-white rounded-xl text-label-sm font-bold hover:brightness-110 active:scale-95 transition-all">
                              <span className="material-symbols-outlined text-[18px]">payment</span>
                              Pagar ahora
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-gutter">

          {/* Método de pago */}
          <div className={`${card} p-xl`}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-label-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                Método de pago
              </h3>
              <button
                onClick={() => setShowCardForm(p => !p)}
                className="text-primary text-label-sm hover:underline"
              >
                {showCardForm ? "Cancelar" : "Cambiar"}
              </button>
            </div>

            {!showCardForm ? (
              <div className="relative bg-gradient-to-br from-primary to-primary/70 rounded-2xl p-lg text-white overflow-hidden" style={{ minHeight: 130 }}>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-lg">
                    <span className="text-label-sm opacity-70">Tarjeta principal</span>
                    <span className="text-label-md font-bold">{PAYMENT_METHOD.type}</span>
                  </div>
                  <p className="text-headline-md font-mono tracking-widest mb-md">•••• •••• •••• {PAYMENT_METHOD.last4}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-label-sm opacity-70">Titular</p>
                      <p className="text-label-sm truncate" style={{ maxWidth: 180 }}>{PAYMENT_METHOD.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-label-sm opacity-70">Vence</p>
                      <p className="text-label-sm">{PAYMENT_METHOD.expiry}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[100px]">credit_card</span>
                </div>
              </div>
            ) : (
              <div className="space-y-md">
                <div className="space-y-xs">
                  <label className="text-label-sm text-on-surface">Número de tarjeta</label>
                  <input className={inputCls} placeholder="1234 5678 9012 3456" maxLength={19}
                    value={cardNum}
                    onChange={e => setCardNum(e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim())} />
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <div className="space-y-xs">
                    <label className="text-label-sm text-on-surface">Vencimiento</label>
                    <input className={inputCls} placeholder="MM/AA" maxLength={5}
                      value={cardExp}
                      onChange={e => setCardExp(e.target.value)} />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-sm text-on-surface">CVC</label>
                    <input className={inputCls} placeholder="123" maxLength={4}
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value.replace(/\D/g,""))} />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm text-on-surface">Nombre en la tarjeta</label>
                  <input className={inputCls} placeholder="Como aparece en la tarjeta"
                    value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <p className="text-label-sm">Pago seguro con cifrado SSL/TLS. No almacenamos datos de tu tarjeta.</p>
                </div>
                <button
                  disabled={!cardNum || !cardExp || !cardCvc || !cardName}
                  className="w-full py-md bg-energy-orange text-white rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar tarjeta
                </button>
              </div>
            )}
          </div>

          {/* Datos de facturación */}
          <div className={`${card} p-xl`}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-label-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                Datos de facturación
              </h3>
              <button
                onClick={() => setShowNitForm(p => !p)}
                className="text-primary text-label-sm hover:underline"
              >
                {showNitForm ? "Cancelar" : "Editar"}
              </button>
            </div>

            {nitSaved && (
              <div className="flex items-center gap-sm p-md bg-brand-green/10 rounded-xl text-brand-green mb-md">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-label-sm font-semibold">Datos guardados correctamente.</span>
              </div>
            )}

            {!showNitForm ? (
              <div className="space-y-sm">
                {[
                  { label: "Razón social",  value: razon    },
                  { label: "NIT",           value: nit      },
                  { label: "Dirección",     value: dir      },
                  { label: "Ciudad",        value: ciudad   },
                  { label: "Email facturas",value: emailFac },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-label-sm text-on-surface-variant">{label}</span>
                    <span className="text-body-sm text-on-surface font-medium">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-md">
                {[
                  { label: "Razón social",  val: razon,    set: setRazon,   ph: "TalentoYa S.A.S"              },
                  { label: "NIT",           val: nit,      set: setNit,     ph: "900.123.456-7"                 },
                  { label: "Dirección",     val: dir,      set: setDir,     ph: "Cra. 43A # 1-50, El Poblado"  },
                  { label: "Ciudad",        val: ciudad,   set: setCiudad,  ph: "Bogotá"                        },
                  { label: "Email facturas",val: emailFac, set: setEmailFac,ph: "contabilidad@empresa.co"       },
                ].map(({ label, val, set, ph }) => (
                  <div key={label} className="space-y-xs">
                    <label className="text-label-sm text-on-surface">{label}</label>
                    <input className={inputCls} placeholder={ph} value={val}
                      onChange={e => set(e.target.value)} />
                  </div>
                ))}
                <button
                  onClick={handleNitSave}
                  className="w-full py-md bg-primary text-white rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  Guardar datos
                </button>
              </div>
            )}
          </div>

          {/* Resumen anual */}
          <div className={`${card} p-xl bg-surface-container-low`}>
            <h3 className="text-label-md text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
              Resumen 2026
            </h3>
            <div className="space-y-md">
              {[
                { label: "Total facturado",  value: fmt(INVOICES.reduce((a,i)=>a+i.amount,0))  },
                { label: "Facturas pagadas", value: `${INVOICES.filter(i=>i.status==="pagada").length} de ${INVOICES.length}` },
                { label: "Plan promedio",    value: "PYME Pro"                                  },
                { label: "Próximo cobro",    value: "1 jul 2026"                                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">{label}</span>
                  <span className="text-label-md text-on-surface font-semibold">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-lg pt-md border-t border-outline-variant/30">
              <p className="text-label-sm text-on-surface-variant">
                ¿Necesitas una constancia de pago o certificado tributario?{" "}
                <button className="text-primary hover:underline">Contáctanos</button>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
