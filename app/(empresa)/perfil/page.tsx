import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/app/_components/TopAppBar";

// ── Anillo de fortaleza — r=28, viewBox 64×64 ─────────────────────────────────
const RING_R = 28;
const RING_C = 2 * Math.PI * RING_R; // ≈ 175.93

// ── Datos demo — se reemplazarán con Firestore + Auth ────────────────────────
const PROFILE = {
  name: "Mateo Rivera",
  role: "Técnico Electromecánico",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwRkSmdA_d64KqxwOAkz_6KEjJJ2liFrcOY7c-eC6_wXrcUYlJCDXjoTZbnyAFCNTp2Kb2n2Z5Vlbm4x7ArAGEHGR5CVYxQJURjBRyk4k2620cX82k0vo3QCO3H9PXGywaD9hc38vro_1F9EwV_RhjXUDslrWTNGRNQcYLW_eidR774XhjZIiDnDhMisPK50scWMbhsbTF4Dxw9gJxrLrNmlWdiK1rRwz57JMwwMDEged9PfGUYB6siA_GCKBDrwqoer9jHWvdyg",
  profileStrength: 85,
  aiSuggestion:
    "Sube tu certificación de alturas para llegar al 100% y aumentar tus coincidencias en un 40%.",
  summary:
    "Técnico con 4 años de experiencia sólida en mantenimiento electromecánico industrial. Destacado por su capacidad de aprendizaje rápido y resolución de problemas bajo presión en entornos de producción continua.",
  skills: [
    "Mantenimiento Preventivo",
    "PLC",
    "Seguridad Industrial",
    "Interpretación de Planos",
  ],
  experience: [
    {
      title: "Técnico de Mantenimiento",
      company: "Industrias Metálicas S.A.",
      period: "2021 - Presente",
      highlights: [
        "Reducción del 15% en tiempos de inactividad de maquinaria.",
        "Liderazgo de equipo en paradas de planta programadas.",
      ],
      description: null as string | null,
      current: true,
    },
    {
      title: "Auxiliar de Planta",
      company: "Manufacturas del Valle",
      period: "2019 - 2021",
      highlights: null as string[] | null,
      description: "Apoyo técnico en el montaje de nuevas líneas de ensamble.",
      current: false,
    },
  ],
};

