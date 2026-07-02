import Link from "next/link";
import TopAppBar from "@/app/_components/TopAppBar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwRkSmdA_d64KqxwOAkz_6KEjJJ2liFrcOY7c-eC6_wXrcUYlJCDXjoTZbnyAFCNTp2Kb2n2Z5Vlbm4x7ArAGEHGR5CVYxQJURjBRyk4k2620cX82k0vo3QCO3H9PXGywaD9hc38vro_1F9EwV_RhjXUDslrWTNGRNQcYLW_eidR774XhjZIiDnDhMisPK50scWMbhsbTF4Dxw9gJxrLrNmlWdiK1rRwz57JMwwMDEged9PfGUYB6siA_GCKBDrwqoer9jHWvdyg";

const ACTIONS = [
  { href: "/cv/editar", icon: "edit_note", label: "Editar CV", main: true },
  { href: "/cv/preview", icon: "visibility", label: "Ver previa" },
  { href: "/cv/preview?download=pdf", icon: "download", label: "Descargar PDF" },
  { href: "/cv/compartir", icon: "share", label: "Compartir" },
];

const SECTIONS = [
  {
    icon: "work",
    title: "Experiencia laboral",
    text: "Tu última posición está incompleta.",
    state: "pending",
  },
  {
    icon: "verified",
    title: "Certificaciones",
    text: "Añade tus diplomas y certificados recientes.",
    state: "pending",
  },
  {
    icon: "school",
    title: "Educación",
    text: "Sección completa y validada.",
    state: "done",
  },
  {
    icon: "translate",
    title: "Idiomas",
    text: "Agrega tu nivel de inglés u otros idiomas.",
    state: "pending",
  },
];

const JOBS = [
  { initials: "TC", title: "Desarrollador Frontend", company: "TechCorp Colombia", score: 95 },
  { initials: "DA", title: "Analista de Datos", company: "DataAvanzada S.A.S", score: 88 },
  { initials: "GL", title: "Gerente de Proyectos", company: "Gestión Local", score: 82 },
];

const STATS = [
  { icon: "visibility", label: "Vistas del CV", value: "124" },
  { icon: "download", label: "Descargas", value: "18" },
  { icon: "bolt", label: "Matches activos", value: "9" },
];

const card =
  "bg-white rounded-2xl border border-outline-variant shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

