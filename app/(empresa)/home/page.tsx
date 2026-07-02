import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/app/_components/TopAppBar";

// ── Avatars ───────────────────────────────────────────────────────────────────
const AVATAR_EMPRESA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCyDsYKpQpMxa_RWo9cmJ2oylOZ8EHhoj-0cC7dtB3IrZAc8NuWjtsaeqp6IGpzkg2_gbp_2QJoYWYKmts2MglWcgoLAVdBLOP-2YQsDS6HImwrergABAy5H9c4MnvB75L5RB3Kyx6Y5gq_RjHYw3LkllcueLC2t8H5We8hST9i8B7l_WTF2r1hDs-MO4QKTcE53maZS_uURnOAFg4jGoSDifnRtFDQDcV8CyTFDQufpIQ386jbJe9e3UnCoDuN0SZXsUzy9fA-ZQ";

const AVATAR_CAND_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDR0XX0nDkU_lRU1QgzADfpCySvDjpdDgZodhdKxWdLLW5EVXdtbgtpeNKyk8ovw5gbFC6fpR9HKAoKhtiS5QYr8kV7scCGYRLwrnElyYV9OQ_fjQs6NapI19vnRakDic0mNkl7aAb9kV9hXaEw5Q5yv1L2ik9v_3gmvSnCS4ue0A64ddKM6CG1jLVR3TQtaGgiAc3uzxqf0QPDOnK8ve1tp9t524HrQDQFgazAqEc8_zVRnWAxIACGMV_hZlmTtDR2RSz-yPFKDQ";

const AVATAR_CAND_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8v2YGYGxSYwTuQTMNumPFfa2PvMv-G00_WlGWpSfNM4BqTtJa57CwHwPjkRQDozO7yGFB_xBc1jDuj14lyGOR3p6TukjScYQ6_g8MK2nbV5_CT8imX5RQVGMQMns8IEZE8nCzxyDf773zy_0-vpc6-MuckKotkub80mBsWf8YoN-co7p_EnIcYpbHrNZSWn0mC0cN4VqCEHl5M5wkMN4kaHFW7YGA6DsB8UUmgUnrO2l4ahUez4SZnqWXktggbV6cGHYW6KXTSg";

// ── Datos demo — TODO: reemplazar con Firestore ──────────────────────────────
const VACANTES_RENDIMIENTO: { title: string; postulaciones: number; score: number }[] = [
  { title: "Desarrollador Frontend", postulaciones: 12, score: 88 },
  { title: "Analista de Datos",      postulaciones: 8,  score: 94 },
];

