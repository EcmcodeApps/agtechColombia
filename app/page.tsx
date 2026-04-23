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
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const textCls = scrolled ? "text-on-surface-variant hover:text-primary" : "text-white/90 hover:text-white";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
      ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30" : "bg-transparent"}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className={`text-base md:text-xl font-bold font-headline whitespace-nowrap
          ${scrolled ? "text-primary" : "text-white"}`}>
          AgTech Colombia
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {[
            ["/directorio",         "Directorio"],
            ["/catalogos/productos", "Marketplace"],
            ["/foro",               "AgForo"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className={`text-sm font-medium transition-colors ${textCls}`}>{label}</Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/dashboard"
              className="bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-[oklch(0.40_0.15_160)] transition-colors">
              Mi Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className={`text-sm font-medium transition-colors ${textCls}`}>Ingresar</Link>
              <Link href="/auth/register"
                className="bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-[oklch(0.40_0.15_160)] transition-colors whitespace-nowrap">
                Registrar empresa
              </Link>
            </>
          )}
        </div>

        {/* Mobile: login link + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link href="/auth/login"
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
              ${scrolled ? "border-primary text-primary" : "border-white/50 text-white"}`}>
              Ingresar
            </Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
            ${scrolled ? "text-on-surface hover:bg-surface-container" : "text-white hover:bg-white/10"}`}>
            {menuOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant/30 px-4 pt-3 pb-5 flex flex-col gap-1 shadow-lg">
          {[
            ["/directorio",          "🌐 Directorio"],
            ["/catalogos/productos", "🛍️ Marketplace"],
            ["/foro",                "💬 AgForo"],
            user ? ["/dashboard",    "📊 Mi Dashboard"] : ["/auth/login", "🔑 Ingresar"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl px-3 py-2.5 transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-2 mt-1 border-t border-outline-variant/30">
            <Link href="/auth/register" onClick={() => setMenuOpen(false)}
              className="block w-full bg-primary text-on-primary text-sm font-bold px-4 py-3 rounded-2xl text-center hover:bg-[oklch(0.40_0.15_160)] transition-colors">
              Registrar mi empresa gratis 🚀
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Solid dark-green background */}
      <div className="absolute inset-0 bg-gradient-to-br
        from-[oklch(0.25_0.11_160)]
        via-[oklch(0.30_0.13_158)]
        to-[oklch(0.20_0.09_152)]" />

      {/* Subtle dot pattern — very low opacity */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
           style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      {/* Glow accents — small, contained, low opacity */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96
                      rounded-full bg-[oklch(0.55_0.18_160)]/[0.08] blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72
                      rounded-full bg-[oklch(0.65_0.18_75)]/[0.06] blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8
                      flex flex-col items-center text-center gap-5 pt-24 pb-16 md:pt-28 md:pb-20">

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur
                         text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
          🌱 El directorio AgTech más grande de Colombia
        </span>

        {/* Headline */}
        <h1 className="text-[2.4rem] sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] font-headline">
          Conecta con el ecosistema{" "}
          <span className="text-[oklch(0.78_0.18_85)]">AgTech</span>{" "}
          de Colombia
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/75 max-w-xl leading-relaxed">
          Descubre, conecta y colabora con las empresas de tecnología agrícola que están transformando el campo colombiano.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-center mt-1">
          <Link href="/directorio"
            className="w-full sm:w-auto bg-white text-primary font-bold
                       px-8 py-3.5 rounded-full text-sm hover:bg-white/95
                       shadow-lg shadow-black/20 transition-all active:scale-95 text-center">
            Explorar directorio →
          </Link>
          <Link href="/auth/register"
            className="w-full sm:w-auto bg-[oklch(0.42_0.16_160)] border border-white/25 text-white font-bold
                       px-8 py-3.5 rounded-full text-sm hover:bg-[oklch(0.38_0.15_160)]
                       transition-all active:scale-95 text-center">
            Registrar mi empresa gratis
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-xs sm:max-w-md
                        mt-6 pt-6 border-t border-white/15">
          {[
            { value:"200+", label:"Empresas" },
            { value:"9",    label:"Categorías" },
            { value:"32",   label:"Departamentos" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] sm:text-xs text-white/60 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 inset-x-0 leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 60L1440 60L1440 30C1200 60 900 0 720 15C540 30 240 60 0 30Z"
                fill="oklch(0.97 0.008 160)" />
        </svg>
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
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">Categorías del ecosistema</h2>
          <p className="text-sm text-on-surface-variant mt-1">Explora por área de especialización</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {cats.slice(0,9).map(cat => (
            <Link key={cat.id} href={`/directorio?cat=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 md:p-5 border border-outline-variant/40
                         shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl mb-2 md:mb-3"
                   style={{ background: cat.color+"20" }}>
                {cat.icono}
              </div>
              <h3 className="font-bold text-xs md:text-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
                {cat.nombre}
              </h3>
              <p className="text-[11px] md:text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed hidden sm:block">
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

