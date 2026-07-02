"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Ring del match — r=38, container 100×100 ──────────────────────────────────
const RING_R = 38;
const RING_C = 2 * Math.PI * RING_R;

// ── Datos demo ────────────────────────────────────────────────────────────────
// TODO: fetch desde Firestore usando params.id
const CANDIDATO = {
  nombre:     "Carlos Andrés García Morales",
  titulo:     "Técnico Electromecánico Senior",
  ciudad:     "Medellín, Antioquia",
  avatar:     "https://lh3.googleusercontent.com/aida-public/AB6AXuDR0XX0nDkU_lRU1QgzADfpCySvDjpdDgZodhdKxWdLLW5EVXdtbgtpeNKyk8ovw5gbFC6fpR9HKAoKhtiS5QYr8kV7scCGYRLwrnElyYV9OQ_fjQs6NapI19vnRakDic0mNkl7aAb9kV9hXaEw5Q5yv1L2ik9v_3gmvSnCS4ue0A64ddKM6CG1jLVR3TQtaGgiAc3uzxqf0QPDOnK8ve1tp9t524HrQDQFgazAqEc8_zVRnWAxIACGMV_hZlmTtDR2RSz-yPFKDQ",
  matchScore: 88,
  verificado: true,
  disponible: true,
  resumen:
    "Técnico Electromecánico con más de 7 años de experiencia en mantenimiento preventivo y correctivo de maquinaria industrial pesada. Especializado en PLC Siemens, sistemas neumáticos e hidráulicos, y gestión de plantas de producción continua. Certificado en SENA con amplia experiencia en el sector manufacturero antioqueño.",
  aiRazones: [
    "7 años de experiencia en mantenimiento industrial — coincide con el requisito senior del cargo.",
    "Certificación vigente en PLC Siemens — habilidad clave de la vacante.",
    "Ubicado a 18 min del lugar de trabajo según dirección registrada.",
    "Alta estabilidad laboral: promedio de 2.8 años por empresa.",
  ],
  experiencia: [
    {
      cargo:    "Técnico Electromecánico Senior",
      empresa:  "Grupo Nutresa",
      periodo:  "Ene 2022 – Presente",
      duracion: "2 años 5 meses",
      ciudad:   "Medellín",
      logros: [
        "Reducción del 22% en tiempos de paro no planificado mediante plan de mantenimiento predictivo.",
        "Coordinación de equipo de 4 técnicos en turno nocturno.",
        "Implementación de CMMS (SAP PM) para gestión de órdenes de trabajo.",
      ],
    },
    {
      cargo:    "Técnico de Mantenimiento",
      empresa:  "Textiles Fabricato",
      periodo:  "Mar 2019 – Dic 2021",
      duracion: "2 años 9 meses",
      ciudad:   "Bello, Ant.",
      logros: [
        "Mantenimiento de telares Dornier y sistemas neumáticos de alta presión.",
        "Certificación interna en Lectura de Planos Eléctricos e Hidráulicos.",
      ],
    },
    {
      cargo:    "Auxiliar de Mantenimiento",
      empresa:  "Industrias Haceb",
      periodo:  "Jun 2017 – Feb 2019",
      duracion: "1 año 8 meses",
      ciudad:   "Itagüí, Ant.",
      logros: [
        "Soporte en mantenimiento de líneas de producción de electrodomésticos.",
        "Capacitación en sistemas de control PLC Allen Bradley.",
      ],
    },
  ],
  educacion: [
    {
      titulo:      "Tecnología en Electromecánica Industrial",
      institucion: "Servicio Nacional de Aprendizaje — SENA",
      año:         "2016",
      tipo:        "Tecnólogo",
    },
    {
      titulo:      "Técnico en Mantenimiento de Equipos Eléctricos",
      institucion: "SENA Regional Antioquia",
      año:         "2014",
      tipo:        "Técnico",
    },
  ],
  habilidades: [
    { label: "PLC Siemens S7",         nivel: 90 },
    { label: "Neumática e Hidráulica", nivel: 85 },
    { label: "Lectura de Planos",      nivel: 88 },
    { label: "Mantenimiento RCM",      nivel: 75 },
    { label: "SAP PM",                 nivel: 70 },
    { label: "Liderazgo de Equipos",   nivel: 80 },
  ],
  idiomas: [
    { idioma: "Español", nivel: "Nativo",        pct: 100 },
    { idioma: "Inglés",  nivel: "Básico (A2)",   pct: 30  },
  ],
  certificaciones: [
    { nombre: "Programación PLC Siemens TIA Portal",  entidad: "Siemens Colombia",  año: "2023" },
    { nombre: "Seguridad Industrial y Salud en el Trabajo (50h)", entidad: "SENA", año: "2022" },
    { nombre: "Mantenimiento Centrado en Confiabilidad (RCM)",    entidad: "ICONTEC", año: "2021" },
  ],
  disponibilidad: "Inmediata",
  salarioEsperado: "$2.8M – $3.5M",
  modalidad: "Presencial / Híbrido",
  jornada: "Tiempo completo",
};

