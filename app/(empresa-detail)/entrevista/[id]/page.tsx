"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Send = "idle" | "loading" | "success";

const SLOTS  = ["09:00 – 10:00","10:00 – 11:00","14:00 – 15:00","15:00 – 16:00","16:30 – 17:30"];
const DAYS   = ["L","M","M","J","V","S","D"];
const COLORS = ["#F28C28","#1565C0","#4CAF50","#E91E63","#9C27B0","#FF9800"];
const MESES  = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// Devuelve los 7 días de la semana (lun–dom) que contiene `base`
function getWeek(base: Date): Date[] {
  const d = new Date(base);
  const dow = d.getDay(); // 0=Dom
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1)); // retroceder a lunes
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(d);
    dd.setDate(d.getDate() + i);
    return dd;
  });
}

// YYYY-MM-DD para usar como clave
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

// "26 may." → label legible del chip
function chipLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3).toLowerCase()}.`;
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    Array.from({ length: 50 }).forEach((_, i) => {
      const d = document.createElement("div");
      d.style.cssText = `position:absolute;width:8px;height:8px;border-radius:2px;left:${Math.random()*100}%;top:-10px;background:${COLORS[i%COLORS.length]};animation:fall ${1.5+Math.random()}s ease-in ${Math.random()*0.8}s forwards;opacity:0`;
      el.appendChild(d);
    });
  }, []);
  return (
    <>
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(80vh) rotate(720deg);opacity:0}}`}</style>
      <div ref={ref} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />
    </>
  );
}