export default function CvDashboardPage() {
  return (
    <>
      <TopAppBar
        userName="Mateo Rivera"
        userType="Candidato"
        avatarUrl={AVATAR}
        hasNotification
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">
        <section className="mb-xl flex flex-col lg:flex-row lg:items-end lg:justify-between gap-lg">
          <div>
            <p className="text-secondary text-label-md uppercase tracking-wider">
              Dashboard del candidato
            </p>
            <h1 className="mt-xs text-headline-lg-mobile md:text-display-lg text-primary">
              Mi CV
            </h1>
            <p className="mt-xs text-body-md text-on-surface-variant max-w-2xl">
              Mantén tu hoja de vida actualizada, lista para aplicar y descargar en PDF.
            </p>
          </div>

          <div className={`${card} p-lg w-full lg:max-w-md`}>
            <div className="flex items-center justify-between gap-md mb-sm">
              <span className="text-label-md text-on-surface-variant">
                Progreso del perfil
              </span>
              <span className="text-headline-md text-primary">70%</span>
            </div>
            <div className="h-3 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full w-[70%] rounded-full bg-secondary" />
            </div>
            <p className="mt-sm text-body-sm text-on-surface-variant">
              Casi listo. Completa las secciones pendientes para destacar ante reclutadores.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
          <aside className="xl:col-span-4 flex flex-col gap-lg">
            <section className="grid grid-cols-2 gap-sm">
              {ACTIONS.map(({ href, icon, label, main }) => (
                <Link
                  key={label}
                  href={href}
                  className={`min-h-[112px] flex flex-col items-center justify-center text-center gap-xs p-md rounded-2xl border active:scale-[0.98] transition-all ${
                    main
                      ? "bg-primary text-white border-primary shadow-[0px_12px_30px_rgba(0,53,95,0.22)]"
                      : "bg-white text-primary border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={main ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  <span className="text-label-md">{label}</span>
                </Link>
              ))}
            </section>

            <section className="relative min-h-[280px] rounded-2xl overflow-hidden border border-outline-variant shadow-[0px_4px_20px_rgba(15,76,129,0.05)] bg-primary">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-45"
                style={{ backgroundImage: "url('/images/talentoya-hero-realista.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/65 to-transparent" />
              <div className="relative z-10 h-full min-h-[280px] flex flex-col justify-end p-lg text-white">
                <span className="material-symbols-outlined text-secondary-fixed text-[34px] mb-sm">
                  tips_and_updates
                </span>
                <h2 className="text-headline-md mb-xs">Tip de oro</h2>
                <p className="text-body-sm text-white/90">
                  Los CV con certificaciones verificadas reciben hasta 3 veces más vistas
                  por reclutadores en Colombia.
                </p>
              </div>
            </section>
          </aside>

          <section className="xl:col-span-8 flex flex-col gap-lg">
            <div className={`${card} p-lg`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm mb-lg">
                <div>
                  <h2 className="text-headline-md text-primary">Estado de secciones</h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Revisa qué falta antes de exportar tu CV.
                  </p>
                </div>
                <span className="w-fit bg-secondary-container text-on-secondary-container text-label-sm px-sm py-xs rounded-full">
                  Actualizado hoy
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {SECTIONS.map(({ icon, title, text, state }) => {
                  const done = state === "done";
                  return (
                    <article
                      key={title}
                      className={`flex items-start gap-md p-md rounded-2xl border ${
                        done
                          ? "bg-secondary-container/20 border-secondary/20"
                          : "bg-error-container/25 border-error/20"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          done ? "bg-secondary-container text-secondary" : "bg-error-container text-error"
                        }`}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={done ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          {done ? "check_circle" : icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-label-md text-on-surface">{title}</h3>
                        <p className="text-body-sm text-on-surface-variant">{text}</p>
                      </div>
                      {!done && (
                        <Link
                          href="/cv/editar"
                          className="hidden sm:inline-flex items-center justify-center bg-error text-white text-label-sm px-sm py-xs rounded-lg hover:brightness-110"
                        >
                          Completar
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            <div className={`${card} p-lg flex flex-col md:flex-row md:items-center justify-between gap-lg bg-surface-container-lowest`}>
              <div>
                <h2 className="text-headline-md text-primary">Plantillas profesionales</h2>
                <p className="text-body-sm text-on-surface-variant mt-xs">
                  Cambia el estilo de tu CV con diseños optimizados para vacantes
                  operativas, técnicas y administrativas.
                </p>
              </div>
              <Link
                href="/cv/plantillas"
                className="inline-flex items-center justify-center gap-xs bg-primary text-white text-label-md px-lg py-sm rounded-xl hover:brightness-110 active:scale-[0.98] whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                Ver plantillas
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              {STATS.map(({ icon, label, value }) => (
                <article key={label} className={`${card} p-md flex items-center gap-md`}>
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant">{label}</p>
                    <p className="text-headline-md text-primary">{value}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-sm mb-md">
            <div>
              <h2 className="text-headline-md text-primary">Oportunidades sugeridas</h2>
              <p className="text-body-sm text-on-surface-variant">
                Recomendaciones basadas en tu perfil actual.
              </p>
            </div>
            <Link href="/matches" className="text-primary text-label-md hover:underline">
              Ver todos los matches
            </Link>
          </div>

          <div className="flex gap-md overflow-x-auto hide-scrollbar pb-md">
            {JOBS.map(({ initials, title, company, score }) => (
              <article
                key={title}
                className={`${card} p-md min-w-[280px] sm:min-w-0 sm:flex-1 hover:border-primary transition-colors`}
              >
                <div className="flex items-start justify-between gap-md mb-sm">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary text-label-md">
                    {initials}
                  </div>
                  <span className="text-secondary text-label-sm">Match {score}%</span>
                </div>
                <h3 className="text-label-md text-primary">{title}</h3>
                <p className="text-body-sm text-on-surface-variant mb-md">{company}</p>
                <Link
                  href="/vacantes"
                  className="w-full inline-flex items-center justify-center bg-secondary text-white text-label-md py-xs rounded-lg hover:brightness-110"
                >
                  Postular ahora
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