/* ── Featured companies ──────────────────────────────────────────────────── */
function CompaniesSection({ companies }: { companies: CompanyRecord[] }) {
  const featured = companies.filter(c => c.activa).slice(0,6);
  if (!featured.length) return null;
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 md:mb-10 gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">Empresas destacadas</h2>
            <p className="text-sm text-on-surface-variant mt-1">Líderes innovando la agricultura colombiana</p>
          </div>
          <Link href="/directorio" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">
            Ver directorio →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {featured.map(c => {
            const nombre  = cNombre(c);
            const pitch   = cPitch(c);
            const logo    = cLogo(c);
            const portada = cPortada(c);
            const dept    = cDept(c);
            return (
              <Link key={c.uid} href={`/empresa/${c.uid}`}
                className="group bg-white rounded-2xl border border-outline-variant/40
                           shadow-sm overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-28 bg-gradient-to-br from-primary-container to-surface-container overflow-hidden">
                  {portada && (
                    <img src={portada} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute -bottom-4 left-3 w-10 h-10 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden">
                    {logo
                      ? <img src={logo} alt={nombre} className="w-full h-full object-contain p-0.5" />
                      : <Initials name={nombre} size={40} />
                    }
                  </div>
                </div>
                <div className="pt-6 px-4 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-on-surface">{nombre}</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  </div>
                  {dept && <p className="text-xs text-on-surface-variant mt-0.5">📍 {dept}</p>}
                  <p className="text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">{pitch}</p>
                  <span className="inline-block mt-3 text-xs font-semibold text-primary group-hover:underline">
                    Ver perfil →
                  </span>
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
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">¿Cómo funciona?</h2>
          <p className="text-sm text-on-surface-variant mt-1">En 3 pasos tu empresa empieza a crecer</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon:"📝", step:"01", title:"Registra tu empresa",     desc:"Crea tu perfil gratuito con logo, descripción y categoría en minutos." },
            { icon:"🌐", step:"02", title:"Aparece en el directorio", desc:"Tu empresa queda visible para inversores, aliados y compradores de todo Colombia." },
            { icon:"🤝", step:"03", title:"Conecta y crece",          desc:"Recibe contactos, comparte catálogos y participa en el AgForo." },
          ].map((s,i) => (
            <div key={i} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 sm:text-center">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-container flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-on-primary text-[10px] sm:text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <div className="sm:mt-4">
                <h3 className="font-bold text-on-surface text-sm md:text-base">{s.title}</h3>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">{s.desc}</p>
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

/* ── Forum CTA ───────────────────────────────────────────────────────────── */
function ForoCTA() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[oklch(0.25_0.11_160)] to-[oklch(0.32_0.14_155)]
                        rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-headline">AgForo — Comunidad AgTech</h2>
            <p className="text-white/75 mt-2 text-sm md:text-base leading-relaxed">
              Debate tendencias, comparte experiencias y aprende de los líderes del sector agrícola colombiano.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto md:flex-shrink-0">
            <Link href="/foro"
              className="bg-white text-primary font-bold px-8 py-3 rounded-full text-sm text-center
                         hover:bg-white/90 transition-colors">
              Explorar debates →
            </Link>
            <Link href="/auth/register"
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-full text-sm text-center
                         hover:bg-white/10 transition-colors">
              Unirme a la comunidad
            </Link>
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
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">Planes y precios</h2>
          <p className="text-sm text-on-surface-variant mt-1">Empieza gratis, crece cuando quieras</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {[
            { name:"Gratuito", price:"$0",       border:"border-outline-variant", badge:"",        features:["Perfil básico","3 catálogos","Directorio público"] },
            { name:"Básico",   price:"$49.000",  border:"border-primary",         badge:"Popular", features:["Todo Gratuito","10 productos","3 representantes","Galería fotos"] },
            { name:"Empresa",  price:"$199.000", border:"border-amber-400",       badge:"Premium", features:["Todo Básico","Empresa DESTACADA","Posición prioritaria","Sin límites"] },
          ].map(p => (
            <div key={p.name} className={`bg-white rounded-2xl border-2 ${p.border} shadow-sm p-5 md:p-6 flex flex-col relative`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {p.badge}
                </span>
              )}
              <p className="font-bold text-on-surface">{p.name}</p>
              <p className="text-xl md:text-2xl font-bold text-on-surface mt-1">
                {p.price}<span className="text-xs font-normal text-on-surface-variant">/mes</span>
              </p>
              <ul className="flex flex-col gap-1.5 mt-4 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="text-primary font-bold text-sm">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/planes"
                className="mt-4 bg-primary text-on-primary text-xs font-semibold py-2.5 rounded-xl text-center
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
          <p className="text-base font-bold text-white font-headline mb-2">AgTech Colombia</p>
          <p className="text-xs leading-relaxed">El ecosistema digital de innovación agrícola para Colombia.</p>
        </div>
        {[
          { title:"Plataforma", links:[["/directorio","Directorio"],["/catalogos/productos","Marketplace"],["/foro","AgForo"],["/planes","Planes"]] },
          { title:"Empresa",    links:[["/auth/register","Registrarse"],["/auth/login","Ingresar"],["/dashboard","Dashboard"]] },
          { title:"Soporte",    links:[["/foro","Comunidad"],["/admin/login","Admin"]] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-3">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map(([href, label]) => (
                <li key={label}><Link href={href} className="text-xs hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-5 border-t border-white/10 text-center">
        <p className="text-[11px] text-white/40">© 2026 AgTech Colombia. Todos los derechos reservados.</p>
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
      .then(([c,k]) => { setCompanies(c); setCats(k); })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav user={user} />
      <Hero />
      <CategoriesSection cats={cats} />
      <CompaniesSection companies={companies} />
      <HowItWorks />
      <ForoCTA />
      <PlansCTA />
      <Footer />
    </div>
  );
}
