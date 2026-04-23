"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getActiveCompanies, getCategoriasActivas, type CompanyRecord, type CategoriaRecord } from "@/lib/firebase/firestore";

/* ── helpers ─────────────────────────────────────────────────────────────── */
const cNombre  = (c: CompanyRecord) => c.nombreComercial || c.step1?.nombreComercial || c.nombre || "Empresa";
const cPitch   = (c: CompanyRecord) => c.pitchCorto      || c.step3?.pitchCorto      || c.descripcion || "";
const cLogo    = (c: CompanyRecord) => c.logoUrl         || c.step1?.logoUrl         || "";
const cPortada = (c: CompanyRecord) => c.portadaUrl      || c.step1?.portadaUrl      || "";
const cDept    = (c: CompanyRecord) => c.departamento    || c.step1?.departamento    || "";

function Initials({ name, size = 40 }: { name: string; size?: number }) {
  const init = name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
  const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#14b8a6"];
  const bg = COLORS[name.charCodeAt(0) % COLORS.length];
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
         style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
      {init}
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────────────────────────────── */
function Nav({ user }: { user: User | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur shadow-sm border-b border-outline-variant/40" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className={`text-xl font-bold font-headline ${scrolled ? "text-primary" : "text-white"}`}>
          AgTech Colombia
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/directorio",          label: "Directorio" },
            { href: "/catalogos/productos",  label: "Marketplace" },
            { href: "/foro",                 label: "AgForo" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-on-surface-variant" : "text-white/90 hover:text-white"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard"
              className="hidden md:flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-[oklch(0.40_0.15_160)] transition-colors">
              Mi Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/auth/login"
                className={`hidden md:block text-sm font-medium transition-colors ${scrolled ? "text-on-surface-variant hover:text-primary" : "text-white/90 hover:text-white"}`}>
                Ingresar
              </Link>
              <Link href="/auth/register"
                className="bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-[oklch(0.40_0.15_160)] transition-colors">
                Registrar empresa
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden text-xl ${scrolled ? "text-on-surface" : "text-white"}`}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant px-4 py-4 flex flex-col gap-3">
          {[
            { href: "/directorio",         label: "Directorio" },
            { href: "/catalogos/productos", label: "Marketplace" },
            { href: "/foro",               label: "AgForo" },
            { href: "/auth/login",         label: "Ingresar" },
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-on-surface-variant hover:text-primary py-1">
              {l.label}
            </Link>
          ))}
          <Link href="/auth/register" onClick={() => setMenuOpen(false)}
            className="bg-primary text-on-primary text-sm font-semibold px-5 py-2.5 rounded-full text-center hover:bg-[oklch(0.40_0.15_160)] transition-colors">
            Registrar empresa gratis
          </Link>
        </div>
      )}
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.28_0.12_160)] via-[oklch(0.35_0.15_155)] to-[oklch(0.22_0.10_150)]" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[oklch(0.55_0.15_160)]/10 blur-3xl" />
      <div className="absolute bottom-10 left-0 w-72 h-72 rounded-full bg-[oklch(0.65_0.18_75)]/10 blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6 pt-20 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
          🌱 El directorio AgTech más grande de Colombia
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight font-headline">
          Conecta con el ecosistema{" "}
          <span className="text-[oklch(0.78_0.18_95)]">AgTech</span>{" "}
          de Colombia
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
          Descubre, conecta y colabora con las empresas de tecnología agrícola que están transformando el campo colombiano.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link href="/directorio"
            className="bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-lg text-sm">
            Explorar directorio →
          </Link>
          <Link href="/auth/register"
            className="bg-primary border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-full hover:bg-[oklch(0.50_0.15_160)] transition-all text-sm">
            Registrar mi empresa gratis
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/20 w-full max-w-lg">
          {[
            { value: "200+", label: "Empresas" },
            { value: "9",    label: "Categorías" },
            { value: "32",   label: "Departamentos" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 80 900 0 720 20C540 40 240 80 0 40L0 80Z"
                fill="oklch(0.98 0.005 160)" />
        </svg>
      </div>
    </section>
  );
}

/* ── Categories section ──────────────────────────────────────────────────── */
function CategoriesSection({ cats }: { cats: CategoriaRecord[] }) {
  return (
    <section className="py-16 px-4 bg-[oklch(0.98_0.005_160)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-on-surface font-headline">Categorías del ecosistema</h2>
          <p className="text-on-surface-variant mt-2">Explora por área de especialización</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {cats.slice(0, 9).map(cat => (
            <Link key={cat.id} href={`/directorio?cat=${cat.slug}`}
              className="group bg-white rounded-2xl p-5 border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                   style={{ background: cat.color + "20" }}>
                {cat.icono}
              </div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{cat.nombre}</h3>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{cat.descripcion}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/directorio"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-8 py-3 rounded-full hover:bg-[oklch(0.40_0.15_160)] transition-colors text-sm">
            Ver todas las empresas →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Featured companies ──────────────────────────────────────────────────── */
function CompaniesSection({ companies }: { companies: CompanyRecord[] }) {
  const featured = companies
    .filter(c => c.plan === "empresa" || c.plan === "profesional" || c.activa)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <div>
            <h2 className="text-3xl font-bold text-on-surface font-headline">Empresas destacadas</h2>
            <p className="text-on-surface-variant mt-1">Líderes innovando la agricultura colombiana</p>
          </div>
          <Link href="/directorio" className="text-sm font-semibold text-primary hover:underline">
            Ver directorio completo →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(c => {
            const nombre  = cNombre(c);
            const pitch   = cPitch(c);
            const logo    = cLogo(c);
            const portada = cPortada(c);
            const dept    = cDept(c);
            return (
              <Link key={c.uid} href={`/empresa/${c.uid}`}
                className="group bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                {/* Portada */}
                <div className="relative h-32 bg-gradient-to-br from-primary-container to-surface-container overflow-hidden">
                  {portada && <img src={portada} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden">
                    {logo
                      ? <img src={logo} alt={nombre} className="w-full h-full object-contain p-0.5" />
                      : <Initials name={nombre} size={48} />
                    }
                  </div>
                </div>
                <div className="pt-7 px-4 pb-4">
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
  const steps = [
    { icon: "📝", step: "01", title: "Registra tu empresa", desc: "Crea tu perfil gratuito en minutos con tu información, logo y descripción del negocio." },
    { icon: "🌐", step: "02", title: "Aparece en el directorio", desc: "Tu empresa queda visible para inversores, aliados y compradores de todo Colombia." },
    { icon: "🤝", step: "03", title: "Conecta y crece", desc: "Recibe solicitudes de contacto, comparte catálogos y participa en el AgForo." },
  ];
  return (
    <section className="py-16 px-4 bg-[oklch(0.98_0.005_160)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface font-headline">¿Cómo funciona?</h2>
          <p className="text-on-surface-variant mt-2">En 3 pasos tu empresa empieza a crecer</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center text-3xl shadow-sm">
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{s.title}</h3>
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute" style={{ marginLeft: "100%", marginTop: "-2rem" }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold px-10 py-3.5 rounded-full hover:bg-[oklch(0.40_0.15_160)] transition-colors shadow-md">
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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[oklch(0.28_0.12_160)] to-[oklch(0.35_0.15_155)] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-headline">AgForo — Comunidad AgTech</h2>
            <p className="text-white/80 mt-2 leading-relaxed">
              Debate tendencias, comparte experiencias y aprende de los líderes del sector agrícola colombiano.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-center md:items-end flex-shrink-0">
            <Link href="/foro"
              className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-colors text-sm w-full text-center">
              Explorar debates →
            </Link>
            <Link href="/auth/register"
              className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-sm w-full text-center">
              Unirme a la comunidad
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Plans teaser ────────────────────────────────────────────────────────── */
function PlansCTA() {
  const plans = [
    { name: "Gratuito", price: "$0", color: "border-outline-variant", badge: "", features: ["Perfil básico", "3 catálogos", "Directorio público"] },
    { name: "Básico",   price: "$49.000", color: "border-primary", badge: "Popular", features: ["Todo Gratuito", "10 productos", "3 representantes", "Galería fotos"] },
    { name: "Empresa",  price: "$199.000", color: "border-[oklch(0.55_0.14_75)]", badge: "Premium", features: ["Todo Básico", "Empresa DESTACADA", "Posición prioritaria", "Sin límites"] },
  ];
  return (
    <section className="py-16 px-4 bg-[oklch(0.98_0.005_160)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-on-surface font-headline">Planes y precios</h2>
          <p className="text-on-surface-variant mt-2">Empieza gratis, crece cuando quieras</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.name} className={`bg-white rounded-2xl border-2 ${p.color} shadow-sm p-6 flex flex-col relative`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <p className="font-bold text-on-surface">{p.name}</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{p.price}<span className="text-xs font-normal text-on-surface-variant">/mes</span></p>
              <ul className="flex flex-col gap-2 mt-4 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="text-primary font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/planes" className="mt-5 bg-primary text-on-primary text-xs font-semibold py-2.5 rounded-xl text-center hover:bg-[oklch(0.40_0.15_160)] transition-colors">
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
    <footer className="bg-[oklch(0.22_0.08_160)] text-white/80 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="text-lg font-bold text-white font-headline mb-2">AgTech Colombia</p>
          <p className="text-xs leading-relaxed">El ecosistema digital de innovación agrícola para Colombia.</p>
        </div>
        {[
          { title: "Plataforma", links: [["Directorio", "/directorio"], ["Marketplace", "/catalogos/productos"], ["AgForo", "/foro"], ["Planes", "/planes"]] },
          { title: "Empresa",    links: [["Registrarse", "/auth/register"], ["Ingresar", "/auth/login"], ["Dashboard", "/dashboard"]] },
          { title: "Soporte",    links: [["Ayuda", "/foro"], ["Admin", "/admin/login"]] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="text-xs hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-xs text-white/50">© 2026 AgTech Colombia. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [user, setUser]           = useState<User | null>(null);
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [cats, setCats]           = useState<CategoriaRecord[]>([]);

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
    <>
      <Nav user={user} />
      <Hero />
      <CategoriesSection cats={cats} />
      <CompaniesSection companies={companies} />
      <HowItWorks />
      <ForoCTA />
      <PlansCTA />
      <Footer />
    </>
  );
}
