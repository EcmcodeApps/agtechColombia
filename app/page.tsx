"use client";

import Link from "next/link";
import { useState } from "react";

// ── Datos demo ────────────────────────────────────────────────────────────────
const CATEGORIAS = [
  { icon: "laptop_mac",      label: "Tecnología",        count: 312 },
  { icon: "store",           label: "Ventas",             count: 289 },
  { icon: "precision_manufacturing", label: "Manufactura", count: 241 },
  { icon: "local_shipping",  label: "Logística",          count: 198 },
  { icon: "restaurant",      label: "Alimentos",          count: 174 },
  { icon: "calculate",       label: "Contabilidad",       count: 156 },
  { icon: "healing",         label: "Salud",              count: 143 },
  { icon: "school",          label: "Educación",          count: 121 },
  { icon: "engineering",     label: "Ingeniería",         count: 118 },
  { icon: "support_agent",   label: "Atención al cliente",count: 109 },
];

const PASOS_CANDIDATO = [
  { icon: "person_add", color: "bg-primary/10 text-primary",    title: "Crea tu perfil",           desc: "Regístrate en 2 minutos con tu correo o LinkedIn." },
  { icon: "auto_awesome", color: "bg-secondary/10 text-secondary", title: "La IA te encuentra", desc: "Nuestro algoritmo te conecta con empresas de tu sector." },
  { icon: "handshake", color: "bg-energy-orange/10 text-energy-orange", title: "Consigue el trabajo", desc: "Agenda entrevistas directamente desde la plataforma." },
];

const PASOS_EMPRESA = [
  { icon: "post_add",    color: "bg-primary/10 text-primary",    title: "Publica tu vacante",       desc: "Describe el cargo y el perfil que necesitas en minutos." },
  { icon: "psychology",  color: "bg-secondary/10 text-secondary", title: "La IA hace el match", desc: "Recibe candidatos ordenados por compatibilidad real." },
  { icon: "event_available", color: "bg-energy-orange/10 text-energy-orange", title: "Contrata más rápido", desc: "Entrevista solo a los candidatos que ya son un match." },
];

const TESTIMONIOS = [
  {
    tipo: "empresa",
    nombre: "Laura M.",
    cargo: "Gerente RRHH — Textiles del Valle",
    texto: "Antes tardábamos 6 semanas en contratar. Con TalentoYa lo hacemos en 8 días. El match de IA es increíblemente preciso para nuestro sector.",
    score: "94%",
    icon: "business",
  },
  {
    tipo: "candidato",
    nombre: "Andrés P.",
    cargo: "Operario de producción — Medellín",
    texto: "Llevaba 3 meses buscando trabajo. Me registré un lunes y el viernes ya tenía entrevista. La empresa era exactamente lo que yo buscaba.",
    score: "89%",
    icon: "person",
  },
  {
    tipo: "empresa",
    nombre: "Camilo R.",
    cargo: "Director de Operaciones — LogiCarga SAS",
    texto: "Tenemos rotación alta en logística. TalentoYa nos da candidatos con estabilidad laboral probada. Ese filtro de IA vale oro.",
    score: "91%",
    icon: "business",
  },
];

const PLANES = [
  {
    nombre: "Gratis",
    precio: "$0",
    periodo: "siempre",
    color: "border-outline-variant",
    badge: "",
    features: ["1 vacante activa", "Hasta 10 candidatos", "Perfil de empresa básico", "Soporte por email"],
    cta: "Empezar gratis",
    ctaStyle: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  },
  {
    nombre: "Pro",
    precio: "$129.000",
    periodo: "mes",
    color: "border-primary bg-primary",
    badge: "Más popular",
    features: ["5 vacantes activas", "Candidatos ilimitados", "Match IA + Score detallado", "Filtros avanzados", "Soporte prioritario"],
    cta: "Comenzar prueba de 14 días",
    ctaStyle: "bg-energy-orange text-white hover:brightness-110 shadow-lg shadow-orange-500/20",
  },
  {
    nombre: "Empresa",
    precio: "$349.000",
    periodo: "mes",
    color: "border-outline-variant",
    badge: "",
    features: ["Vacantes ilimitadas", "API de integración", "Panel multi-usuario", "Reportes de contratación", "Gerente de cuenta dedicado"],
    cta: "Contactar ventas",
    ctaStyle: "border-2 border-outline text-on-surface hover:bg-surface-container transition-colors",
  },
];