export default function PerfilPage() {
  const ringOffset = RING_C * (1 - PROFILE.profileStrength / 100); // ≈ 26.4

  return (
    <>
      <TopAppBar
        userName={PROFILE.name}
        userType="Candidato"
        avatarUrl={PROFILE.avatarUrl}
        hasNotification
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg max-w-5xl mx-auto">

          {/* ── Columna izquierda: foto + IA insights + habilidades ──── */}
          <div className="flex flex-col gap-lg">

            {/* ── Encabezado del perfil ─────────────────────────────── */}
            <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(15,76,129,0.05)] text-center relative overflow-hidden">
              {/* Badge "Perfil Optimizado" */}
              <div className="absolute top-0 right-0 p-sm">
                <div className="flex items-center gap-xs bg-secondary-container px-sm py-xs rounded-full">
                  <span
                    className="material-symbols-outlined text-[13px] text-on-secondary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-label-sm text-on-secondary-container">
                    Perfil Optimizado
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden mb-md">
                <Image
                  src={PROFILE.avatarUrl}
                  alt={`Foto de ${PROFILE.name}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              <h1 className="text-headline-md text-on-surface">{PROFILE.name}</h1>
              <p className="text-body-md text-on-surface-variant mt-xs mb-lg">
                {PROFILE.role}
              </p>

              <button className="bg-white border border-primary text-primary px-lg py-sm rounded-xl text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95 duration-200">
                Editar perfil
              </button>
            </section>

            {/* ── Análisis IA — fortaleza del perfil ───────────────── */}
            <section className="bg-primary-container p-lg rounded-xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-md gap-md">
                <div>
                  <div className="flex items-center gap-xs mb-xs">
                    <span
                      className="material-symbols-outlined text-secondary-fixed text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      auto_awesome
                    </span>
                    <span className="text-label-md text-secondary-fixed">Análisis IA</span>
                  </div>
                  <h2 className="text-headline-md text-white">Fortaleza del Perfil</h2>
                </div>

                {/* Anillo de fortaleza */}
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                  >
                    {/* Pista */}
                    <circle
                      cx="32" cy="32" r={RING_R}
                      fill="transparent"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="4"
                    />
                    {/* Progreso */}
                    <circle
                      cx="32" cy="32" r={RING_R}
                      fill="transparent"
                      stroke="#7afac3"
                      strokeWidth="4"
                      strokeDasharray={RING_C}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-label-md font-bold text-secondary-fixed">
                    {PROFILE.profileStrength}%
                  </span>
                </div>
              </div>

              {/* Sugerencia */}
              <div className="bg-white/10 p-md rounded-lg border border-white/10">
                <p className="text-body-sm text-primary-fixed mb-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                  Sugerencia:
                </p>
                <p className="text-body-md text-white">{PROFILE.aiSuggestion}</p>
              </div>
            </section>

            {/* ── Habilidades verificadas ───────────────────────────── */}
            <section className="space-y-md">
              <div className="flex items-center gap-base">
                <span className="material-symbols-outlined text-primary">bolt</span>
                <h3 className="text-headline-md text-on-surface">Habilidades Verificadas</h3>
              </div>
              <div className="flex flex-wrap gap-sm">
                {PROFILE.skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-white border border-outline-variant px-md py-xs rounded-full flex items-center gap-xs shadow-sm"
                  >
                    <span
                      className="material-symbols-outlined text-success-green text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="text-label-md text-on-surface">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Columna derecha: resumen + experiencia + CTA ─────────── */}
          <div className="lg:col-span-2 flex flex-col gap-lg">

            {/* ── Resumen profesional IA ────────────────────────────── */}
            <section className="space-y-md">
              <div className="flex items-center gap-base">
                <span className="material-symbols-outlined text-primary">article</span>
                <h3 className="text-headline-md text-on-surface">Resumen Profesional IA</h3>
              </div>
              <div className="bg-surface-container-low p-lg rounded-xl border-l-4 border-brand-green">
                <p className="text-body-md text-on-surface-variant italic leading-relaxed">
                  &ldquo;{PROFILE.summary}&rdquo;
                </p>
              </div>
            </section>

            {/* ── Experiencia laboral ───────────────────────────────── */}
            <section className="space-y-md">
              <div className="flex items-center gap-base">
                <span className="material-symbols-outlined text-primary">work</span>
                <h3 className="text-headline-md text-on-surface">Experiencia Laboral</h3>
              </div>

              <div className="space-y-md">
                {PROFILE.experience.map((job) => (
                  <div
                    key={job.title}
                    className={`bg-white p-lg rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-surface-variant transition-all ${
                      job.current
                        ? "hover:shadow-[0px_8px_30px_rgba(15,76,129,0.10)]"
                        : "opacity-80"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-sm gap-sm flex-wrap">
                      <div className="min-w-0">
                        <h4 className="text-label-md text-primary">{job.title}</h4>
                        <p className="text-body-sm text-on-surface-variant">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-xs flex-shrink-0">
                        {job.current && (
                          <span className="w-2 h-2 bg-brand-green rounded-full" />
                        )}
                        <span className="text-label-sm text-on-surface-variant">{job.period}</span>
                      </div>
                    </div>

                    {job.highlights ? (
                      <ul className="space-y-xs">
                        {job.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px] mt-1 text-primary flex-shrink-0">
                              arrow_right
                            </span>
                            <p className="text-body-sm">{h}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body-sm text-on-surface-variant">{job.description}</p>
                    )}
                  </div>
                ))}

                {/* Agregar experiencia */}
                <button className="w-full border-2 border-dashed border-outline-variant text-on-surface-variant py-md rounded-xl text-label-md flex items-center justify-center gap-xs hover:border-primary hover:text-primary hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Agregar experiencia
                </button>
              </div>
            </section>

            {/* ── CTA principal ─────────────────────────────────────── */}
            <Link
              href="/vacantes"
              className="w-full bg-brand-orange text-white py-lg rounded-xl text-headline-md font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-base"
            >
              Ver vacantes recomendadas
              <span className="material-symbols-outlined">trending_up</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ── WhatsApp FAB ──────────────────────────────────────────────────── */}
      <button
        className="fixed bottom-20 lg:bottom-8 right-4 z-40 bg-whatsapp-green text-white p-md rounded-full shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
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