// ── Tarjeta candidato ─────────────────────────────────────────────────────────
function CandidateCard() {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant flex items-center gap-md p-lg shadow-md">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-label-md flex-shrink-0">MR</div>
      <div className="flex-1 min-w-0">
        <p className="text-label-md text-on-surface font-semibold">Mateo Rivera</p>
        <p className="text-body-sm text-on-surface-variant truncate">Asistente Administrativo</p>
      </div>
      <span className="bg-[#4CAF50]/10 text-[#4CAF50] text-label-sm font-bold px-sm py-xs rounded-full flex-shrink-0">94% Match</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AgendarEntrevistaPage() {
  const [dates,    setDates]   = useState<string[]>([]);
  const [slot,     setSlot]    = useState<string | null>(null);
  const [view,     setView]    = useState<"week"|"mes">("week");
  const [send,     setSend]    = useState<Send>("idle");
  const [weekBase, setWeekBase] = useState<Date | null>(null);

  // Inicializar en cliente para evitar hydration mismatch
  useEffect(() => { setWeekBase(new Date()); }, []);

  const today  = useMemo(() => isoDate(new Date()), []);
  const week   = useMemo(() => weekBase ? getWeek(weekBase) : [], [weekBase]);

  // Cabecera: "Mayo 2026" o "Mayo – Junio 2026" si la semana cruza mes
  const header = useMemo(() => {
    if (!week.length) return "";
    const first = week[0], last = week[6];
    return first.getMonth() === last.getMonth()
      ? `${MESES[first.getMonth()]} ${first.getFullYear()}`
      : `${MESES[first.getMonth()]} – ${MESES[last.getMonth()]} ${last.getFullYear()}`;
  }, [week]);

  const prevWeek = () => setWeekBase(b => { const d = new Date(b!); d.setDate(d.getDate() - 7); return d; });
  const nextWeek = () => setWeekBase(b => { const d = new Date(b!); d.setDate(d.getDate() + 7); return d; });

  const toggleDate = (d: string) =>
    setDates(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  const submit = () => {
    if (send !== "idle") return;
    setSend("loading");
    setTimeout(() => setSend("success"), 1800);
  };

  // ── ÉXITO ──────────────────────────────────────────────────────────────────
  if (send === "success") return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-margin-mobile py-xl text-center">
      <Confetti />
      <div className="w-32 h-32 rounded-full bg-secondary-container/30 flex items-center justify-center mb-xl"
        style={{ animation: "celebrate .6s ease-out" }}>
        <style>{`@keyframes celebrate{0%{transform:scale(0) rotate(-15deg)}70%{transform:scale(1.1) rotate(5deg)}100%{transform:scale(1) rotate(0)}}`}</style>
        <span className="material-symbols-outlined text-secondary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>

      <h1 className="text-headline-lg text-primary mb-sm">¡Propuesta Enviada!</h1>
      <p className="text-body-md text-on-surface-variant mb-xl leading-relaxed" style={{ maxWidth: "20rem" }}>
        <strong className="text-on-surface">Mateo Rivera</strong> recibirá tu propuesta de entrevista con las fechas y horario seleccionados.
      </p>

      <div className="w-full mb-xl" style={{ maxWidth: "24rem" }}>
        <CandidateCard />
      </div>

      <div className="flex flex-col sm:flex-row gap-md w-full" style={{ maxWidth: "24rem" }}>
        <Link href="/mensajes"
          className="flex-1 bg-energy-orange text-white py-md rounded-xl text-label-md font-bold flex items-center justify-center gap-sm hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[20px]">chat</span>Ir al Chat
        </Link>
        <Link href="/home"
          className="flex-1 border-2 border-primary text-primary py-md rounded-xl text-label-md font-bold flex items-center justify-center gap-sm hover:bg-primary-fixed transition-colors">
          <span className="material-symbols-outlined text-[20px]">home</span>Volver al Inicio
        </Link>
      </div>

      <a href="#" className="mt-xl text-label-sm text-[#25D366] flex items-center gap-xs hover:underline">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        Contactar por WhatsApp
      </a>
    </div>
  );

  // ── FORMULARIO ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-28">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface shadow-sm flex items-center gap-md px-margin-mobile md:px-gutter h-16">
        <Link href="/home" className="p-xs rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </Link>
        <h1 className="text-headline-md text-on-surface flex-1">Agendar Entrevista</h1>
      </header>

      <div className="px-margin-mobile md:px-gutter py-xl max-w-3xl mx-auto space-y-gutter">

        {/* Banner candidato */}
        <div className="bg-primary rounded-2xl p-lg flex items-center gap-md text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-label-md flex-shrink-0">MR</div>
          <div className="flex-1 min-w-0">
            <p className="text-label-md font-semibold">Mateo Rivera</p>
            <p className="text-body-sm opacity-80 truncate">mateo.rivera@email.com · Asistente Administrativo</p>
          </div>
          <span className="bg-[#4CAF50] text-white text-label-sm font-bold px-sm py-xs rounded-full flex-shrink-0">94%</span>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-xl">

          {/* Cabecera: mes + navegación + toggle */}
          <div className="flex items-center justify-between mb-lg gap-md flex-wrap">
            <div className="flex items-center gap-sm">
              <button onClick={prevWeek}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_left</span>
              </button>
              <h2 className="text-label-md text-on-surface font-semibold min-w-[10rem] text-center">{header}</h2>
              <button onClick={nextWeek}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_right</span>
              </button>
            </div>
            <div className="flex bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant">
              {(["week","mes"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-md py-xs text-label-sm transition-colors ${view === v ? "bg-primary text-white" : "text-on-surface-variant"}`}>
                  {v === "week" ? "Semana" : "Mes"}
                </button>
              ))}
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-xs text-center mb-xs">
            {DAYS.map((d, i) => (
              <div key={i} className="text-label-sm text-on-surface-variant py-xs">{d}</div>
            ))}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-7 gap-xs text-center">
            {week.map(d => {
              const key    = isoDate(d);
              const active = dates.includes(key);
              const isToday = key === today;
              return (
                <button key={key} onClick={() => toggleDate(key)}
                  className={`aspect-square rounded-xl text-label-md flex flex-col items-center justify-center gap-[2px] transition-all hover:bg-primary-fixed ${
                    active  ? "bg-primary text-white shadow-md" :
                    isToday ? "ring-2 ring-primary text-primary font-bold" :
                              "text-on-surface"
                  }`}>
                  <span>{d.getDate()}</span>
                  {isToday && !active && (
                    <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Chips de fechas seleccionadas */}
          {dates.length > 0 && (
            <div className="flex flex-wrap gap-sm mt-lg pt-lg border-t border-outline-variant">
              {dates.map(d => (
                <span key={d} className="flex items-center gap-xs bg-primary-fixed text-primary text-label-sm px-sm py-xs rounded-full">
                  {chipLabel(d)}
                  <button onClick={() => toggleDate(d)} className="hover:text-error leading-none font-bold">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Horarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-xl">
          <h2 className="text-label-md text-on-surface font-semibold mb-lg">Horario Disponible</h2>
          <div className="space-y-sm">
            {SLOTS.map(s => {
              const active = slot === s;
              return (
                <button key={s} onClick={() => setSlot(active ? null : s)}
                  className={`w-full flex items-center justify-between p-md rounded-xl border transition-all ${
                    active ? "border-primary bg-primary-fixed" : "border-outline-variant hover:border-primary"}`}>
                  <div className="flex items-center gap-md">
                    <span className={`material-symbols-outlined text-[20px] ${active ? "text-primary" : "text-outline"}`}
                      style={{ fontVariationSettings: active ? "'FILL' 1" : undefined }}>
                      {active ? "check_circle" : "add_circle"}
                    </span>
                    <span className={`text-label-md ${active ? "text-primary font-semibold" : "text-on-surface"}`}>{s}</span>
                  </div>
                  {active && (
                    <span className="text-label-sm text-primary font-bold bg-primary/10 px-sm py-xs rounded-full">Seleccionado</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integraciones */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-xl">
          <h2 className="text-label-md text-on-surface font-semibold mb-lg">Integraciones de Calendario</h2>
          <div className="space-y-sm">
            <div className="flex items-center justify-between p-md rounded-xl border border-outline-variant">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-[#4285F4] text-[24px]">event</span>
                <div>
                  <p className="text-label-md text-on-surface">Google Calendar</p>
                  <p className="text-body-sm text-on-surface-variant">agenda@conectalab.co</p>
                </div>
              </div>
              <span className="bg-[#4CAF50]/10 text-[#4CAF50] text-label-sm font-bold px-sm py-xs rounded-full">Conectado</span>
            </div>
            <div className="flex items-center justify-between p-md rounded-xl border border-outline-variant opacity-50">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-[#0078D4] text-[24px]">calendar_month</span>
                <div>
                  <p className="text-label-md text-on-surface">Outlook Calendar</p>
                  <p className="text-body-sm text-on-surface-variant">No conectado</p>
                </div>
              </div>
              <a href="#" className="text-primary text-label-sm hover:underline">Conectar</a>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-md">
          <button className="flex-1 border-2 border-primary text-primary py-md rounded-xl text-label-md font-bold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-[20px]">save</span>
            Guardar Borrador
          </button>
          <button onClick={submit}
            disabled={send !== "idle" || (!dates.length && !slot)}
            className="flex-1 bg-energy-orange text-white py-md rounded-xl text-label-md font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-sm">
            {send === "loading"
              ? <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Enviando...</>
              : <><span className="material-symbols-outlined text-[20px]">send</span> Enviar Propuesta</>}
          </button>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a href="#"
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#25D366] text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="WhatsApp">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
      </a>
    </div>
  );
}
