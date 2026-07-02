"use client";

import Link from "next/link";
import { useState } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Channel = "email" | "push" | "whatsapp";

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  icon: string;
  channels: Record<Channel, boolean>;
  category: string;
}

// ── Configuración inicial ──────────────────────────────────────────────────────
const INITIAL: NotifSetting[] = [
  // Vacantes
  {
    id: "nueva_postulacion",
    label: "Nueva postulación recibida",
    description: "Cuando un candidato se postula a una de tus vacantes.",
    icon: "person_add",
    category: "Vacantes",
    channels: { email: true, push: true, whatsapp: false },
  },
  {
    id: "match_ia",
    label: "Match de IA disponible",
    description: "Cuando la IA encuentra un candidato con alta compatibilidad (+85%).",
    icon: "psychology",
    category: "Vacantes",
    channels: { email: true, push: true, whatsapp: true },
  },
  {
    id: "vacante_expira",
    label: "Vacante por vencer",
    description: "Recordatorio 3 días antes de que expire la publicación.",
    icon: "timer",
    category: "Vacantes",
    channels: { email: true, push: false, whatsapp: false },
  },
  {
    id: "candidato_visto",
    label: "Candidato revisó tu empresa",
    description: "Cuando un candidato visita el perfil de tu empresa.",
    icon: "visibility",
    category: "Vacantes",
    channels: { email: false, push: false, whatsapp: false },
  },
  // Mensajería
  {
    id: "nuevo_mensaje",
    label: "Nuevo mensaje recibido",
    description: "Cuando un candidato te envía un mensaje directo.",
    icon: "chat",
    category: "Mensajería",
    channels: { email: true, push: true, whatsapp: false },
  },
  {
    id: "respuesta_pendiente",
    label: "Respuesta pendiente",
    description: "Recordatorio si no has respondido un mensaje en más de 48 horas.",
    icon: "pending",
    category: "Mensajería",
    channels: { email: true, push: false, whatsapp: false },
  },
  // Cuenta y facturación
  {
    id: "factura_generada",
    label: "Factura generada",
    description: "Cuando se emite una nueva factura de tu suscripción.",
    icon: "receipt_long",
    category: "Cuenta",
    channels: { email: true, push: false, whatsapp: false },
  },
  {
    id: "pago_fallido",
    label: "Pago fallido",
    description: "Si el cobro automático de tu suscripción no se procesa.",
    icon: "credit_card_off",
    category: "Cuenta",
    channels: { email: true, push: true, whatsapp: true },
  },
  {
    id: "plan_cambiado",
    label: "Cambio de plan",
    description: "Confirmación al actualizar o degradar tu plan.",
    icon: "stars",
    category: "Cuenta",
    channels: { email: true, push: false, whatsapp: false },
  },
  // Resúmenes
  {
    id: "resumen_semanal",
    label: "Resumen semanal",
    description: "Estadísticas de postulaciones, vistas y matches cada lunes.",
    icon: "bar_chart",
    category: "Resúmenes",
    channels: { email: true, push: false, whatsapp: false },
  },
  {
    id: "reporte_mensual",
    label: "Reporte mensual",
    description: "Análisis completo de rendimiento de tus vacantes.",
    icon: "summarize",
    category: "Resúmenes",
    channels: { email: true, push: false, whatsapp: false },
  },
  // Novedades
  {
    id: "actualizaciones",
    label: "Actualizaciones de TalentoYa",
    description: "Nuevas funciones, mejoras y novedades de la plataforma.",
    icon: "campaign",
    category: "Novedades",
    channels: { email: false, push: false, whatsapp: false },
  },
  {
    id: "tips",
    label: "Consejos para atraer talento",
    description: "Guías y buenas prácticas para mejorar tus publicaciones.",
    icon: "lightbulb",
    category: "Novedades",
    channels: { email: false, push: false, whatsapp: false },
  },
];

const CHANNELS: { key: Channel; label: string; icon: string; color: string }[] = [
  { key: "email",    label: "Email",    icon: "email",         color: "text-primary"          },
  { key: "push",     label: "Push",     icon: "notifications", color: "text-energy-orange"    },
  { key: "whatsapp", label: "WhatsApp", icon: "chat",          color: "text-whatsapp-green"   },
];

const CATEGORIES = ["Vacantes", "Mensajería", "Cuenta", "Resúmenes", "Novedades"];

const card = "bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