const CIUDADES_DEST = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena"];

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between gap-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-xs flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <span className="text-headline-md font-bold text-primary">TalentoYa</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-lg">
          <a href="#como-funciona" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Cómo funciona</a>
          <a href="#categorias" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Empleos</a>
          <a href="#precios" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Precios</a>
        </nav>

        {/* CTAs — desktop */}
        <div className="hidden lg:flex items-center gap-sm">
          <Link href="/login" className="px-md py-sm text-label-md text-on-surface hover:text-primary transition-colors">
            Ingresar
          </Link>
          <Link href="/registro" className="px-lg py-sm bg-energy-orange text-white text-label-md font-bold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all">
            Registrarme gratis
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button
          className="lg:hidden p-2 -mr-2 text-on-surface-variant"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menú"
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-outline-variant/30 px-margin-mobile py-lg space-y-md">
          <a href="#como-funciona" onClick={() => setMobileOpen(false)} className="block text-body-md text-on-surface py-sm">Cómo funciona</a>
          <a href="#categorias" onClick={() => setMobileOpen(false)} className="block text-body-md text-on-surface py-sm">Empleos</a>
          <a href="#precios" onClick={() => setMobileOpen(false)} className="block text-body-md text-on-surface py-sm">Precios</a>
          <hr className="border-outline-variant" />
          <Link href="/login" className="block text-body-md text-primary py-sm font-semibold">Ingresar</Link>
          <Link href="/registro" className="block w-full text-center bg-energy-orange text-white py-md rounded-xl text-label-md font-bold">Registrarme gratis</Link>
        </div>
      )}
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Página principal
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [tab, setTab] = useState<"candidato" | "empresa">("candidato");
  const [cargo, setCargo] = useState("");
  const [ciudad, setCiudad] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="pt-[72px] overflow-hidden relative bg-[#eef4f8] min-h-[760px] md:min-h-[820px] flex flex-col">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="max-w-[1280px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-[40px] md:py-[88px] relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-xl items-center">
          <div className="w-full max-w-[650px] text-left">

            {/* Badge */}
            <span className="inline-flex items-center gap-xs bg-secondary-container text-on-secondary-container text-label-sm px-md py-xs rounded-full mb-lg shadow-sm">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Matching con Inteligencia Artificial — hecho en Colombia
            </span>

            <h1 className="text-[40px] md:text-[60px] font-bold text-primary leading-[1.08] tracking-tight mb-md">
              El talento que buscas,<br />
              <span className="text-energy-orange">a un match de distancia</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-xl max-w-[560px]">
              La primera plataforma de empleo colombiana con IA que conecta candidatos y empresas por compatibilidad real.
            </p>

            <div
              role="img"
              aria-label="TalentoYa conecta empresas colombianas con talento mediante inteligencia artificial"
              className="lg:hidden w-full h-[220px] rounded-[24px] overflow-hidden shadow-[0px_16px_50px_rgba(0,28,55,0.16)] border border-white/70 bg-white bg-cover bg-center mb-xl"
              style={{ backgroundImage: "url('/images/talentoya-hero-realista.png')" }}
            />

            {/* Tab selector */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0px_18px_60px_rgba(0,28,55,0.18)] border border-white/70 p-sm mb-lg max-w-[580px]">
              <div className="flex gap-xs mb-md">
                {(["candidato", "empresa"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-sm rounded-xl flex items-center justify-center gap-xs text-label-md transition-all duration-200 ${
                      tab === t
                        ? "bg-primary text-white shadow-md"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {t === "candidato" ? "search" : "business"}
                    </span>
                    {t === "candidato" ? "Busco empleo" : "Necesito talento"}
                  </button>
                ))}
              </div>

              {tab === "candidato" ? (
                <div className="flex flex-col sm:flex-row gap-sm">
                  <input
                    className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline"
                    placeholder="Cargo o palabra clave"
                    value={cargo}
                    onChange={e => setCargo(e.target.value)}
                  />
                  <select
                    className="sm:w-[160px] bg-surface-container-low border border-outline-variant rounded-xl h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                  >
                    <option value="">Ciudad</option>
                    {CIUDADES_DEST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Link
                    href="/registro"
                    className="sm:flex-shrink-0 bg-energy-orange text-white px-lg h-12 rounded-xl text-label-md font-bold flex items-center justify-center gap-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    Buscar
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-sm items-center">
                  <div className="flex-1 text-left">
                    <p className="text-label-md text-on-surface">La IA hace el trabajo por ti</p>
                    <p className="text-body-sm text-on-surface-variant">Publica tu vacante y recibe candidatos ordenados por compatibilidad.</p>
                  </div>
                  <Link
                    href="/registro"
                    className="sm:flex-shrink-0 bg-primary text-white px-lg h-12 rounded-xl text-label-md font-bold flex items-center justify-center gap-xs hover:brightness-110 active:scale-95 transition-all shadow-md whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Publicar vacante gratis
                  </Link>
                </div>
              )}
            </div>

            {/* Tags populares */}
            {tab === "candidato" && (
              <div className="flex flex-wrap items-center gap-xs max-w-[580px]">
                <span className="text-body-sm text-on-surface-variant">Popular:</span>
                {["Conductor", "Vendedor", "Auxiliar contable", "Desarrollador", "Operario"].map(t => (
                  <button key={t} className="px-sm py-xs bg-white border border-outline-variant rounded-full text-body-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            role="img"
            aria-label="TalentoYa conecta empresas colombianas con talento mediante inteligencia artificial"
            className="hidden lg:block relative w-full min-h-[300px] md:min-h-[440px] lg:min-h-[560px] rounded-[28px] overflow-hidden shadow-[0px_24px_70px_rgba(0,28,55,0.20)] border border-white/70 bg-white bg-cover bg-center"
            style={{ backgroundImage: "url('/images/talentoya-hero-realista.png')" }}
          >
            <div className="absolute left-md bottom-md right-md rounded-2xl bg-white/90 backdrop-blur-md border border-white/70 p-md shadow-lg">
              <div className="flex items-center gap-md">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <p className="text-label-md text-primary font-bold">TalentoYA analiza compatibilidad real</p>
                  <p className="text-body-sm text-on-surface-variant">Empresas y candidatos conectados por datos, no por azar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-outline-variant/20 bg-white/80 backdrop-blur-md">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-3 gap-md text-center">
            {[
              { value: "2.847+", label: "Candidatos activos" },
              { value: "500+",   label: "Empresas registradas" },
              { value: "92%",    label: "Precisión del match IA" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-headline-md font-bold text-primary">{value}</p>
                <p className="text-body-sm text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CÓMO FUNCIONA ═════════════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-[80px] bg-background">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-[56px]">
            <span className="text-label-sm text-secondary font-semibold uppercase tracking-widest">Proceso simple</span>
            <h2 className="text-headline-lg text-primary mt-xs">Cómo funciona TalentoYa</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px]">
            {/* Candidatos */}
            <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.06)] p-xl">
              <div className="flex items-center gap-sm mb-xl">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">person</span>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Para candidatos</p>
                  <h3 className="text-headline-md text-primary">Encuentra empleo rápido</h3>
                </div>
              </div>
              <div className="space-y-lg">
                {PASOS_CANDIDATO.map((p, i) => (
                  <div key={i} className="flex gap-md items-start">
                    <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="text-label-sm text-on-surface-variant">0{i + 1}</span>
                        <p className="text-label-md text-on-surface">{p.title}</p>
                      </div>
                      <p className="text-body-sm text-on-surface-variant">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/registro" className="mt-xl flex items-center justify-center gap-sm w-full border-2 border-primary text-primary py-md rounded-xl text-label-md font-bold hover:bg-primary hover:text-white transition-all active:scale-95">
                Crear mi perfil gratis
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {/* Empresas */}
            <div className="bg-primary rounded-2xl shadow-[0px_4px_20px_rgba(15,76,129,0.20)] p-xl relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-sm mb-xl relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">business</span>
                </div>
                <div>
                  <p className="text-label-sm text-white/70">Para empresas</p>
                  <h3 className="text-headline-md text-white">Contrata con IA</h3>
                </div>
              </div>
              <div className="space-y-lg relative z-10">
                {PASOS_EMPRESA.map((p, i) => (
                  <div key={i} className="flex gap-md items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white text-[20px]">{p.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="text-label-sm text-white/60">0{i + 1}</span>
                        <p className="text-label-md text-white">{p.title}</p>
                      </div>
                      <p className="text-body-sm text-white/70">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/registro" className="mt-xl flex items-center justify-center gap-sm w-full bg-energy-orange text-white py-md rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg relative z-10">
                Publicar primera vacante
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORÍAS ════════════════════════════════════════════════════════ */}
      <section id="categorias" className="py-[80px] bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-sm mb-[48px]">
            <div>
              <span className="text-label-sm text-secondary font-semibold uppercase tracking-widest">Explora</span>
              <h2 className="text-headline-lg text-primary mt-xs">Categorías populares</h2>
            </div>
            <Link href="/registro" className="text-primary text-label-md font-semibold hover:underline inline-flex items-center gap-xs">
              Ver todas las categorías
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-md">
            {CATEGORIAS.map(({ icon, label, count }) => (
              <Link
                key={label}
                href="/registro"
                className="bg-white rounded-xl border border-outline-variant/30 p-md flex flex-col items-center text-center gap-sm hover:border-primary hover:shadow-md transition-all group active:scale-95"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
                </div>
                <div>
                  <p className="text-label-md text-on-surface">{label}</p>
                  <p className="text-label-sm text-on-surface-variant">{count} vacantes</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECCIÓN IA ════════════════════════════════════════════════════════ */}
      <section className="py-[80px] bg-background overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[64px] items-center">

            {/* Texto */}
            <div>
              <span className="inline-flex items-center gap-xs text-label-sm text-secondary font-semibold uppercase tracking-widest mb-md">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Diferencial TalentoYa
              </span>
              <h2 className="text-headline-lg text-primary mb-md">No más CVs a ciegas.<br />Solo matches reales.</h2>
              <p className="text-body-md text-on-surface-variant mb-xl leading-relaxed">
                Mientras en Computrabajo recibes 200 hojas de vida sin filtro, TalentoYa analiza automáticamente experiencia, habilidades, ubicación y estabilidad laboral para mostrarte solo los candidatos que realmente encajan.
              </p>
              <div className="space-y-md">
                {[
                  { icon: "timer",          label: "De 6 semanas a 8 días promedio de contratación" },
                  { icon: "verified",       label: "Score de compatibilidad por candidato (0–100%)" },
                  { icon: "location_on",    label: "Filtro por cercanía al lugar de trabajo" },
                  { icon: "trending_up",    label: "Histórico de estabilidad laboral del candidato" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-md">
                    <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-brand-green text-[18px]">{icon}</span>
                    </div>
                    <p className="text-body-md text-on-surface">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual IA */}
            <div className="relative flex items-center justify-center">
              {/* Anillo central */}
              <div className="relative w-64 h-64">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" aria-hidden>
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#e0e3e5" strokeWidth="12" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#00A676" strokeWidth="12"
                    strokeDasharray="534" strokeDashoffset="48" strokeLinecap="round"
                    className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[48px] font-bold text-brand-green leading-none">91%</span>
                  <span className="text-body-sm text-on-surface-variant">Match promedio</span>
                </div>
              </div>

              {/* Tarjetas flotantes */}
              <div className="absolute top-0 right-0 bg-white rounded-xl shadow-lg border border-outline-variant/30 p-sm" style={{ maxWidth: 170 }}>
                <div className="flex items-center gap-sm mb-xs">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[14px]">person</span>
                  </div>
                  <p className="text-label-sm text-on-surface font-semibold">Carlos G.</p>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green rounded-full" style={{ width: "95%" }} />
                </div>
                <p className="text-label-sm text-brand-green mt-xs font-bold">95% match</p>
              </div>

              <div className="absolute bottom-4 left-0 bg-white rounded-xl shadow-lg border border-outline-variant/30 p-sm" style={{ maxWidth: 170 }}>
                <div className="flex items-center gap-xs mb-xs">
                  <span className="material-symbols-outlined text-energy-orange text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <p className="text-label-sm text-on-surface font-semibold">Análisis IA</p>
                </div>
                <p className="text-label-sm text-on-surface-variant">Sector ✓ · Distancia ✓ · Estabilidad ✓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIOS ══════════════════════════════════════════════════════ */}
      <section className="py-[80px] bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-[48px]">
            <span className="text-label-sm text-secondary font-semibold uppercase tracking-widest">Historias reales</span>
            <h2 className="text-headline-lg text-primary mt-xs">Lo que dicen nuestros usuarios</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {TESTIMONIOS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.06)] p-xl flex flex-col gap-lg">
                <div className="flex items-start justify-between gap-md">
                  <div className="flex items-center gap-md">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.tipo === "empresa" ? "bg-primary/10" : "bg-secondary/10"}`}>
                      <span className={`material-symbols-outlined text-[24px] ${t.tipo === "empresa" ? "text-primary" : "text-secondary"}`}>{t.icon}</span>
                    </div>
                    <div>
                      <p className="text-label-md text-on-surface">{t.nombre}</p>
                      <p className="text-label-sm text-on-surface-variant">{t.cargo}</p>
                    </div>
                  </div>
                  <span className="bg-brand-green text-white text-[11px] font-bold px-sm py-xs rounded-full flex-shrink-0">{t.score}</span>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed italic flex-grow">&ldquo;{t.texto}&rdquo;</p>
                <div className="flex gap-xs">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-[16px] text-energy-orange" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRECIOS ══════════════════════════════════════════════════════════ */}
      <section id="precios" className="py-[80px] bg-background">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-[48px]">
            <span className="text-label-sm text-secondary font-semibold uppercase tracking-widest">Transparente</span>
            <h2 className="text-headline-lg text-primary mt-xs">Planes para empresas</h2>
            <p className="text-body-md text-on-surface-variant mt-xs">Para candidatos siempre es gratis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-stretch">
            {PLANES.map((plan, i) => (
              <div
                key={plan.nombre}
                className={`rounded-2xl border-2 ${plan.color} p-xl flex flex-col gap-lg shadow-[0px_4px_20px_rgba(15,76,129,0.08)] ${i === 1 ? "relative" : ""}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-energy-orange text-white text-label-sm px-md py-xs rounded-full whitespace-nowrap shadow-md">
                    {plan.badge}
                  </span>
                )}
                <div>
                  <p className={`text-label-md mb-xs ${i === 1 ? "text-white/80" : "text-on-surface-variant"}`}>{plan.nombre}</p>
                  <div className="flex items-end gap-xs">
                    <span className={`text-[40px] font-bold leading-none ${i === 1 ? "text-white" : "text-on-surface"}`}>{plan.precio}</span>
                    {plan.periodo !== "siempre" && (
                      <span className={`text-body-sm mb-1 ${i === 1 ? "text-white/60" : "text-on-surface-variant"}`}>/{plan.periodo}</span>
                    )}
                  </div>
                  {plan.periodo === "siempre" && (
                    <p className={`text-label-sm ${i === 1 ? "text-white/60" : "text-on-surface-variant"}`}>para siempre</p>
                  )}
                </div>

                <ul className="space-y-sm flex-grow">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-sm">
                      <span className={`material-symbols-outlined text-[18px] flex-shrink-0 ${i === 1 ? "text-secondary-container" : "text-brand-green"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className={`text-body-sm ${i === 1 ? "text-white/80" : "text-on-surface-variant"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/registro"
                  className={`w-full py-md rounded-xl text-label-md font-bold flex items-center justify-center gap-sm active:scale-95 transition-all ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-body-sm text-on-surface-variant mt-lg">
            Todos los precios en pesos colombianos (COP) + IVA. Cancela cuando quieras.
          </p>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════════════════ */}
      <section className="py-[80px] bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-energy-orange/10 rounded-full -ml-24 blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          <span className="material-symbols-outlined text-secondary-container text-[48px] mb-md" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          <h2 className="text-headline-lg text-white mb-md">¿Listo para empezar?</h2>
          <p className="text-body-lg text-white/70 mb-xl" style={{ maxWidth: 480, margin: "0 auto 32px" }}>
            Únete a más de 500 empresas y 2.847 candidatos que ya usan TalentoYa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
            <Link href="/registro" className="w-full sm:w-auto bg-energy-orange text-white px-xl py-md rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">business</span>
              Soy empresa — Publicar vacante
            </Link>
            <Link href="/registro" className="w-full sm:w-auto bg-white/10 border-2 border-white/30 text-white px-xl py-md rounded-xl text-label-md font-bold hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-[20px]">person</span>
              Soy candidato — Buscar empleo
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0d1b2a] text-white/70">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop pt-[64px] pb-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[48px] mb-[48px]">

            {/* Marca */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-xs mb-md">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                </div>
                <span className="text-white font-bold text-headline-md">TalentoYa</span>
              </div>
              <p className="text-body-sm leading-relaxed mb-md">
                La primera plataforma de empleo colombiana con IA. Conectamos talento y empresas por compatibilidad real.
              </p>
              <div className="flex gap-sm">
                {["linkedin", "facebook", "instagram"].map(r => (
                  <div key={r} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      {r === "linkedin" ? "work" : r === "facebook" ? "thumb_up" : "photo_camera"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Para candidatos */}
            <div>
              <p className="text-white text-label-md mb-md">Para candidatos</p>
              <ul className="space-y-sm">
                {["Buscar empleos", "Crear mi perfil", "Cómo funciona", "Preguntas frecuentes"].map(l => (
                  <li key={l}><a href="#" className="text-body-sm hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Para empresas */}
            <div>
              <p className="text-white text-label-md mb-md">Para empresas</p>
              <ul className="space-y-sm">
                {["Publicar vacante", "Ver planes", "API de integración", "Casos de éxito"].map(l => (
                  <li key={l}><a href="#" className="text-body-sm hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-white text-label-md mb-md">Legal y soporte</p>
              <ul className="space-y-sm">
                {[
                  { label: "Política de privacidad", href: "/politica-privacidad" },
                  { label: "Términos de uso", href: "#" },
                  { label: "Habeas Data (Ley 1581)", href: "/politica-privacidad" },
                  { label: "Contacto", href: "#" },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-body-sm hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-lg flex flex-col sm:flex-row items-center justify-between gap-sm">
            <p className="text-label-sm">© 2025 TalentoYa Colombia S.A.S. Todos los derechos reservados.</p>
            <p className="text-label-sm">Bogotá D.C., Colombia 🇨🇴</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