type PipelineStage = "nuevo" | "revision" | "entrevista" | "oferta" | "contratado";

const PIPELINE: { key: PipelineStage; label: string; icon: string; color: string }[] = [
  { key: "nuevo",       label: "Nuevo",        icon: "fiber_new",       color: "bg-primary"       },
  { key: "revision",    label: "En revisión",  icon: "visibility",      color: "bg-[#9C27B0]"    },
  { key: "entrevista",  label: "Entrevista",   icon: "groups",          color: "bg-energy-orange" },
  { key: "oferta",      label: "Oferta",       icon: "handshake",       color: "bg-[#2196F3]"    },
  { key: "contratado",  label: "Contratado",   icon: "how_to_reg",      color: "bg-brand-green"   },
];

// ── Score ring ────────────────────────────────────────────────────────────────
function MatchRing({ score }: { score: number }) {
  const offset = RING_C * (1 - score / 100);
  const color  = score >= 85 ? "#00A676" : score >= 70 ? "#FF6200" : "#6B7280";
  return (
    <div className="relative w-[100px] h-[100px] flex-shrink-0">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#e0e3e5" strokeWidth="8" />
        <circle cx="50" cy="50" r={RING_R} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-headline-md font-black text-on-surface leading-none">{score}</span>
        <span className="text-label-sm text-on-surface-variant">match</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function CandidatoPerfilPage() {
  const router = useRouter();
  const [stage,    setStage]    = useState<PipelineStage>("nuevo");
  const [saved,    setSaved]    = useState(false);
  const [msgOpen,  setMsgOpen]  = useState(false);
  const [msgText,  setMsgText]  = useState("");
  const [msgSent,  setMsgSent]  = useState(false);

  const handleSendMsg = () => {
    if (!msgText.trim()) return;
    setMsgSent(true);
    setTimeout(() => { setMsgOpen(false); setMsgSent(false); setMsgText(""); }, 2000);
  };

  const stageIdx = PIPELINE.findIndex(p => p.key === stage);

  const card = "bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── TopAppBar ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <div className="flex items-center gap-md">
            <button onClick={() => router.back()}
              className="p-xs -ml-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
              aria-label="Volver">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h1 className="text-headline-sm text-primary font-bold hidden sm:block">Perfil del candidato</h1>
          </div>
          <div className="flex items-center gap-sm">
            <button onClick={() => setSaved(p => !p)}
              className="p-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
              aria-label={saved ? "Quitar de guardados" : "Guardar candidato"}>
              <span className="material-symbols-outlined text-on-surface-variant"
                style={saved ? { fontVariationSettings: "'FILL' 1", color: "#FF6200" } : undefined}>
                bookmark
              </span>
            </button>
            <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
              aria-label="Compartir">
              <span className="material-symbols-outlined text-on-surface-variant">share</span>
            </button>
            <button className="p-xs rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
              aria-label="Más opciones">
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mt-16 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-xl pb-28 lg:pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* ── Columna principal ────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-gutter">

            {/* ── Hero del candidato ─────────────────────────────────────── */}
            <div className={card}>
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-primary to-primary/60 rounded-t-2xl" />

              <div className="px-xl pb-xl -mt-12">
                <div className="flex flex-col sm:flex-row sm:items-end gap-lg mb-xl">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-surface-container">
                      <Image src={CANDIDATO.avatar} alt={CANDIDATO.nombre}
                        width={96} height={96} className="w-full h-full object-cover" />
                    </div>
                    {CANDIDATO.verificado && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-green rounded-full flex items-center justify-center border-2 border-white">
                        <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                    )}
                  </div>

                  {/* Nombre + chips */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-sm mb-xs">
                      <h2 className="text-headline-md text-on-surface font-bold">{CANDIDATO.nombre}</h2>
                      {CANDIDATO.verificado && (
                        <span className="flex items-center gap-xs px-sm py-[2px] bg-brand-green/10 text-brand-green rounded-full text-label-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-body-md text-on-surface-variant">{CANDIDATO.titulo}</p>
                    <div className="flex flex-wrap gap-md mt-sm">
                      <span className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {CANDIDATO.ciudad}
                      </span>
                      <span className={`flex items-center gap-xs text-body-sm font-semibold ${CANDIDATO.disponible ? "text-brand-green" : "text-on-surface-variant"}`}>
                        <span className={`w-2 h-2 rounded-full ${CANDIDATO.disponible ? "bg-brand-green" : "bg-outline-variant"}`} />
                        {CANDIDATO.disponible ? "Disponible ahora" : "No disponible"}
                      </span>
                    </div>
                  </div>

                  {/* Match ring */}
                  <MatchRing score={CANDIDATO.matchScore} />
                </div>

                {/* Resumen */}
                <p className="text-body-md text-on-surface-variant leading-relaxed">{CANDIDATO.resumen}</p>
              </div>
            </div>

            {/* ── Razones del match IA ───────────────────────────────────── */}
            <div className={`${card} p-xl`}>
              <div className="flex items-center gap-md mb-lg">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div>
                  <h3 className="text-headline-sm text-on-surface font-bold">¿Por qué es un buen match?</h3>
                  <p className="text-body-sm text-on-surface-variant">Análisis de IA · Score {CANDIDATO.matchScore}%</p>
                </div>
              </div>
              <div className="space-y-sm">
                {CANDIDATO.aiRazones.map((r, i) => (
                  <div key={i} className="flex items-start gap-md p-md bg-primary/5 border border-primary/10 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-[1px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <p className="text-body-sm text-on-surface-variant">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Experiencia laboral ────────────────────────────────────── */}
            <div className={`${card} p-xl`}>
              <h3 className="text-headline-sm text-on-surface font-bold mb-xl flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">work</span>
                Experiencia laboral
              </h3>
              <div className="relative">
                {/* Línea de tiempo */}
                <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-outline-variant/40" />
                <div className="space-y-xl">
                  {CANDIDATO.experiencia.map((e, i) => (
                    <div key={i} className="flex gap-lg">
                      {/* Dot */}
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center z-10 ${
                        i === 0 ? "border-primary bg-primary" : "border-outline-variant bg-white"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-outline-variant"}`} />
                      </div>
                      <div className="flex-1 pb-xl border-b border-outline-variant/20 last:border-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-xs mb-sm">
                          <div>
                            <p className="text-label-md text-on-surface font-bold">{e.cargo}</p>
                            <p className="text-body-sm text-primary font-semibold">{e.empresa}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-label-sm text-on-surface-variant">{e.periodo}</p>
                            <p className="text-label-sm text-on-surface-variant">{e.duracion} · {e.ciudad}</p>
                          </div>
                        </div>
                        <ul className="space-y-xs">
                          {e.logros.map((l, j) => (
                            <li key={j} className="flex items-start gap-sm text-body-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px] text-outline-variant mt-[2px] flex-shrink-0">arrow_right</span>
                              {l}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Educación ─────────────────────────────────────────────── */}
            <div className={`${card} p-xl`}>
              <h3 className="text-headline-sm text-on-surface font-bold mb-xl flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">school</span>
                Educación
              </h3>
              <div className="space-y-lg">
                {CANDIDATO.educacion.map((ed, i) => (
                  <div key={i} className="flex gap-md">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">school</span>
                    </div>
                    <div>
                      <p className="text-label-md text-on-surface font-bold">{ed.titulo}</p>
                      <p className="text-body-sm text-primary">{ed.institucion}</p>
                      <div className="flex items-center gap-sm mt-xs">
                        <span className="px-sm py-[2px] bg-surface-container-high text-on-surface-variant rounded-full text-label-sm">{ed.tipo}</span>
                        <span className="text-label-sm text-on-surface-variant">{ed.año}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Habilidades ───────────────────────────────────────────── */}
            <div className={`${card} p-xl`}>
              <h3 className="text-headline-sm text-on-surface font-bold mb-xl flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">build</span>
                Habilidades
              </h3>
              <div className="space-y-md">
                {CANDIDATO.habilidades.map((h) => (
                  <div key={h.label} className="flex items-center gap-md">
                    <span className="text-label-md text-on-surface w-44 flex-shrink-0">{h.label}</span>
                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${h.nivel}%` }} />
                    </div>
                    <span className="text-label-sm text-on-surface-variant w-8 text-right flex-shrink-0">{h.nivel}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Idiomas + Certificaciones ─────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
              {/* Idiomas */}
              <div className={`${card} p-xl`}>
                <h3 className="text-headline-sm text-on-surface font-bold mb-lg flex items-center gap-md">
                  <span className="material-symbols-outlined text-primary">language</span>
                  Idiomas
                </h3>
                <div className="space-y-md">
                  {CANDIDATO.idiomas.map((id) => (
                    <div key={id.idioma}>
                      <div className="flex items-center justify-between mb-xs">
                        <p className="text-label-md text-on-surface">{id.idioma}</p>
                        <p className="text-body-sm text-on-surface-variant">{id.nivel}</p>
                      </div>
                      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${id.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificaciones */}
              <div className={`${card} p-xl`}>
                <h3 className="text-headline-sm text-on-surface font-bold mb-lg flex items-center gap-md">
                  <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  Certificaciones
                </h3>
                <div className="space-y-md">
                  {CANDIDATO.certificaciones.map((c, i) => (
                    <div key={i} className="flex items-start gap-sm">
                      <span className="material-symbols-outlined text-energy-orange text-[18px] flex-shrink-0 mt-[1px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      <div>
                        <p className="text-label-md text-on-surface leading-snug">{c.nombre}</p>
                        <p className="text-body-sm text-on-surface-variant">{c.entidad} · {c.año}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-gutter">
            <div className="lg:sticky lg:top-20 space-y-gutter">

              {/* ── Panel de acción ─────────────────────────────────────── */}
              <div className={`${card} p-xl`}>
                {/* Disponibilidad */}
                <div className="space-y-sm mb-xl">
                  {[
                    { icon: "event_available",  label: "Disponibilidad",  value: CANDIDATO.disponibilidad },
                    { icon: "payments",         label: "Aspiración salarial", value: CANDIDATO.salarioEsperado },
                    { icon: "apartment",        label: "Modalidad",       value: CANDIDATO.modalidad    },
                    { icon: "schedule",         label: "Jornada",         value: CANDIDATO.jornada      },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-md py-sm border-b border-outline-variant/20 last:border-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-sm text-on-surface-variant">{label}</p>
                        <p className="text-label-md text-on-surface font-semibold">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="space-y-sm">
                  <button
                    onClick={() => setMsgOpen(true)}
                    className="w-full py-md bg-energy-orange text-white rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    Enviar mensaje
                  </button>
                  <div className="grid grid-cols-2 gap-sm">
                    <button
                      onClick={() => setSaved(p => !p)}
                      className={`py-md border-2 rounded-xl text-label-md font-bold transition-all active:scale-95 flex items-center justify-center gap-xs ${
                        saved
                          ? "border-energy-orange bg-energy-orange/5 text-energy-orange"
                          : "border-outline-variant text-on-surface-variant hover:border-energy-orange hover:text-energy-orange"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]"
                        style={saved ? { fontVariationSettings: "'FILL' 1" } : undefined}>bookmark</span>
                      {saved ? "Guardado" : "Guardar"}
                    </button>
                    <button
                      className="py-md border-2 border-outline-variant text-on-surface-variant rounded-xl text-label-md font-bold hover:border-primary hover:text-primary transition-all active:scale-95 flex items-center justify-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">description</span>
                      Ver CV
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Pipeline de selección ────────────────────────────────── */}
              <div className={`${card} p-xl`}>
                <h3 className="text-label-md text-on-surface mb-lg flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                  Etapa en el proceso
                </h3>

                {/* Barra de progreso */}
                <div className="flex items-center gap-xs mb-lg">
                  {PIPELINE.map((p, i) => (
                    <div key={p.key} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i <= stageIdx ? p.color : "bg-outline-variant/30"
                    }`} />
                  ))}
                </div>

                <div className="space-y-xs">
                  {PIPELINE.map((p, i) => (
                    <button
                      key={p.key}
                      onClick={() => setStage(p.key)}
                      className={`w-full flex items-center gap-md p-md rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                        stage === p.key
                          ? `border-transparent ${p.color}/10 ring-2 ring-offset-0`
                          : "border-outline-variant/30 hover:border-outline"
                      }`}
                      style={stage === p.key ? undefined : undefined}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        i <= stageIdx ? p.color : "bg-surface-container-high"
                      }`}>
                        <span className={`material-symbols-outlined text-[16px] ${i <= stageIdx ? "text-white" : "text-on-surface-variant"}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                      </div>
                      <span className={`text-label-md flex-1 ${stage === p.key ? "text-on-surface font-bold" : "text-on-surface-variant"}`}>
                        {p.label}
                      </span>
                      {stage === p.key && (
                        <span className="material-symbols-outlined text-primary text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Nota interna ─────────────────────────────────────────── */}
              <div className={`${card} p-xl`}>
                <h3 className="text-label-md text-on-surface mb-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">sticky_note_2</span>
                  Nota interna
                </h3>
                <textarea
                  placeholder="Agrega notas sobre este candidato (solo visible para tu equipo)..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md text-body-sm text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={3}
                />
                <button className="mt-sm text-label-sm text-primary hover:underline">Guardar nota</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Bottom action bar — solo mobile ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-outline-variant px-margin-mobile py-md flex gap-sm lg:hidden shadow-lg">
        <button
          onClick={() => setSaved(p => !p)}
          className={`p-md border-2 rounded-xl transition-all ${
            saved ? "border-energy-orange text-energy-orange" : "border-outline-variant text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]"
            style={saved ? { fontVariationSettings: "'FILL' 1" } : undefined}>bookmark</span>
        </button>
        <button
          onClick={() => setMsgOpen(true)}
          className="flex-1 py-md bg-energy-orange text-white rounded-xl text-label-md font-bold flex items-center justify-center gap-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          Enviar mensaje
        </button>
      </div>

      {/* ── Modal enviar mensaje ──────────────────────────────────────────── */}
      {msgOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMsgOpen(false)} />
          <div className="relative bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl p-xl w-full sm:max-w-md mx-margin-mobile z-10">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-headline-sm text-on-surface font-bold">Mensaje a {CANDIDATO.nombre.split(" ")[0]}</h3>
              <button onClick={() => setMsgOpen(false)} className="p-xs rounded-full hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {msgSent ? (
              <div className="flex flex-col items-center py-xl gap-md">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-brand-green text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <p className="text-label-md text-on-surface font-bold">¡Mensaje enviado!</p>
                <p className="text-body-sm text-on-surface-variant text-center">
                  {CANDIDATO.nombre.split(" ")[0]} recibirá tu mensaje en su bandeja.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-md mb-lg p-md bg-surface-container-low rounded-xl">
                  <Image src={CANDIDATO.avatar} alt="" width={40} height={40}
                    className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-label-md text-on-surface">{CANDIDATO.nombre}</p>
                    <p className="text-body-sm text-on-surface-variant">{CANDIDATO.titulo}</p>
                  </div>
                </div>
                <textarea
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-md text-body-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline mb-lg"
                  rows={4}
                  placeholder={`Hola ${CANDIDATO.nombre.split(" ")[0]}, vi tu perfil y me gustaría...`}
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                />
                <button
                  onClick={handleSendMsg}
                  disabled={!msgText.trim()}
                  className="w-full py-md bg-energy-orange text-white rounded-xl text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  Enviar mensaje
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
