"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ── Datos de selección ────────────────────────────────────────────────────────
const SECTORES = [
  "Agroindustria", "Comercio", "Construcción", "Educación", "Finanzas",
  "Logística", "Manufactura", "Salud", "Servicios", "Tecnología", "Otro",
];
const CIUDADES = [
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena",
  "Bucaramanga", "Pereira", "Manizales", "Ibagué", "Santa Marta", "Otra",
];
const TAMANOS: { label: string; value: string; icon: string }[] = [
  { label: "1–10",    value: "micro",   icon: "person" },
  { label: "11–50",   value: "pequena", icon: "group" },
  { label: "51–200",  value: "mediana", icon: "groups" },
  { label: "200+",    value: "grande",  icon: "corporate_fare" },
];
const CARGOS_COMUNES = [
  "Operarios", "Ventas", "Administración", "Tecnología", "Logística",
  "Contabilidad", "RRHH", "Marketing", "Ingeniería", "Atención al cliente",
];
const MODALIDADES = [
  { label: "Presencial", icon: "location_on" },
  { label: "Remoto",     icon: "laptop_mac" },
  { label: "Híbrido",    icon: "sync_alt" },
];
const FRECUENCIAS = [
  { label: "Continuamente (mensual)", value: "continuo" },
  { label: "Cada trimestre",          value: "trimestral" },
  { label: "Según necesidad",         value: "eventual" },
];

// ── Tipos ────────────────────────────────────────────────────────────────────
type Step = 0 | 1 | 2 | 3 | 4; // 0=welcome, 1-3=forms, 4=éxito

// ── Helpers de estilo ─────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl " +
  "h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary " +
  "focus:border-transparent transition-all placeholder:text-outline";
const selectCls =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl " +
  "h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary " +
  "focus:border-transparent transition-all appearance-none cursor-pointer";

// ── Barra de progreso ────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  if (step === 0 || step === 4) return null;
  const pct = (step / 3) * 100;
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-outline-variant/40 z-50">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Píldoras de paso ──────────────────────────────────────────────────────────
function StepPills({ current }: { current: Step }) {
  if (current === 0 || current === 4) return null;
  return (
    <div className="flex items-center justify-center gap-xs mb-lg">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 h-2 bg-primary"
              : i < current
              ? "w-2 h-2 bg-primary/40"
              : "w-2 h-2 bg-outline-variant"
          }`}
        />
      ))}
    </div>
  );
}

// ── Chip seleccionable ────────────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-sm py-xs rounded-full text-body-sm border transition-all active:scale-95 ${
        selected
          ? "bg-primary text-white border-primary shadow-md"
          : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
      }`}
    >
      {selected && (
        <span className="material-symbols-outlined text-[14px] align-middle mr-[2px]">check</span>
      )}
      {label}
    </button>
  );
}

