"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// ── SVG ring constants ────────────────────────────────────────────────────────
const RING_RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 314.159

// ── Datos demo ────────────────────────────────────────────────────────────────
// TODO: reemplazar con Firestore fetch usando params.id
const CANDIDATE = {
  name: "Carlos G.",
  role: "Operario de Producción Senior",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDR0XX0nDkU_lRU1QgzADfpCySvDjpdDgZodhdKxWdLLW5EVXdtbgtpeNKyk8ovw5gbFC6fpR9HKAoKhtiS5QYr8kV7scCGYRLwrnElyYV9OQ_fjQs6NapI19vnRakDic0mNkl7aAb9kV9hXaEw5Q5yv1L2ik9v_3gmvSnCS4ue0A64ddKM6CG1jLVR3TQtaGgiAc3uzxqf0QPDOnK8ve1tp9t524HrQDQFgazAqEc8_zVRnWAxIACGMV_hZlmTtDR2RSz-yPFKDQ",
  verified: true,
  matchScore: 95,
  aiReasons: [
    "10+ años de experiencia en el sector industrial.",
    "Ubicado en Bogotá — cerca de la planta.",
    "Certificación vigente en Seguridad Industrial.",
    "Alta estabilidad laboral en empleos anteriores.",
  ],
  skills: [
    { label: "Maquinaria Pesada", icon: "settings"        },
    { label: "Liderazgo",         icon: "groups"          },
    { label: "Control de Calidad",icon: "fact_check"      },
    { label: "SST",               icon: "health_and_safety" },
  ],
  avgTenure: "2.5 años",
  distance: "15 min",
};

export default function MatchDetallePage() {
  const router = useRouter();
  const strokeDashoffset = CIRCUMFERENCE * (1 - CANDIDATE.matchScore / 100);

  return (
    <>
      {/* ── TopAppBar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <div className="flex items-center gap-md">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200"
              aria-label="Volver"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h1 className="text-headline-lg-mobile text-primary font-bold">Detalle del candidato</h1>
          </div>
          <button
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200"
            aria-label="Más opciones"
          >
            <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
          </button>
        </div>
      </header>

      {/* ── Contenido principal ─────────────────────────────────────────────── */}
      <main className="pt-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pb-[160px] lg:pb-xl">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg pt-lg">

            {/* ── Columna izquierda ─────────────────────────────────────── */}
            <div className="flex flex-col gap-lg">

              {/* Perfil + score */}
              <section className="bg-surface p-xl rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Avatar */}
                  <div className="relative mb-md">
                    <Image
                      src={CANDIDATE.avatarUrl}
                      alt={CANDIDATE.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full border-4 border-surface shadow-md object-cover"
                    />
                    {CANDIDATE.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-brand-green p-1 rounded-full border-2 border-surface flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-white text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-headline-md text-primary mb-xs">{CANDIDATE.name}</h2>
                  <p className="text-body-md text-on-surface-variant mb-lg">{CANDIDATE.role}</p>

                  {/* Anillo de score */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
                      <circle cx="56" cy="56" r={RING_RADIUS} fill="transparent"
                        stroke="currentColor" strokeWidth="8" className="text-outline-variant/20" />
                      <circle cx="56" cy="56" r={RING_RADIUS} fill="transparent"
                        stroke="currentColor" strokeWidth="8"
                        strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round" className="text-brand-green transition-all duration-700" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-display-lg text-brand-green font-bold leading-none">
                        {CANDIDATE.matchScore}%
                      </span>
                      <span className="text-label-sm text-on-surface-variant">Match</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Análisis de IA */}
              <section className="bg-primary-container/10 p-lg rounded-xl border border-primary-container/20">
                <div className="flex items-center gap-base mb-md">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <h3 className="text-body-lg text-primary font-bold">¿Por qué es el candidato ideal?</h3>
                </div>
                <ul className="flex flex-col gap-sm">
                  {CANDIDATE.aiReasons.map((reason) => (
                    <li key={reason} className="flex gap-sm items-start">
                      <span className="material-symbols-outlined text-brand-green mt-0.5 text-[20px] flex-shrink-0">
                        check_circle
                      </span>
                      <p className="text-body-md text-on-surface">{reason}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* ── Columna derecha ───────────────────────────────────────── */}
            <div className="flex flex-col gap-lg">

              {/* Habilidades */}
              <section className="bg-surface p-lg rounded-xl border border-outline-variant/30">
                <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-md">
                  Habilidades clave
                </h3>
                <div className="flex flex-wrap gap-sm">
                  {CANDIDATE.skills.map(({ label, icon }) => (
                    <span
                      key={label}
                      className="px-sm py-1.5 bg-surface-container-high text-primary rounded-lg text-body-sm flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                      {label}
                    </span>
                  ))}
                </div>
              </section>

              {/* Estadísticas */}
              <section className="grid grid-cols-2 gap-md">
                <div className="bg-surface p-md rounded-xl border border-outline-variant/30 flex flex-col items-center text-center gap-xs">
                  <span className="material-symbols-outlined text-on-surface-variant mb-xs">update</span>
                  <span className="text-body-md text-on-surface font-bold">{CANDIDATE.avgTenure}</span>
                  <span className="text-label-sm text-on-surface-variant">Permanencia promedio</span>
                </div>
                <div className="bg-surface p-md rounded-xl border border-outline-variant/30 flex flex-col items-center text-center gap-xs">
                  <span className="material-symbols-outlined text-on-surface-variant mb-xs">pin_drop</span>
                  <span className="text-body-md text-on-surface font-bold">{CANDIDATE.distance}</span>
                  <span className="text-label-sm text-on-surface-variant">Distancia estimada</span>
                </div>
              </section>

              {/* Acciones — visibles en desktop como panel, en móvil como FAB */}
              <section className="hidden lg:flex flex-col gap-sm bg-white p-lg rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
                <button className="w-full bg-brand-orange text-white py-md rounded-xl text-label-md flex items-center justify-center gap-base active:scale-95 transition-transform shadow-md hover:brightness-110">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chat
                  </span>
                  Contactar por WhatsApp
                </button>
                <button className="w-full border border-primary text-primary py-sm rounded-xl text-label-md flex items-center justify-center gap-base hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined">description</span>
                  Ver hoja de vida
                </button>
                <button className="text-error text-body-sm hover:underline transition-opacity text-center pt-xs">
                  Descartar candidato
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* ── FAB de acciones — solo en móvil/tablet ─────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-surface shadow-[0px_-8px_30px_rgba(15,76,129,0.08)] px-margin-mobile py-lg z-50 flex flex-col gap-md">
        <div className="flex gap-md">
          <button className="flex-1 bg-brand-orange text-white py-md rounded-xl text-label-md flex items-center justify-center gap-base active:scale-95 transition-transform shadow-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              chat
            </span>
            Contactar por WhatsApp
          </button>
          <button
            className="w-14 h-14 border-2 border-primary text-primary rounded-xl flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Ver hoja de vida"
          >
            <span className="material-symbols-outlined">description</span>
          </button>
        </div>
        <div className="flex justify-center">
          <button className="text-error text-body-md hover:underline active:opacity-70 transition-opacity">
            Descartar candidato
          </button>
        </div>
      </div>

      {/* ── Decoración de fondo ─────────────────────────────────────────────── */}
      <div className="fixed top-0 right-0 -z-10 w-full h-screen opacity-40 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-3xl" />
      </div>
    </>
  );
}
