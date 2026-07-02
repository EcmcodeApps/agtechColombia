"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getActiveCompanies, getCategoriasActivas, type CompanyRecord, type CategoriaRecord } from "@/lib/firebase/firestore";

/* ── helpers ─────────────────────────────────────────────────────────────── */
const cNombre  = (c: CompanyRecord) => c.nombreComercial || c.step1?.nombreComercial || c.nombre    || "Empresa";
const cPitch   = (c: CompanyRecord) => c.pitchCorto      || c.step3?.pitchCorto      || c.descripcion || "";
const cLogo    = (c: CompanyRecord) => c.logoUrl         || c.step1?.logoUrl         || "";
const cPortada = (c: CompanyRecord) => c.portadaUrl      || c.step1?.portadaUrl      || "";
const cDept    = (c: CompanyRecord) => c.departamento    || c.step1?.departamento    || "";

function Initials({ name, size = 40 }: { name: string; size?: number }) {
  const init = name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
  const BG = ["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#14b8a6"];
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
         style={{ width:size, height:size, background: BG[name.charCodeAt(0) % BG.length], fontSize:size*0.38 }}>
      {init}
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────────────── */
function Nav({ user }: { user: User|null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const textCls = scrolled
    ? "text-on-surface-variant hover:text-primary"
    : "text-white/90 hover:text-white";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
      ${scrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30"
        : "bg-gradient-to-b from-black/50 to-transparent"}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className={`text-base md:text-xl font-bold font-headline whitespace-nowrap
          ${scrolled ? "text-primary" : "text-white"}`}>
          🌱 AgTech Colombia
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {[
            ["/directorio",          "Directorio"],
            ["/catalogos/productos", "Marketplace"],
            ["/foro",                "AgForo"],
          ].map(([href, label]) => (
            <Link key={href} href={href}
              className={`text-sm font-medium transition-colors ${textCls}`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/dashboard"
              className="bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full
                         hover:bg-[oklch(0.40_0.15_160)] transition-colors">
              Mi Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/auth/login"
                className={`text-sm font-medium transition-colors ${textCls}`}>
                Ingresar
              </Link>
              <Link href="/auth/register"
                className="bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full
                           hover:bg-[oklch(0.40_0.15_160)] transition-colors whitespace-nowrap">
                Registrar empresa
              </Link>
            </>
          )}
        </div>

        {/* Mobile: login + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link href="/auth/login"
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
              ${scrolled ? "border-primary text-primary" : "border-white/60 text-white"}`}>
              Ingresar
            </Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
            ${scrolled ? "text-on-surface hover:bg-surface-container" : "text-white hover:bg-white/10"}`}>
            {menuOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant/30 px-4 pt-3 pb-5 flex flex-col gap-1 shadow-xl">
          {[
            ["/directorio",          "🌐 Directorio"],
            ["/catalogos/productos", "🛍️ Marketplace"],
            ["/foro",                "💬 AgForo"],
            user
              ? ["/dashboard", "📊 Mi Dashboard"]
              : ["/auth/login", "🔑 Ingresar"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-on-surface-variant hover:text-primary
                         hover:bg-surface-container rounded-xl px-3 py-2.5 transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-2 mt-1 border-t border-outline-variant/30">
            <Link href="/auth/register" onClick={() => setMenuOpen(false)}
              className="block w-full bg-primary text-on-primary text-sm font-bold
                         px-4 py-3 rounded-2xl text-center hover:bg-[oklch(0.40_0.15_160)] transition-colors">
              Registrar mi empresa gratis 🚀
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero con foto de fondo ──────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── FOTO DE FONDO: campo colombiano + tecnología agrícola ── */}
      {/* Drone sobre cultivos verdes — Unsplash (libre uso) */}
      <img
        src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1920&q=85"
        alt="Dron sobrevolando cultivos colombianos"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Overlay degradado — mantiene texto legible sin tapar la foto */}
      <div className="absolute inset-0"
           style={{background:
             "linear-gradient(105deg, rgba(10,50,25,0.88) 0%, rgba(10,50,25,0.72) 45%, rgba(10,40,20,0.40) 75%, rgba(5,25,12,0.20) 100%)"
           }} />

      {/* Degradado inferior para fusionar con la siguiente sección */}
      <div className="absolute bottom-0 inset-x-0 h-40
                      bg-gradient-to-t from-[oklch(0.97_0.008_160)] to-transparent" />

      {/* ── CONTENIDO ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto
                      px-5 sm:px-8 lg:px-16
                      pt-24 pb-20 md:pt-28 md:pb-24
                      flex flex-col items-start gap-5 md:max-w-[65%] lg:max-w-[55%]">

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm
                         text-white text-xs font-semibold px-4 py-1.5 rounded-full
                         border border-white/25 shadow-sm">
          🌱 El directorio AgTech más grande de Colombia
        </span>

        {/* Titular */}
        <h1 className="text-3xl sm:text-5xl md:text-[3.4rem] lg:text-[3.8rem]
                       font-bold text-white leading-[1.18] font-headline drop-shadow-lg">
          Conecta con el ecosistema{" "}
          <span className="text-[oklch(0.82_0.20_85)]">AgTech</span>
          {" "}de Colombia
        </h1>

        {/* Subtítulo */}
        <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg leading-relaxed drop-shadow">
          Descubre, conecta y colabora con las empresas de tecnología agrícola
          que están transformando el campo colombiano.
        </p>

        {/* Pills de tecnología */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon:"🚁", label:"Drones" },
            { icon:"📡", label:"Sensores IoT" },
            { icon:"📱", label:"Apps Móviles" },
            { icon:"📊", label:"Analítica de datos" },
            { icon:"📍", label:"Geolocalización" },
          ].map(t => (
            <span key={t.label}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium
                         bg-white/12 backdrop-blur-sm border border-white/20
                         text-white/85 px-3 py-1 rounded-full">
              {t.icon} {t.label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-1">
          <Link href="/directorio"
            className="w-full sm:w-auto flex items-center justify-center gap-2
                       bg-white text-[oklch(0.35_0.14_160)] font-bold
                       px-8 py-3.5 rounded-full text-sm
                       hover:bg-white/95 shadow-xl shadow-black/30
                       transition-all active:scale-95">
            Explorar directorio →
          </Link>
          <Link href="/auth/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2
                       bg-primary/90 backdrop-blur-sm border border-white/20
                       text-white font-bold px-8 py-3.5 rounded-full text-sm
                       hover:bg-primary transition-all active:scale-95 shadow-lg">
            Registrar empresa gratis
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-4 pt-6 border-t border-white/20 w-full max-w-sm sm:max-w-md">
          {[
            { value:"200+", label:"Empresas AgTech" },
            { value:"9",    label:"Categorías"      },
            { value:"32",   label:"Departamentos"   },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave de transición */}
      <div className="absolute bottom-0 inset-x-0 leading-none z-10">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 56L1440 56L1440 28C1200 56 900 0 720 14C540 28 240 56 0 28Z"
                fill="oklch(0.97 0.008 160)" />
        </svg>
      </div>
    </section>
  );
}

/* ── Stats Banner ────────────────────────────────────────────────────────── */
function StatsBanner() {
  return (
    <section className="py-10 md:py-12 px-4 sm:px-6
                        bg-gradient-to-r from-[oklch(0.25_0.12_165)] to-[oklch(0.32_0.14_155)]">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { icon:"🚁", value:"45+", label:"Empresas de drones"  },
          { icon:"📡", value:"60+", label:"Soluciones IoT"      },
          { icon:"📱", value:"80+", label:"Apps AgTech"         },
          { icon:"🗺️", value:"32",  label:"Departamentos"       },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-white/65 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Categories ──────────────────────────────────────────────────────────── */
function CategoriesSection({ cats }: { cats: CategoriaRecord[] }) {
  if (!cats.length) return null;
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-[oklch(0.97_0.008_160)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">
            Categorías del ecosistema
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Explora por área de especialización tecnológica
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {cats.slice(0,9).map(cat => (
            <Link key={cat.id} href={`/directorio?cat=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 md:p-5 border border-outline-variant/40
                         shadow-sm hover:shadow-md hover:border-primary/30
                         hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center
                              justify-center text-xl md:text-2xl mb-2 md:mb-3"
                   style={{ background: cat.color+"20" }}>
                {cat.icono}
              </div>
              <h3 className="font-bold text-xs md:text-sm text-on-surface
                             group-hover:text-primary transition-colors leading-snug">
                {cat.nombre}
              </h3>
              <p className="text-[11px] md:text-xs text-on-surface-variant mt-1
                            line-clamp-2 leading-relaxed hidden sm:block">
                {cat.descripcion}
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <Link href="/directorio"
            className="inline-flex items-center gap-2 bg-primary text-on-primary
                       font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-full text-sm
                       hover:bg-[oklch(0.40_0.15_160)] transition-colors">
            Ver todas las empresas →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Carrusel automático de empresas ─────────────────────────────────────── */
function CompaniesSection({ companies }: { companies: CompanyRecord[] }) {
  const featured = companies.filter(c => c.activa);
  if (!featured.length) return null;

  /* Duplicamos para loop infinito sin saltos */
  const items = [...featured, ...featured];

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <style>{`
        @keyframes slide-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track {
          animation: slide-left 18s linear infinite;
          will-change: transform;
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Encabezado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">
              Empresas destacadas
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Líderes innovando la agricultura colombiana
            </p>
          </div>
          <Link href="/directorio"
            className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
            Ver directorio →
          </Link>
        </div>
      </div>

      {/* Carrusel — desborda sin scroll visible */}
      <div className="overflow-hidden select-none">
        <div className="carousel-track flex gap-4 w-max px-4">
          {items.map((c, i) => {
            const nombre  = cNombre(c);
            const logo    = cLogo(c);
            const portada = cPortada(c);
            const dept    = cDept(c);
            const pitch   = cPitch(c);

            return (
              <Link
                key={`${c.uid}-${i}`}
                href={`/empresa/${c.uid}`}
                className="group flex-shrink-0 w-44 sm:w-52"
              >
                {/* Tarjeta cuadrada */}
                <div className="aspect-square rounded-2xl border border-outline-variant/40
                                bg-[oklch(0.97_0.008_160)] shadow-sm
                                group-hover:shadow-lg group-hover:-translate-y-1
                                transition-all duration-300 overflow-hidden relative flex
                                flex-col items-center justify-center p-3 gap-2">

                  {/* Portada como fondo muy suave */}
                  {portada && (
                    <img src={portada} alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-10
                                 group-hover:opacity-20 transition-opacity duration-300" />
                  )}

                  {/* Logo completo centrado */}
                  <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
                                  bg-white border border-outline-variant/30 shadow-md
                                  overflow-hidden flex items-center justify-center flex-shrink-0">
                    {logo
                      ? <img src={logo} alt={nombre}
                             className="w-full h-full object-contain p-2" />
                      : <Initials name={nombre} size={80} />
                    }
                  </div>

                  {/* Nombre + ubicación */}
                  <div className="relative z-10 text-center px-1">
                    <p className="font-bold text-xs sm:text-sm text-on-surface leading-tight
                                  line-clamp-2 group-hover:text-primary transition-colors">
                      {nombre}
                    </p>
                    {dept && (
                      <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                        📍 {dept}
                      </p>
                    )}
                    {pitch && (
                      <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-2 leading-snug
                                    hidden sm:block">
                        {pitch}
                      </p>
                    )}
                  </div>

                  {/* Indicador verificada */}
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full
                                   bg-green-500 shadow-sm z-10" title="Activa" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────────────────── */
function HowItWorks() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-[oklch(0.97_0.008_160)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">
            ¿Cómo funciona?
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            En 3 pasos tu empresa empieza a crecer
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {[
            { icon:"📝", step:"01", title:"Registra tu empresa",
              desc:"Crea tu perfil gratuito con logo, descripción y categoría en minutos." },
            { icon:"🌐", step:"02", title:"Aparece en el directorio",
              desc:"Tu empresa queda visible para inversores, aliados y compradores de todo Colombia." },
            { icon:"🤝", step:"03", title:"Conecta y crece",
              desc:"Recibe contactos, comparte catálogos y participa en el AgForo." },
          ].map((s, i) => (
            <div key={i}
              className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 sm:text-center
                         bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30
                         hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-container
                                flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full
                                 bg-primary text-on-primary text-[10px] sm:text-xs font-bold
                                 flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <div className="sm:mt-4">
                <h3 className="font-bold text-on-surface text-sm md:text-base">{s.title}</h3>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 md:mt-10">
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold
                       px-8 md:px-10 py-3 md:py-3.5 rounded-full text-sm
                       hover:bg-[oklch(0.40_0.15_160)] transition-colors shadow-md">
            Registrar mi empresa gratis 🚀
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── AgForo CTA ──────────────────────────────────────────────────────────── */
function ForoCTA() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          {/* Foto de fondo — agricultores colaborando */}
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
            alt="Comunidad AgTech"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br
                          from-[oklch(0.22_0.12_165)]/92
                          via-[oklch(0.26_0.13_160)]/85
                          to-[oklch(0.20_0.10_155)]/75" />

          {/* Content */}
          <div className="relative z-10 p-6 md:p-10
                          flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="text-4xl mb-3">💬</div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-headline">
                AgForo — Comunidad AgTech
              </h2>
              <p className="text-white/80 mt-2 text-sm md:text-base leading-relaxed max-w-lg">
                Debate tendencias, comparte experiencias y aprende de los líderes
                del sector agrícola colombiano.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto md:flex-shrink-0">
              <Link href="/foro"
                className="bg-white text-primary font-bold px-8 py-3 rounded-full
                           text-sm text-center hover:bg-white/90 transition-colors shadow-md">
                Explorar debates →
              </Link>
              <Link href="/auth/register"
                className="border-2 border-white/30 text-white font-semibold px-8 py-3
                           rounded-full text-sm text-center hover:bg-white/10 transition-colors">
                Unirme a la comunidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Plans ───────────────────────────────────────────────────────────────── */
function PlansCTA() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-[oklch(0.97_0.008_160)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">
            Planes y precios
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Empieza gratis, crece cuando quieras
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {[
            { name:"Gratuito", price:"$0",
              border:"border-outline-variant", badge:"",
              features:["Perfil básico","3 catálogos","Directorio público"] },
            { name:"Básico",   price:"$49.000",
              border:"border-primary",         badge:"Popular",
              features:["Todo Gratuito","10 productos","3 representantes","Galería fotos"] },
            { name:"Empresa",  price:"$199.000",
              border:"border-amber-400",       badge:"Premium",
              features:["Todo Básico","Empresa DESTACADA","Posición prioritaria","Sin límites"] },
          ].map(p => (
            <div key={p.name}
              className={`bg-white rounded-2xl border-2 ${p.border} shadow-sm
                          p-5 md:p-6 flex flex-col relative
                          hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2
                                 bg-primary text-on-primary text-[10px] font-bold
                                 px-3 py-1 rounded-full whitespace-nowrap">
                  {p.badge}
                </span>
              )}
              <p className="font-bold text-on-surface">{p.name}</p>
              <p className="text-xl md:text-2xl font-bold text-on-surface mt-1">
                {p.price}
                <span className="text-xs font-normal text-on-surface-variant">/mes</span>
              </p>
              <ul className="flex flex-col gap-1.5 mt-4 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="text-primary font-bold text-sm">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/planes"
                className="mt-4 bg-primary text-on-primary text-xs font-semibold
                           py-2.5 rounded-xl text-center
                           hover:bg-[oklch(0.40_0.15_160)] transition-colors">
                Elegir plan →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[oklch(0.20_0.08_160)] text-white/75 py-10 md:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="text-base font-bold text-white font-headline mb-2">
            🌱 AgTech Colombia
          </p>
          <p className="text-xs leading-relaxed mb-3">
            El ecosistema digital de innovación agrícola para Colombia.
          </p>
          <div className="flex gap-3">
            {["🚁","📡","📱","🌿"].map(e => (
              <span key={e}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">
                {e}
              </span>
            ))}
          </div>
        </div>
        {[
          { title:"Plataforma", links:[
            ["/directorio","Directorio"],
            ["/catalogos/productos","Marketplace"],
            ["/foro","AgForo"],
            ["/planes","Planes"],
          ]},
          { title:"Empresa", links:[
            ["/auth/register","Registrarse"],
            ["/auth/login","Ingresar"],
            ["/dashboard","Dashboard"],
          ]},
          { title:"Soporte", links:[
            ["/foro","Comunidad"],
            ["/admin/login","Admin"],
          ]},
        ].map(col => (
          <div key={col.title}>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-3">
              {col.title}
            </p>
            <ul className="flex flex-col gap-2">
              {col.links.map(([href, label]) => (
                <li key={label}>
                  <Link href={href}
                    className="text-xs hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-5 border-t border-white/10 text-center">
        <p className="text-[11px] text-white/40">
          © 2026 AgTech Colombia · Tecnología para el campo colombiano
        </p>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [user,      setUser]      = useState<User|null>(null);
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [cats,      setCats]      = useState<CategoriaRecord[]>([]);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  useEffect(() => {
    Promise.all([getActiveCompanies(), getCategoriasActivas()])
      .then(([c, k]) => { setCompanies(c); setCats(k); })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav user={user} />
      <Hero />
      <StatsBanner />
      <CategoriesSection cats={cats} />
      <CompaniesSection companies={companies} />
      <HowItWorks />
      <ForoCTA />
      <PlansCTA />
      <Footer />
    </div>
  );
}