// ── Confetti (step 4) ──────────────────────────────────────────────────────────
function Confetti() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const colors = ["#00355f", "#FF6200", "#00A676", "#0f4c81", "#7afac3", "#FFD700"];
    Array.from({ length: 60 }).forEach((_, i) => {
      const dot = document.createElement("div");
      const size = Math.random() * 8 + 4;
      dot.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        background:${colors[i % colors.length]};
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        left:${Math.random() * 100}%;
        top:-10px;
        opacity:${0.6 + Math.random() * 0.4};
        animation: confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      el.appendChild(dot);
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-40"
      />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Página principal
// ══════════════════════════════════════════════════════════════════════════════
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);

  // ── Estado step 1: Empresa ────────────────────────────────────────────────
  const [sector,    setSector]    = useState("");
  const [ciudad,    setCiudad]    = useState("");
  const [tamano,    setTamano]    = useState("");
  const [descripcion, setDescripcion] = useState("");

  // ── Estado step 2: Reclutador ─────────────────────────────────────────────
  const [nombreResp, setNombreResp] = useState("");
  const [cargo,      setCargo]      = useState("");
  const [telefono,   setTelefono]   = useState("");

  // ── Estado step 3: ¿Qué buscas? ──────────────────────────────────────────
  const [cargos,     setCargos]     = useState<string[]>([]);
  const [modalidad,  setModalidad]  = useState("");
  const [frecuencia, setFrecuencia] = useState("");

  // ── Helpers ───────────────────────────────────────────────────────────────
  const toggleCargo = (c: string) =>
    setCargos((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const canStep1 = !!sector && !!ciudad && !!tamano;
  const canStep2 = !!nombreResp && !!cargo;
  const canStep3 = cargos.length > 0 && !!modalidad && !!frecuencia;

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 0 ? ((s - 1) as Step) : s));

  const finish = () => {
    setStep(4);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 0 — Bienvenida
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-margin-mobile py-md flex items-center justify-between">
          <span className="flex items-center gap-xs text-primary font-bold text-headline-md">
            <span className="material-symbols-outlined">hub</span>
            TalentoYa
          </span>
          <Link href="/home" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">
            Omitir por ahora
          </Link>
        </header>

        <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl">
          <div className="flex flex-col items-center text-center" style={{ maxWidth: 480 }}>

            {/* Ícono animado */}
            <div className="relative mb-xl">
              <div className="w-28 h-28 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                <span
                  className="material-symbols-outlined text-white text-[56px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  rocket_launch
                </span>
              </div>
              {/* Puntitos orbitales */}
              {[
                { top: "-8px", right: "-8px", color: "bg-energy-orange", size: "w-5 h-5" },
                { bottom: "-4px", left: "-12px", color: "bg-brand-green", size: "w-4 h-4" },
                { top: "50%",  right: "-16px", color: "bg-primary-fixed-dim", size: "w-3 h-3" },
              ].map((dot, i) => (
                <div
                  key={i}
                  className={`absolute ${dot.size} ${dot.color} rounded-full`}
                  style={{ top: dot.top, right: dot.right, bottom: dot.bottom, left: dot.left }}
                />
              ))}
            </div>

            <span className="bg-secondary-container text-on-secondary-container text-label-sm px-sm py-xs rounded-full mb-lg">
              ¡Bienvenido/a a TalentoYa!
            </span>

            <h1 className="text-headline-lg text-primary mb-md">
              Configura tu empresa en <span className="text-energy-orange">3 pasos</span>
            </h1>
            <p className="text-body-md text-on-surface-variant mb-xl leading-relaxed">
              Cuéntanos sobre tu empresa para que nuestra IA encuentre el talento perfecto para tus vacantes.
            </p>

            {/* Pasos preview */}
            <div className="w-full bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.06)] p-lg mb-xl space-y-md">
              {[
                { icon: "business",     label: "Información de tu empresa",  desc: "Sector, ciudad y tamaño" },
                { icon: "badge",        label: "Tu perfil de reclutador",    desc: "Nombre, cargo y contacto" },
                { icon: "search_check", label: "¿Qué talento buscas?",      desc: "Perfiles y modalidad" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-md">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-label-md text-on-surface">{item.label}</p>
                    <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                  <span className="ml-auto text-label-sm text-on-surface-variant flex-shrink-0">
                    ~2 min
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={next}
              className="w-full bg-energy-orange text-white py-md rounded-xl text-label-md font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
            >
              Comenzar configuración
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </main>

        {/* BG decoration */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/4 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-energy-orange/4 rounded-full blur-3xl" />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 4 — Éxito
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-margin-mobile">
        <Confetti />
        <div className="flex flex-col items-center text-center" style={{ maxWidth: 480 }}>

          {/* Ícono de éxito */}
          <div className="w-28 h-28 rounded-full bg-brand-green flex items-center justify-center shadow-2xl shadow-green-500/30 mb-xl">
            <span
              className="material-symbols-outlined text-white text-[56px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>

          <h1 className="text-headline-lg text-primary mb-md">¡Tu empresa está lista!</h1>
          <p className="text-body-md text-on-surface-variant mb-xl leading-relaxed">
            La IA de TalentoYa ya está analizando candidatos para tu empresa.
            Recibirás tus primeros matches en minutos.
          </p>

          {/* Stats */}
          <div className="w-full grid grid-cols-3 gap-md mb-xl">
            {[
              { value: "2.847",  label: "Candidatos\ndisponibles",   color: "text-primary" },
              { value: "92%",    label: "Precisión\ndel match",      color: "text-brand-green" },
              { value: "< 48h",  label: "Para tu primer\nmatch",     color: "text-energy-orange" },
            ].map(({ value, label, color }) => (
              <div key={value} className="bg-white rounded-xl p-md border border-outline-variant/30 shadow-sm text-center">
                <p className={`text-headline-md font-bold ${color}`}>{value}</p>
                <p className="text-label-sm text-on-surface-variant mt-xs whitespace-pre-line leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="w-full bg-[#FFF4ED] border border-[#FFDBCC] rounded-xl p-lg mb-xl flex items-start gap-md text-left">
            <span
              className="material-symbols-outlined text-energy-orange text-[24px] flex-shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <p className="text-body-sm text-on-surface-variant">
              <span className="font-semibold text-on-surface">Tip: </span>
              Publica tu primera vacante para que la IA genere matches personalizados para tu empresa.
            </p>
          </div>

          <button
            onClick={() => router.push("/home")}
            className="w-full bg-primary text-white py-md rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm mb-md"
          >
            Ir al panel de reclutamiento
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <Link
            href="/vacantes/nueva"
            className="w-full border-2 border-energy-orange text-energy-orange py-md rounded-xl text-label-md font-bold hover:bg-energy-orange hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Publicar primera vacante
          </Link>
        </div>

        {/* BG */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-green/4 to-primary/4" />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEPS 1–3 — Formularios
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressBar step={step} />

      {/* Header */}
      <header className="fixed top-1 left-0 w-full z-40 px-margin-mobile py-sm flex items-center justify-between bg-background/80 backdrop-blur-sm">
        <button
          onClick={back}
          className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          aria-label="Volver"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-label-sm text-on-surface-variant">Paso {step} de 3</span>
        <Link href="/home" className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">
          Omitir
        </Link>
      </header>

      <main className="flex-grow flex items-start justify-center px-margin-mobile pt-[72px] pb-xl">
        <div className="w-full" style={{ maxWidth: 520 }}>
          <StepPills current={step} />

          {/* ── STEP 1: Información de empresa ─────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-xl">
              <div className="text-center space-y-xs">
                <div className="flex justify-center mb-md">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">business</span>
                  </div>
                </div>
                <h2 className="text-headline-md text-primary">Cuéntanos sobre tu empresa</h2>
                <p className="text-body-sm text-on-surface-variant">Esta información ayuda a la IA a encontrar el talento adecuado para tu sector.</p>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.06)] p-xl space-y-lg">

                {/* Sector */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Sector / Industria</label>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                    >
                      <option value="">Selecciona tu sector</option>
                      {SECTORES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>

                {/* Ciudad */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Ciudad principal de operación</label>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                    >
                      <option value="">Selecciona tu ciudad</option>
                      {CIUDADES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>

                {/* Tamaño */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Número de empleados</label>
                  <div className="grid grid-cols-2 gap-sm">
                    {TAMANOS.map(({ label, value, icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTamano(value)}
                        className={`flex items-center gap-sm p-md rounded-xl border-2 transition-all active:scale-95 text-left ${
                          tamano === value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/40"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                        <span className="text-label-md">{label}</span>
                        {tamano === value && (
                          <span className="ml-auto material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            radio_button_checked
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">
                    Descripción breve de la empresa{" "}
                    <span className="text-on-surface-variant font-normal">(opcional)</span>
                  </label>
                  <textarea
                    className={`${inputCls} h-auto py-sm resize-none`}
                    rows={3}
                    placeholder="Ej: Empresa colombiana de manufactura textil con 20 años de experiencia..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    maxLength={200}
                  />
                  <p className="text-label-sm text-on-surface-variant text-right">{descripcion.length}/200</p>
                </div>
              </div>

              <button
                onClick={next}
                disabled={!canStep1}
                className="w-full bg-energy-orange text-white py-md rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
              >
                Continuar
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* ── STEP 2: Perfil del reclutador ─────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-xl">
              <div className="text-center space-y-xs">
                <div className="flex justify-center mb-md">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">badge</span>
                  </div>
                </div>
                <h2 className="text-headline-md text-primary">Tu perfil de reclutador</h2>
                <p className="text-body-sm text-on-surface-variant">Los candidatos verán quién los contacta. Genera confianza con un perfil completo.</p>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.06)] p-xl space-y-lg">

                {/* Avatar placeholder */}
                <div className="flex flex-col items-center gap-md">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 cursor-pointer group-hover:bg-primary/15 transition-colors">
                      <span className="material-symbols-outlined text-primary text-[32px]">person</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer">
                      <span className="material-symbols-outlined text-white text-[14px]">photo_camera</span>
                    </div>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">Foto de perfil (opcional)</p>
                </div>

                {/* Nombre */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Tu nombre completo</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant text-[20px] pointer-events-none">person</span>
                    <input
                      className={`${inputCls} pl-[44px]`}
                      placeholder="Ej: María García"
                      value={nombreResp}
                      onChange={(e) => setNombreResp(e.target.value)}
                    />
                  </div>
                </div>

                {/* Cargo */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Cargo en la empresa</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant text-[20px] pointer-events-none">work</span>
                    <input
                      className={`${inputCls} pl-[44px]`}
                      placeholder="Ej: Gerente de RRHH"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">
                    Teléfono de contacto{" "}
                    <span className="text-on-surface-variant font-normal">(opcional)</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center justify-center bg-surface-variant px-md rounded-l-xl border border-r-0 border-outline-variant text-label-md select-none flex-shrink-0">
                      +57
                    </div>
                    <input
                      className={`${inputCls} rounded-l-none`}
                      type="tel"
                      placeholder="300 123 4567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tip privacidad */}
                <div className="flex items-start gap-sm p-sm bg-primary/5 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">shield</span>
                  <p className="text-label-sm text-on-surface-variant leading-relaxed">
                    Tu información está protegida bajo la{" "}
                    <Link href="/politica-privacidad" target="_blank" className="text-primary hover:underline">
                      Ley 1581 de 2012
                    </Link>{" "}
                    (Habeas Data). Solo la usamos para conectarte con candidatos.
                  </p>
                </div>
              </div>

              <div className="flex gap-md">
                <button
                  onClick={back}
                  className="px-xl py-md border-2 border-outline-variant text-on-surface-variant rounded-xl text-label-md font-bold hover:bg-surface-container transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={next}
                  disabled={!canStep2}
                  className="flex-1 bg-energy-orange text-white py-md rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
                >
                  Continuar
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: ¿Qué talento buscas? ─────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-xl">
              <div className="text-center space-y-xs">
                <div className="flex justify-center mb-md">
                  <div className="w-12 h-12 rounded-2xl bg-energy-orange/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-energy-orange">search_check</span>
                  </div>
                </div>
                <h2 className="text-headline-md text-primary">¿Qué talento buscas?</h2>
                <p className="text-body-sm text-on-surface-variant">La IA usará esto para priorizar los candidatos más relevantes para tu empresa.</p>
              </div>

              <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.06)] p-xl space-y-xl">

                {/* Tipos de cargos */}
                <div className="space-y-sm">
                  <label className="text-label-md text-on-surface">
                    Tipos de cargos que sueles contratar{" "}
                    <span className="text-energy-orange">*</span>
                  </label>
                  <p className="text-label-sm text-on-surface-variant">Selecciona todos los que apliquen</p>
                  <div className="flex flex-wrap gap-sm pt-xs">
                    {CARGOS_COMUNES.map((c) => (
                      <Chip
                        key={c}
                        label={c}
                        selected={cargos.includes(c)}
                        onToggle={() => toggleCargo(c)}
                      />
                    ))}
                  </div>
                  {cargos.length > 0 && (
                    <p className="text-label-sm text-primary">
                      {cargos.length} {cargos.length === 1 ? "seleccionado" : "seleccionados"}
                    </p>
                  )}
                </div>

                <hr className="border-outline-variant/40" />

                {/* Modalidad */}
                <div className="space-y-sm">
                  <label className="text-label-md text-on-surface">
                    Modalidad preferida <span className="text-energy-orange">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-sm">
                    {MODALIDADES.map(({ label, icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setModalidad(label)}
                        className={`flex flex-col items-center gap-xs py-md px-sm rounded-xl border-2 transition-all active:scale-95 ${
                          modalidad === label
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/40"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">{icon}</span>
                        <span className="text-label-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-outline-variant/40" />

                {/* Frecuencia de contratación */}
                <div className="space-y-sm">
                  <label className="text-label-md text-on-surface">
                    ¿Con qué frecuencia contratas? <span className="text-energy-orange">*</span>
                  </label>
                  <div className="space-y-sm">
                    {FRECUENCIAS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFrecuencia(value)}
                        className={`w-full flex items-center gap-md p-md rounded-xl border-2 transition-all text-left ${
                          frecuencia === value
                            ? "border-primary bg-primary/5"
                            : "border-outline-variant bg-surface-container-low hover:border-primary/40"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          frecuencia === value ? "border-primary bg-primary" : "border-outline"
                        }`}>
                          {frecuencia === value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={`text-body-sm ${frecuencia === value ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-md">
                <button
                  onClick={back}
                  className="px-xl py-md border-2 border-outline-variant text-on-surface-variant rounded-xl text-label-md font-bold hover:bg-surface-container transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={finish}
                  disabled={!canStep3}
                  className="flex-1 bg-primary text-white py-md rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Finalizar configuración
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BG decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-energy-orange/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