const PIPELINE: { label: string; count: number; widthPct: number; color: string }[] = [
  { label: "Nuevos",      count: 65, widthPct: 100, color: "bg-primary"       },
  { label: "Entrevistas", count: 12, widthPct: 55,  color: "bg-energy-orange" },
  { label: "Contratados", count: 3,  widthPct: 30,  color: "bg-brand-green"   },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function EmpresaHomePage() {
  return (
    <>
      <TopAppBar
        userName="Carlos G."
        userType="Empresa"
        avatarUrl={AVATAR_EMPRESA}
        hasNotification
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">

        {/* ── Encabezado de página ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Panel de Reclutamiento
            </h1>
            <p className="text-body-md text-on-surface-variant mt-xs">
              Inversiones Antioquia S.A.S
            </p>
          </div>
          <Link
            href="/vacantes/nueva"
            className="inline-flex items-center justify-center gap-sm bg-energy-orange text-white py-sm px-lg rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all text-label-md font-bold sm:flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva vacante
          </Link>
        </div>

        {/* ── Grid principal ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

          {/* ── Columna izquierda (2/3) ───────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-lg">

            {/* ── Banner de impacto IA ───────────────────────────────── */}
            <section className="bg-primary-container rounded-xl p-lg overflow-hidden relative">
              <div className="flex items-start gap-sm mb-md relative z-10">
                <span
                  className="material-symbols-outlined text-secondary-fixed text-[20px] mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <div>
                  <p className="text-label-sm text-secondary-fixed">Análisis IA</p>
                  <h2 className="text-headline-md text-white">Impacto esta semana</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md relative z-10">
                <div className="bg-white/10 rounded-xl p-md text-center">
                  <p className="text-[40px] font-bold leading-none text-secondary-fixed">12h</p>
                  <p className="text-body-sm text-white/80 mt-xs">Tiempo ahorrado</p>
                </div>
                <div className="bg-white/10 rounded-xl p-md text-center">
                  <p className="text-[40px] font-bold leading-none text-secondary-fixed">92%</p>
                  <p className="text-body-sm text-white/80 mt-xs">Match promedio</p>
                </div>
              </div>
              {/* Decoración */}
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            </section>

            {/* ── Tarjetas KPI ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-md">
              {/* Vacantes Activas */}
              <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col gap-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">work</span>
                </div>
                <p className="text-[40px] font-bold leading-none text-on-surface">5</p>
                <p className="text-body-sm text-on-surface-variant">Vacantes activas</p>
              </div>

              {/* Matches Nuevos */}
              <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex flex-col gap-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-brand-green"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <p className="text-[40px] font-bold leading-none text-on-surface">42</p>
                <p className="text-body-sm text-on-surface-variant">Matches nuevos</p>
              </div>
            </div>

            {/* ── Candidatos en proceso ──────────────────────────────── */}
            <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex items-center justify-between gap-md">
              <div>
                <p className="text-[40px] font-bold leading-none text-on-surface">18</p>
                <p className="text-body-sm text-on-surface-variant mt-xs">Candidatos en proceso</p>
              </div>
              {/* Stack de avatares */}
              <div className="flex -space-x-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <Image
                    src={AVATAR_CAND_1}
                    alt="Candidato"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                  <Image
                    src={AVATAR_CAND_2}
                    alt="Candidato"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-white">+16</span>
                </div>
              </div>
            </div>

            {/* ── Rendimiento de vacantes ────────────────────────────── */}
            <section className="bg-white rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] p-lg">
              <div className="flex items-center justify-between mb-md">
                <h2 className="text-label-md text-on-surface">Rendimiento de vacantes</h2>
                <Link href="/vacantes" className="text-primary text-label-sm hover:underline">
                  Ver todas
                </Link>
              </div>
              <div className="space-y-lg">
                {VACANTES_RENDIMIENTO.map((v) => (
                  <div key={v.title} className="space-y-sm">
                    <div className="flex items-start justify-between gap-sm flex-wrap">
                      <p className="text-body-md font-bold text-on-surface min-w-0">{v.title}</p>
                      <div className="flex items-center gap-sm flex-shrink-0">
                        <span className="text-label-sm text-on-surface-variant">
                          {v.postulaciones} postulaciones
                        </span>
                        <span className="bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {v.score}%
                        </span>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-green rounded-full"
                        style={{ width: `${v.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Columna derecha ───────────────────────────────────────── */}
          <div className="flex flex-col gap-lg">

            {/* ── Embudo de selección ───────────────────────────────── */}
            <section className="bg-white rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] p-lg">
              <div className="flex items-center justify-between mb-lg">
                <h2 className="text-label-md text-on-surface">Embudo de selección</h2>
                <Link href="/matches" className="text-primary text-label-sm hover:underline">
                  Ver pipeline
                </Link>
              </div>
              <div className="flex flex-col gap-xs">
                {PIPELINE.map((stage, i) => (
                  <div key={stage.label}>
                    <div
                      className={`${stage.color} rounded-lg px-md py-sm flex items-center justify-between text-white`}
                      style={{ width: `${stage.widthPct}%` }}
                    >
                      <span className="text-label-sm truncate mr-sm">{stage.label}</span>
                      <span className="text-label-md font-bold flex-shrink-0">{stage.count}</span>
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <div className="w-px h-3 bg-outline-variant/40 ml-4 my-xs" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Sugerencia estratégica IA ─────────────────────────── */}
            <section className="bg-[#FFF4ED] border border-[#FFDBCC] rounded-xl p-lg">
              <div className="flex items-start gap-md mb-md">
                <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-white text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lightbulb
                  </span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Sugerencia IA</p>
                  <h3 className="text-label-md text-on-surface">Acción recomendada</h3>
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Tienes{" "}
                <span className="font-bold text-on-surface">3 candidatos finalistas</span>{" "}
                para Desarrollador Frontend sin respuesta en 48 h. Contáctalos hoy para
                no perder talento calificado.
              </p>
              <Link
                href="/matches"
                className="mt-md inline-flex items-center gap-xs text-brand-orange text-label-sm font-bold hover:underline"
              >
                Ver candidatos
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </section>

            {/* ── Soporte WhatsApp (desktop) ───────────────────────── */}
            <section className="hidden lg:block bg-primary p-lg rounded-xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-body-lg font-bold mb-xs">¿Necesitas ayuda?</h4>
                <p className="text-body-sm opacity-90 mb-md">
                  Habla con nuestro equipo especializado por WhatsApp.
                </p>
                <button className="bg-whatsapp-green text-white px-lg py-sm rounded-full flex items-center gap-sm text-label-md font-bold shadow-md hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    chat
                  </span>
                  Escribir al soporte
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </section>
          </div>
        </div>
      </main>

      {/* ── WhatsApp FAB — móvil / tablet ─────────────────────────────────── */}
      <button
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 bg-whatsapp-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"
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
