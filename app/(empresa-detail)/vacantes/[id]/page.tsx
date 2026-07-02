"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Ring del badge de match — r=18, container 48×48 ──────────────────────────
const RING_R = 18;
const RING_C = 2 * Math.PI * RING_R; // ≈ 113.1

// ── Datos demo ────────────────────────────────────────────────────────────────
// TODO: fetch desde Firestore usando params.id
const JOB = {
  title: "Técnico Electromecánico Senior",
  company: "Inversiones Antioquia S.A.S",
  companyLogo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAAKcximyZmpZwhfIC7wSUiuv3lsv3mwbbdoppF00TLsXGHyMTVIAog2Eh8iWOI0MYdKG6N0eSmvTXrWiGGWYUv2liWXPjGexwW7zQmScADh0gU6futFj36VB58BcgwQKXer3-YvwN3cEBIjEevJ9Tzfl-Gg2vrpIg23ODNOl4CrljnTOZogCrYzVBikUr5z5jOUf3g15v0F8tMyw2E_UFWLNPk5SND4asr3ACQflfRtZxt0oEBfkGkHPwnkNxU04nX-34seAVDBQ",
  matchScore: 88,
  infoChips: [
    { icon: "location_on",  label: "Ubicación", value: "Medellín, Ant."  },
    { icon: "payments",     label: "Salario",   value: "$2.5M - $3.2M"   },
    { icon: "schedule",     label: "Jornada",   value: "Completa"         },
    { icon: "description",  label: "Contrato",  value: "Indefinido"       },
  ],
  aiReasons: [
    "Tus 5 años de experiencia en mantenimiento preventivo coinciden con el requisito principal.",
    "La ubicación está a solo 25 minutos de tu residencia registrada.",
  ],
  description:
    "Buscamos un Técnico Electromecánico Senior para liderar el equipo de mantenimiento en nuestra planta principal. Serás responsable de garantizar la operatividad de maquinaria industrial compleja y coordinar planes de mantenimiento preventivo y correctivo.",
  skills: ["PLC Siemens", "Neumática e Hidráulica", "Lectura de Planos", "Mantenimiento RCM"],
  benefits: [
    { icon: "restaurant",     label: "Casino / Alimentación"   },
    { icon: "directions_bus", label: "Ruta de transporte"       },
    { icon: "star",           label: "Prima extralegal anual"   },
  ],
};

// ── Estados del botón de postulación ─────────────────────────────────────────
type ApplyState = "idle" | "loading" | "success";