// ── Toggle pill ────────────────────────────────────────────────────────────────
function Toggle({
  checked, onChange, color = "bg-primary",
}: { checked: boolean; onChange: () => void; color?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? color : "bg-outline-variant"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 mt-1 ml-1 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function NotificacionesPage() {
  const [settings, setSettings] = useState<NotifSetting[]>(INITIAL);
  const [saved,    setSaved]    = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd,   setQuietEnd]   = useState("08:00");
  const [quietEnabled, setQuietEnabled] = useState(false);
  const [freq, setFreq] = useState<"inmediato" | "agrupado" | "resumen">("inmediato");

  const toggle = (id: string, ch: Channel) =>
    setSettings(prev =>
      prev.map(s =>
        s.id === id ? { ...s, channels: { ...s.channels, [ch]: !s.channels[ch] } } : s
      )
    );

  // Activar / desactivar canal completo para una notificación
  const toggleAll = (id: string, on: boolean) =>
    setSettings(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, channels: { email: on, push: on, whatsapp: on } }
          : s
      )
    );

  // Activar / desactivar columna entera de canal
  const toggleColumn = (ch: Channel) => {
    const allOn = settings.every(s => s.channels[ch]);
    setSettings(prev =>
      prev.map(s => ({ ...s, channels: { ...s.channels, [ch]: !allOn } }))
    );
  };

  const handleSave = () => {
    // TODO: persistir en Firestore
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const byCategory = CATEGORIES.map(cat => ({
    cat,
    items: settings.filter(s => s.category === cat),
  }));

  // Conteo de notificaciones activas
  const activeCount = settings.reduce(
    (acc, s) => acc + Object.values(s.channels).filter(Boolean).length,
    0
  );

  const inputCls =
    "bg-surface-container-low border border-outline-variant rounded-xl h-10 px-sm " +
    "text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="px-margin-mobile md:px-gutter py-xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs text-on-surface-variant mb-xl">
        <Link href="/configuracion" className="text-label-sm hover:text-primary transition-colors">Configuración</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-label-sm font-semibold text-primary">Notificaciones</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-5xl">

        {/* ── Columna principal ─────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-gutter">

          {/* ── Cabecera de la tabla ─────────────────────────────────────── */}
          <div className={`${card} overflow-hidden`}>

            {/* Header */}
            <div className="px-xl pt-xl pb-lg border-b border-outline-variant/30">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">notifications_active</span>
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface">Preferencias de notificación</h2>
                  <p className="text-body-sm text-on-surface-variant">
                    {activeCount} {activeCount !== 1 ? "notificaciones activas" : "notificación activa"} en {settings.length} eventos.
                  </p>
                </div>
              </div>
            </div>

            {/* Columnas de canal — cabecera sticky */}
            <div className="px-xl py-md bg-surface-container-low border-b border-outline-variant/30 hidden sm:block">
              <div className="grid grid-cols-[1fr_repeat(3,56px)] gap-md items-center">
                <span className="text-label-sm text-on-surface-variant">Evento</span>
                {CHANNELS.map(ch => (
                  <button
                    key={ch.key}
                    onClick={() => toggleColumn(ch.key)}
                    className={`flex flex-col items-center gap-xs group transition-opacity`}
                    title={`Activar/desactivar todo — ${ch.label}`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${ch.color}`}>{ch.icon}</span>
                    <span className="text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filas por categoría */}
            {byCategory.map(({ cat, items }) => (
              <div key={cat}>
                {/* Separador de categoría */}
                <div className="px-xl py-sm bg-surface-container-low/60 border-b border-outline-variant/20">
                  <span className="text-label-sm font-semibold text-primary uppercase tracking-wide">{cat}</span>
                </div>

                {items.map((s, idx) => {
                  const allOn = Object.values(s.channels).every(Boolean);
                  const noneOn = Object.values(s.channels).every(v => !v);
                  return (
                    <div
                      key={s.id}
                      className={`px-xl py-lg border-b border-outline-variant/20 last:border-0 transition-colors hover:bg-surface-container-low/40 ${
                        noneOn ? "opacity-60" : ""
                      }`}
                    >
                      {/* Mobile: apilado */}
                      <div className="flex flex-col sm:hidden gap-sm">
                        <div className="flex items-start gap-md">
                          <span className={`material-symbols-outlined text-[20px] mt-px ${noneOn ? "text-outline-variant" : "text-primary"}`}>
                            {s.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-label-md text-on-surface">{s.label}</p>
                            <p className="text-body-sm text-on-surface-variant">{s.description}</p>
                          </div>
                          {/* Toggle global móvil */}
                          <Toggle checked={allOn} onChange={() => toggleAll(s.id, !allOn)} />
                        </div>
                        {allOn && (
                          <div className="flex gap-lg ml-[36px]">
                            {CHANNELS.map(ch => (
                              <label key={ch.key} className="flex items-center gap-xs cursor-pointer">
                                <input type="checkbox" checked={s.channels[ch.key]}
                                  onChange={() => toggle(s.id, ch.key)}
                                  className="w-4 h-4 rounded accent-primary cursor-pointer" />
                                <span className="text-body-sm text-on-surface-variant">{ch.label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Desktop: grilla */}
                      <div className="hidden sm:grid grid-cols-[1fr_repeat(3,56px)] gap-md items-center">
                        <div className="flex items-start gap-md min-w-0">
                          <span className={`material-symbols-outlined text-[20px] mt-px flex-shrink-0 ${noneOn ? "text-outline-variant" : "text-primary"}`}>
                            {s.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-label-md text-on-surface truncate">{s.label}</p>
                            <p className="text-body-sm text-on-surface-variant leading-snug">{s.description}</p>
                          </div>
                        </div>
                        {CHANNELS.map(ch => (
                          <div key={ch.key} className="flex justify-center">
                            <Toggle
                              checked={s.channels[ch.key]}
                              onChange={() => toggle(s.id, ch.key)}
                              color={
                                ch.key === "email"    ? "bg-primary"         :
                                ch.key === "push"     ? "bg-energy-orange"   :
                                                        "bg-whatsapp-green"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── Guardar ──────────────────────────────────────────────────── */}
          <div className="flex justify-end gap-md">
            <button
              onClick={() => setSettings(INITIAL)}
              className="px-xl py-md border border-outline-variant text-on-surface-variant rounded-xl text-label-md hover:bg-surface-container transition-colors"
            >
              Restaurar por defecto
            </button>
            <button
              onClick={handleSave}
              className="px-xl py-md bg-energy-orange text-white rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-sm"
            >
              {saved ? (
                <><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>¡Guardado!</>
              ) : (
                <><span className="material-symbols-outlined text-[20px]">save</span>Guardar cambios</>
              )}
            </button>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-gutter">

          {/* Frecuencia de entrega */}
          <div className={`${card} p-xl`}>
            <h3 className="text-label-md text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">schedule_send</span>
              Frecuencia de entrega
            </h3>
            <p className="text-body-sm text-on-surface-variant mb-lg">
              ¿Con qué velocidad quieres recibir las notificaciones?
            </p>
            <div className="space-y-sm">
              {([
                { key: "inmediato", label: "Inmediato",    sub: "Al instante que ocurre el evento",     icon: "bolt"          },
                { key: "agrupado",  label: "Agrupado",     sub: "Cada 2 horas, máximo 3 por bloque",    icon: "stacked_inbox" },
                { key: "resumen",   label: "Resumen diario",sub: "Una vez al día, a las 9:00 a.m.",     icon: "today"         },
              ] as const).map(({ key, label, sub, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFreq(key)}
                  className={`w-full flex items-center gap-md p-md rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                    freq === key
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-outline"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[22px] ${freq === key ? "text-primary" : "text-on-surface-variant"}`}>{icon}</span>
                  <div>
                    <p className={`text-label-md ${freq === key ? "text-primary font-bold" : "text-on-surface"}`}>{label}</p>
                    <p className="text-body-sm text-on-surface-variant">{sub}</p>
                  </div>
                  {freq === key && (
                    <span className="ml-auto material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Horario silencioso */}
          <div className={`${card} p-xl`}>
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-label-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">do_not_disturb_on</span>
                Horario silencioso
              </h3>
              <Toggle
                checked={quietEnabled}
                onChange={() => setQuietEnabled(p => !p)}
              />
            </div>
            <p className="text-body-sm text-on-surface-variant mb-lg">
              No recibirás notificaciones push ni WhatsApp en este horario.
            </p>
            <div className={`space-y-md transition-opacity ${quietEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <div className="space-y-xs">
                <label className="text-label-sm text-on-surface-variant">Desde</label>
                <input type="time" className={`${inputCls} w-full`}
                  value={quietStart} onChange={e => setQuietStart(e.target.value)} />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm text-on-surface-variant">Hasta</label>
                <input type="time" className={`${inputCls} w-full`}
                  value={quietEnd} onChange={e => setQuietEnd(e.target.value)} />
              </div>
              <div className="flex items-center gap-xs bg-primary/5 rounded-xl px-md py-sm">
                <span className="material-symbols-outlined text-primary text-[16px]">info</span>
                <p className="text-label-sm text-primary">
                  Silencio de {quietStart} a {quietEnd} todos los días.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de canales */}
          <div className={`${card} p-xl`}>
            <h3 className="text-label-md text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              Estado de canales
            </h3>
            <div className="space-y-md">
              {CHANNELS.map(ch => {
                const count = settings.filter(s => s.channels[ch.key]).length;
                const pct   = Math.round((count / settings.length) * 100);
                return (
                  <div key={ch.key}>
                    <div className="flex items-center justify-between mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className={`material-symbols-outlined text-[18px] ${ch.color}`}>{ch.icon}</span>
                        <span className="text-label-md text-on-surface">{ch.label}</span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant">{count}/{settings.length}</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ch.key === "email"    ? "bg-primary"       :
                          ch.key === "push"     ? "bg-energy-orange" :
                                                  "bg-whatsapp-green"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WhatsApp — conectar */}
          <div className={`${card} p-xl bg-[#25D366]/5 border-[#25D366]/20`}>
            <div className="flex items-center gap-md mb-md">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#25D366]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface">WhatsApp Business</p>
                <p className="text-body-sm text-on-surface-variant">Sin conectar</p>
              </div>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-lg leading-relaxed">
              Conecta tu número para recibir alertas de matches y mensajes directamente en WhatsApp.
            </p>
            <button className="w-full py-sm bg-[#25D366] text-white rounded-xl text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              Conectar WhatsApp
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