// ── Botones de acción reutilizados en mobile bar y desktop panel ──────────────
interface ApplyButtonsProps {
  applyState: ApplyState;
  saved: boolean;
  onApply: () => void;
  onToggleSave: () => void;
}
function ApplyButtons({ applyState, saved, onApply, onToggleSave }: ApplyButtonsProps) {
  return (
    <div className="flex flex-col gap-sm">
      {/* Postularme */}
      <button
        onClick={onApply}
        disabled={applyState !== "idle"}
        className={`w-full text-white text-label-md py-md rounded-xl flex items-center justify-center gap-sm transition-all duration-300 disabled:cursor-not-allowed active:scale-[0.98] ${
          applyState === "success"
            ? "bg-secondary"
            : "bg-brand-orange shadow-[0px_4px_14px_rgba(255,98,0,0.3)] hover:brightness-110 disabled:opacity-80"
        }`}
      >
        {applyState === "idle" && (
          <>
            <span>Postularme Ahora</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </>
        )}
        {applyState === "loading" && (
          <>
            <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
            <span>Procesando...</span>
          </>
        )}
        {applyState === "success" && (
          <>
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>¡Postulación enviada!</span>
          </>
        )}
      </button>

      {/* Guardar */}
      <button
        onClick={onToggleSave}
        className={`w-full border-2 border-primary text-primary text-label-md py-md rounded-xl flex items-center justify-center gap-sm transition-all hover:bg-primary/5 ${
          saved ? "bg-primary/5" : ""
        }`}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={saved ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {saved ? "bookmark_added" : "bookmark"}
        </span>
        <span>{saved ? "Guardado" : "Guardar para después"}</span>
      </button>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function VacanteDetallePage() {
  const router = useRouter();
  const [applyState, setApplyState] = useState<ApplyState>("idle");
  const [saved, setSaved] = useState(false);

  // circumference × (1 − 0.88) ≈ 13.6
  const ringOffset = RING_C * (1 - JOB.matchScore / 100);

  const handleApply = async () => {
    if (applyState !== "idle") return;
    setApplyState("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setApplyState("success");
  };

  return (
    <>
      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200"
            aria-label="Volver"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>

          <h1 className="text-headline-md font-bold text-primary">TalentoYa</h1>

          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200"
            aria-label="Compartir vacante"
          >
            <span className="material-symbols-outlined text-on-surface">share</span>
          </button>
        </div>
      </header>

      {/* ── Contenido ─────────────────────────────────────────────────────── */}
      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-[160px] lg:pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg max-w-5xl mx-auto">

          {/* ── Columna izquierda: info principal ─────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-lg">

            {/* Hero: logo + título + empresa */}
            <section className="flex items-start gap-md">
              <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center p-base border border-outline-variant/30 overflow-hidden flex-shrink-0">
                <Image
                  src={JOB.companyLogo}
                  alt={`Logo ${JOB.company}`}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
                  {JOB.title}
                </h2>
                <p className="text-body-md text-on-surface-variant mt-xs">{JOB.company}</p>
              </div>
            </section>

            {/* Match badge — mobile only (en desktop va en col derecha) */}
            <section
              className="lg:hidden matching-gradient rounded-xl p-md flex items-center justify-between text-white shadow-md"
              aria-label={`${JOB.matchScore}% de compatibilidad`}
            >
              <MatchBadgeContent matchScore={JOB.matchScore} ringOffset={ringOffset} ringC={RING_C} />
            </section>

            {/* Chips de información rápida */}
            <section className="grid grid-cols-2 gap-sm">
              {JOB.infoChips.map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white p-md rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/20 flex items-center gap-sm"
                >
                  <span className="material-symbols-outlined text-primary flex-shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-label-sm text-on-surface-variant">{label}</p>
                    <p className="text-label-md truncate">{value}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Descripción del cargo */}
            <section className="space-y-sm">
              <h3 className="text-label-md text-on-surface">Descripción del cargo</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {JOB.description}
              </p>
            </section>

            {/* Requisitos técnicos */}
            <section className="space-y-sm">
              <h3 className="text-label-md text-on-surface">Requisitos técnicos</h3>
              <div className="flex flex-wrap gap-sm">
                {JOB.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-surface-container-high px-md py-xs rounded-full text-label-sm text-on-surface-variant border border-outline-variant/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* ── Columna derecha: match + IA + beneficios + acción ─────── */}
          <div className="flex flex-col gap-lg">

            {/* Match badge — desktop only */}
            <section
              className="hidden lg:flex matching-gradient rounded-xl p-md items-center justify-between text-white shadow-md"
              aria-label={`${JOB.matchScore}% de compatibilidad`}
            >
              <MatchBadgeContent matchScore={JOB.matchScore} ringOffset={ringOffset} ringC={RING_C} />
            </section>

            {/* Recomendaciones IA */}
            <section className="bg-primary-container/10 border border-primary-container/20 rounded-xl p-md space-y-sm">
              <div className="flex items-center gap-sm text-primary">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <h3 className="text-label-md">¿Por qué te recomendamos esta vacante?</h3>
              </div>
              <ul className="space-y-sm">
                {JOB.aiReasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-xs">
                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 flex-shrink-0">
                      check_circle
                    </span>
                    <p className="text-body-sm text-on-surface">{reason}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Beneficios */}
            <section className="space-y-sm">
              <h3 className="text-label-md text-on-surface">Beneficios</h3>
              <div className="space-y-sm">
                {JOB.benefits.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <span className="text-body-md text-on-surface">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Panel de acción — solo en desktop */}
            <div className="hidden lg:block bg-white p-lg rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
              <ApplyButtons
                applyState={applyState}
                saved={saved}
                onApply={handleApply}
                onToggleSave={() => setSaved((s) => !s)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Barra de acción fija — solo en móvil/tablet ───────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-surface shadow-[0px_-4px_20px_rgba(15,76,129,0.08)] px-margin-mobile py-md z-50">
        <ApplyButtons
          applyState={applyState}
          saved={saved}
          onApply={handleApply}
          onToggleSave={() => setSaved((s) => !s)}
        />
      </div>

      {/* ── WhatsApp FAB ──────────────────────────────────────────────────── */}
      <button
        className="fixed bottom-36 lg:bottom-8 right-4 z-40 w-14 h-14 bg-whatsapp-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"
        aria-label="Soporte por WhatsApp"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat
        </span>
      </button>
    </>
  );
}

// ── Contenido del badge de match (compartido entre mobile y desktop) ──────────
function MatchBadgeContent({
  matchScore,
  ringOffset,
  ringC,
}: {
  matchScore: number;
  ringOffset: number;
  ringC: number;
}) {
  return (
    <>
      <div className="flex items-center gap-sm">
        <span
          className="material-symbols-outlined text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bolt
        </span>
        <div>
          <p className="text-label-sm opacity-90">Potencial de éxito</p>
          <p className="text-headline-md font-bold">{matchScore}% de Match</p>
        </div>
      </div>

      {/* Mini ring */}
      <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center relative flex-shrink-0">
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle
            cx="24" cy="24" r={RING_R}
            fill="transparent"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="4"
            strokeDasharray={ringC}
            strokeDashoffset={ringOffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xs font-bold">{matchScore}%</span>
      </div>
    </>
  );
}
