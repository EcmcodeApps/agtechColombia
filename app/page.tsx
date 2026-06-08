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

/* ── AgTech Illustration SVG ─────────────────────────────────────────────── */
function AgTechIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d3d26" stopOpacity="0"/>
          <stop offset="100%" stopColor="#1a5c3a" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d7a4f"/>
          <stop offset="100%" stopColor="#1e5c38"/>
        </linearGradient>
        <linearGradient id="hill2Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a8f5e"/>
          <stop offset="100%" stopColor="#2d7a4f"/>
        </linearGradient>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e"/>
          <stop offset="100%" stopColor="#16213e"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background mountains/hills far */}
      <ellipse cx="240" cy="340" rx="280" ry="120" fill="#1e5c38" opacity="0.4"/>

      {/* Hill far back */}
      <path d="M0 280 Q120 200 240 230 Q360 260 480 220 L480 400 L0 400 Z"
            fill="url(#hillGrad)" opacity="0.7"/>

      {/* Hill mid */}
      <path d="M0 310 Q80 270 180 285 Q280 300 380 275 Q430 265 480 280 L480 400 L0 400 Z"
            fill="url(#hill2Grad)"/>

      {/* Ground */}
      <path d="M0 340 Q120 325 240 335 Q360 345 480 330 L480 400 L0 400 Z"
            fill="#2d6e3e"/>

      {/* ── COFFEE PLANTS left ── */}
      {/* Plant 1 */}
      <line x1="45" y1="340" x2="45" y2="300" stroke="#1a4a28" strokeWidth="2.5"/>
      <ellipse cx="32" cy="310" rx="12" ry="7" fill="#2d8a4e" transform="rotate(-20 32 310)"/>
      <ellipse cx="58" cy="315" rx="12" ry="7" fill="#3a9e5c" transform="rotate(15 58 315)"/>
      <ellipse cx="38" cy="302" rx="10" ry="6" fill="#2d8a4e" transform="rotate(-10 38 302)"/>
      {/* Coffee berries */}
      <circle cx="34" cy="307" r="2.5" fill="#c0392b"/>
      <circle cx="56" cy="312" r="2.5" fill="#e74c3c"/>
      <circle cx="40" cy="299" r="2" fill="#c0392b"/>

      {/* Plant 2 */}
      <line x1="75" y1="345" x2="75" y2="308" stroke="#1a4a28" strokeWidth="2"/>
      <ellipse cx="63" cy="318" rx="10" ry="6" fill="#3a9e5c" transform="rotate(-15 63 318)"/>
      <ellipse cx="87" cy="322" rx="10" ry="6" fill="#2d8a4e" transform="rotate(20 87 322)"/>
      <circle cx="65" cy="315" r="2" fill="#e74c3c"/>

      {/* ── CORN PLANTS right ── */}
      {/* Corn 1 */}
      <line x1="395" y1="345" x2="395" y2="285" stroke="#4a7c2f" strokeWidth="3"/>
      <ellipse cx="378" cy="305" rx="14" ry="5" fill="#5a9e3a" transform="rotate(-25 378 305)"/>
      <ellipse cx="412" cy="315" rx="14" ry="5" fill="#4a8a30" transform="rotate(20 412 315)"/>
      <ellipse cx="382" cy="295" rx="12" ry="4" fill="#5a9e3a" transform="rotate(-15 382 295)"/>
      {/* Corn cob */}
      <rect x="389" y="295" width="8" height="18" rx="4" fill="#f39c12" opacity="0.9"/>
      <line x1="393" y1="295" x2="393" y2="313" stroke="#e67e22" strokeWidth="1" opacity="0.5"/>

      {/* Corn 2 */}
      <line x1="430" y1="350" x2="430" y2="295" stroke="#4a7c2f" strokeWidth="2.5"/>
      <ellipse cx="415" cy="312" rx="12" ry="4.5" fill="#5a9e3a" transform="rotate(-20 415 312)"/>
      <ellipse cx="445" cy="318" rx="12" ry="4.5" fill="#4a8a30" transform="rotate(15 445 318)"/>
      <rect x="425" y="300" width="7" height="15" rx="3.5" fill="#f39c12" opacity="0.85"/>

      {/* Small plants */}
      <line x1="110" y1="350" x2="110" y2="328" stroke="#2d6e3e" strokeWidth="1.5"/>
      <ellipse cx="101" cy="334" rx="8" ry="4" fill="#3a9e5c" transform="rotate(-20 101 334)"/>
      <ellipse cx="119" cy="337" rx="8" ry="4" fill="#2d8a4e" transform="rotate(15 119 337)"/>

      {/* ── FARMER figure ── */}
      {/* Body */}
      <rect x="192" y="298" width="26" height="38" rx="8" fill="#5d4037"/>
      {/* Head */}
      <circle cx="205" cy="290" r="14" fill="#e8a87c"/>
      {/* Hat */}
      <ellipse cx="205" cy="279" rx="18" ry="5" fill="#c8a84b"/>
      <rect x="194" y="270" width="22" height="10" rx="4" fill="#d4a843"/>
      {/* Arm holding phone */}
      <path d="M192 310 L170 320 L170 338" stroke="#5d4037" strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Other arm */}
      <path d="M218 310 L234 318" stroke="#5d4037" strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Legs */}
      <rect x="194" y="334" width="8" height="22" rx="4" fill="#3d2c1e"/>
      <rect x="208" y="334" width="8" height="22" rx="4" fill="#3d2c1e"/>
      {/* Boots */}
      <ellipse cx="198" cy="356" rx="7" ry="4" fill="#2c1810"/>
      <ellipse cx="212" cy="356" rx="7" ry="4" fill="#2c1810"/>

      {/* ── SMARTPHONE in farmer's hand ── */}
      <rect x="155" y="325" width="20" height="34" rx="3" fill="url(#phoneGrad)" stroke="#4fc3f7" strokeWidth="1"/>
      {/* Phone screen */}
      <rect x="157" y="328" width="16" height="26" rx="2" fill="#0d47a1" opacity="0.9"/>
      {/* Screen content - data visualization */}
      <line x1="159" y1="340" x2="171" y2="340" stroke="#4fc3f7" strokeWidth="0.8" opacity="0.7"/>
      <line x1="159" y1="344" x2="168" y2="344" stroke="#4fc3f7" strokeWidth="0.8" opacity="0.7"/>
      <line x1="159" y1="348" x2="170" y2="348" stroke="#4fc3f7" strokeWidth="0.8" opacity="0.7"/>
      {/* Mini chart bars on phone */}
      <rect x="160" y="333" width="2" height="5" rx="1" fill="#00e676" opacity="0.9"/>
      <rect x="163" y="331" width="2" height="7" rx="1" fill="#00e676" opacity="0.9"/>
      <rect x="166" y="334" width="2" height="4" rx="1" fill="#ffeb3b" opacity="0.9"/>
      <rect x="169" y="330" width="2" height="8" rx="1" fill="#00e676" opacity="0.9"/>

      {/* ── DRONE ── */}
      {/* Drone body */}
      <rect x="285" y="115" width="36" height="18" rx="6" fill="#37474f"/>
      {/* Camera */}
      <circle cx="303" cy="136" r="5" fill="#263238"/>
      <circle cx="303" cy="136" r="3" fill="#4fc3f7" opacity="0.8"/>
      {/* Arms */}
      <line x1="285" y1="120" x2="260" y2="108" stroke="#546e7a" strokeWidth="2.5"/>
      <line x1="321" y1="120" x2="346" y2="108" stroke="#546e7a" strokeWidth="2.5"/>
      <line x1="285" y1="128" x2="260" y2="138" stroke="#546e7a" strokeWidth="2.5"/>
      <line x1="321" y1="128" x2="346" y2="138" stroke="#546e7a" strokeWidth="2.5"/>
      {/* Propellers */}
      <ellipse cx="260" cy="107" rx="14" ry="4" fill="#78909c" opacity="0.85"/>
      <ellipse cx="346" cy="107" rx="14" ry="4" fill="#78909c" opacity="0.85"/>
      <ellipse cx="260" cy="139" rx="14" ry="4" fill="#78909c" opacity="0.85"/>
      <ellipse cx="346" cy="139" rx="14" ry="4" fill="#78909c" opacity="0.85"/>
      {/* Drone LED light */}
      <circle cx="303" cy="122" r="3" fill="#ef5350" filter="url(#glow)" opacity="0.9"/>
      {/* Drone scan line going down */}
      <line x1="303" y1="141" x2="290" y2="280" stroke="#4fc3f7" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.4"/>
      <ellipse cx="291" cy="280" rx="12" ry="4" fill="none" stroke="#4fc3f7" strokeWidth="0.8" opacity="0.4"/>

      {/* ── SENSORS on ground ── */}
      {/* Sensor 1 */}
      <rect x="130" y="330" width="10" height="18" rx="3" fill="#00897b"/>
      <circle cx="135" cy="328" r="5" fill="#26a69a"/>
      <circle cx="135" cy="328" r="2.5" fill="#e0f7fa"/>
      {/* Signal waves from sensor 1 */}
      <path d="M127 320 Q122 314 127 308" stroke="#00e676" strokeWidth="1.2" fill="none" opacity="0.7"/>
      <path d="M143 320 Q148 314 143 308" stroke="#00e676" strokeWidth="1.2" fill="none" opacity="0.7"/>
      <path d="M124 316 Q117 308 124 300" stroke="#00e676" strokeWidth="0.9" fill="none" opacity="0.45"/>
      <path d="M146 316 Q153 308 146 300" stroke="#00e676" strokeWidth="0.9" fill="none" opacity="0.45"/>

      {/* Sensor 2 */}
      <rect x="345" y="335" width="10" height="16" rx="3" fill="#00897b"/>
      <circle cx="350" cy="333" r="5" fill="#26a69a"/>
      <circle cx="350" cy="333" r="2.5" fill="#e0f7fa"/>
      <path d="M342 325 Q337 319 342 313" stroke="#00e676" strokeWidth="1.2" fill="none" opacity="0.7"/>
      <path d="M358 325 Q363 319 358 313" stroke="#00e676" strokeWidth="1.2" fill="none" opacity="0.7"/>

      {/* ── DATA TABLE / SPREADSHEET (floating) ── */}
      <rect x="230" y="200" width="110" height="80" rx="8" fill="white" opacity="0.92" filter="url(#softGlow)"/>
      {/* Table header */}
      <rect x="230" y="200" width="110" height="18" rx="8" fill="#1b5e20"/>
      <rect x="230" y="210" width="110" height="8" rx="0" fill="#1b5e20"/>
      <text x="239" y="212" fontSize="7" fill="white" fontFamily="sans-serif" fontWeight="bold">📊 Cultivo Analytics</text>
      {/* Grid lines */}
      <line x1="266" y1="218" x2="266" y2="280" stroke="#bdbdbd" strokeWidth="0.7"/>
      <line x1="302" y1="218" x2="302" y2="280" stroke="#bdbdbd" strokeWidth="0.7"/>
      <line x1="230" y1="232" x2="340" y2="232" stroke="#bdbdbd" strokeWidth="0.7"/>
      <line x1="230" y1="246" x2="340" y2="246" stroke="#bdbdbd" strokeWidth="0.7"/>
      <line x1="230" y1="260" x2="340" y2="260" stroke="#bdbdbd" strokeWidth="0.7"/>
      <line x1="230" y1="274" x2="340" y2="274" stroke="#bdbdbd" strokeWidth="0.7"/>
      {/* Header row */}
      <text x="234" y="228" fontSize="5.5" fill="#1b5e20" fontFamily="sans-serif" fontWeight="bold">Cultivo</text>
      <text x="270" y="228" fontSize="5.5" fill="#1b5e20" fontFamily="sans-serif" fontWeight="bold">Humedad</text>
      <text x="308" y="228" fontSize="5.5" fill="#1b5e20" fontFamily="sans-serif" fontWeight="bold">Temp °C</text>
      {/* Data rows */}
      <text x="234" y="242" fontSize="5" fill="#424242" fontFamily="sans-serif">☕ Café</text>
      <text x="272" y="242" fontSize="5" fill="#1565c0" fontFamily="sans-serif">72%</text>
      <text x="312" y="242" fontSize="5" fill="#e64a19" fontFamily="sans-serif">22°</text>

      <text x="234" y="256" fontSize="5" fill="#424242" fontFamily="sans-serif">🌽 Maíz</text>
      <text x="272" y="256" fontSize="5" fill="#1565c0" fontFamily="sans-serif">65%</text>
      <text x="312" y="256" fontSize="5" fill="#e64a19" fontFamily="sans-serif">25°</text>

      <text x="234" y="270" fontSize="5" fill="#424242" fontFamily="sans-serif">🌿 Quinua</text>
      <text x="272" y="270" fontSize="5" fill="#1565c0" fontFamily="sans-serif">58%</text>
      <text x="312" y="270" fontSize="5" fill="#e64a19" fontFamily="sans-serif">18°</text>

      <rect x="268" y="235" width="16" height="5" rx="1" fill="#42a5f5" opacity="0.35"/>
      <rect x="268" y="249" width="14" height="5" rx="1" fill="#42a5f5" opacity="0.28"/>
      <rect x="268" y="263" width="12" height="5" rx="1" fill="#42a5f5" opacity="0.22"/>

      {/* ── LOCATION PINS ── */}
      {/* Pin 1 over drone scan area */}
      <path d="M291 255 Q291 248 297 244 Q303 240 303 248 Q303 255 291 265 Z" fill="#ef5350" opacity="0.9" filter="url(#glow)"/>
      <circle cx="297" cy="248" r="3.5" fill="white" opacity="0.9"/>

      {/* Pin 2 near farmer */}
      <path d="M200 275 Q200 268 206 264 Q212 260 212 268 Q212 275 200 285 Z" fill="#ff9800" opacity="0.9"/>
      <circle cx="206" cy="268" r="3" fill="white" opacity="0.9"/>

      {/* Pin 3 near sensor */}
      <path d="M128 305 Q128 299 132 296 Q136 293 136 299 Q136 305 128 313 Z" fill="#ab47bc" opacity="0.85"/>
      <circle cx="132" cy="299" r="2.5" fill="white" opacity="0.9"/>

      {/* ── CONNECTIVITY LINES ── */}
      {/* Phone to table */}
      <line x1="175" y1="335" x2="230" y2="250" stroke="#4fc3f7" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.45"/>
      {/* Drone to table */}
      <line x1="303" y1="141" x2="285" y2="200" stroke="#4fc3f7" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.45"/>
      {/* Sensor to table */}
      <line x1="140" y1="325" x2="230" y2="235" stroke="#00e676" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.4"/>
      {/* Sensor 2 to table */}
      <line x1="350" y1="328" x2="340" y2="245" stroke="#00e676" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.4"/>

      {/* ── WIFI / SIGNAL CIRCLES (atmospheric) ── */}
      <circle cx="303" cy="123" r="25" fill="none" stroke="#4fc3f7" strokeWidth="0.5" opacity="0.2"/>
      <circle cx="303" cy="123" r="40" fill="none" stroke="#4fc3f7" strokeWidth="0.4" opacity="0.12"/>
      <circle cx="303" cy="123" r="55" fill="none" stroke="#4fc3f7" strokeWidth="0.3" opacity="0.08"/>

      {/* ── FLOATING DATA NODES ── */}
      <circle cx="80" cy="200" r="8" fill="#1b5e20" opacity="0.7"/>
      <text x="76" y="203" fontSize="8" fill="white">🌡</text>
      <circle cx="450" cy="160" r="8" fill="#1b5e20" opacity="0.7"/>
      <text x="446" y="163" fontSize="8" fill="white">💧</text>
      <circle cx="420" cy="230" r="8" fill="#1b5e20" opacity="0.7"/>
      <text x="416" y="233" fontSize="8" fill="white">☀️</text>

      {/* Connection dots */}
      <line x1="80" y1="208" x2="135" y2="325" stroke="#00e676" strokeWidth="0.6" strokeDasharray="4,4" opacity="0.3"/>
      <line x1="450" y1="168" x2="350" y2="328" stroke="#4fc3f7" strokeWidth="0.6" strokeDasharray="4,4" opacity="0.3"/>
    </svg>
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
          🌱 AgTech Colombia
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {[
            ["/directorio",          "Directorio"],
            ["/catalogos/productos", "Marketplace"],
            ["/foro",                "AgForo"],
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dark green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br
        from-[oklch(0.22_0.12_165)]
        via-[oklch(0.27_0.14_158)]
        to-[oklch(0.18_0.09_150)]" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
           style={{ backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

      {/* Illustration — full bleed background on mobile, right panel on desktop */}
      <div className="absolute inset-0 md:inset-y-0 md:right-0 md:left-[42%]
                      flex items-end md:items-center justify-center
                      opacity-30 md:opacity-80 pointer-events-none">
        <AgTechIllustration className="w-full h-full max-h-[70vh] md:max-h-none object-contain" />
      </div>

      {/* Gradient overlay on illustration side (desktop only) */}
      <div className="hidden md:block absolute inset-y-0 left-[35%] w-48 bg-gradient-to-r
                      from-[oklch(0.27_0.14_158)] to-transparent pointer-events-none" />

      {/* Bottom gradient over illustration (mobile) */}
      <div className="md:hidden absolute bottom-0 inset-x-0 h-32
                      bg-gradient-to-t from-[oklch(0.22_0.12_165)] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8
                      flex flex-col items-center md:items-start text-center md:text-left
                      gap-5 pt-24 pb-16 md:pt-0 md:pb-0 md:w-[52%]">

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur
                         text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
          🌱 El directorio AgTech más grande de Colombia
        </span>

        {/* Headline */}
        <h1 className="text-[2.2rem] sm:text-5xl md:text-[3.2rem] lg:text-6xl font-bold text-white leading-[1.15] font-headline">
          Conecta con el ecosistema{" "}
          <span className="text-[oklch(0.82_0.18_85)]">AgTech</span>{" "}
          de Colombia
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white/75 max-w-xl leading-relaxed">
          Descubre, conecta y colabora con las empresas de tecnología agrícola que están transformando el campo colombiano.
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {["🚁 Drones", "📡 Sensores IoT", "📱 Apps Móviles", "📊 Analítica"].map(tag => (
            <span key={tag} className="text-[11px] bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-center md:justify-start mt-1">
          <Link href="/directorio"
            className="w-full sm:w-auto bg-white text-primary font-bold
                       px-7 py-3.5 rounded-full text-sm hover:bg-white/95
                       shadow-lg shadow-black/20 transition-all active:scale-95 text-center">
            Explorar directorio →
          </Link>
          <Link href="/auth/register"
            className="w-full sm:w-auto bg-[oklch(0.42_0.16_160)] border border-white/25 text-white font-bold
                       px-7 py-3.5 rounded-full text-sm hover:bg-[oklch(0.38_0.15_160)]
                       transition-all active:scale-95 text-center">
            Registrar empresa gratis
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-xs sm:max-w-sm md:max-w-none
                        mt-4 pt-6 border-t border-white/15">
          {[
            { value:"200+", label:"Empresas AgTech" },
            { value:"9",    label:"Categorías"      },
            { value:"32",   label:"Departamentos"   },
          ].map(s => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 inset-x-0 leading-none z-10">
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
          <p className="text-sm text-on-surface-variant mt-1">Explora por área de especialización tecnológica</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {cats.slice(0,9).map(cat => (
            <Link key={cat.id} href={`/directorio?cat=${cat.slug}`}
              className="group bg-white rounded-2xl p-4 md:p-5 border border-outline-variant/40
                         shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all">
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
                           shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="relative h-28 sm:h-32 bg-gradient-to-br from-primary-container to-surface-container overflow-hidden">
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

/* ── AgTech Stats Banner ─────────────────────────────────────────────────── */
function StatsBanner() {
  return (
    <section className="py-10 md:py-12 px-4 sm:px-6
                        bg-gradient-to-r from-[oklch(0.25_0.12_165)] to-[oklch(0.32_0.14_155)]">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { icon:"🚁", value:"45+",  label:"Empresas de drones" },
          { icon:"📡", value:"60+",  label:"Soluciones IoT"     },
          { icon:"📱", value:"80+",  label:"Apps AgTech"        },
          { icon:"🗺️", value:"32",   label:"Departamentos"      },
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
            <div key={i} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 sm:text-center
                                    bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30
                                    hover:shadow-md hover:-translate-y-0.5 transition-all">
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
                        rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8
                        overflow-hidden relative">
          {/* Decorative SVG mini in background */}
          <div className="absolute -right-8 -bottom-8 w-48 opacity-10 pointer-events-none hidden md:block">
            <AgTechIllustration />
          </div>
          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-headline">AgForo — Comunidad AgTech</h2>
            <p className="text-white/75 mt-2 text-sm md:text-base leading-relaxed">
              Debate tendencias, comparte experiencias y aprende de los líderes del sector agrícola colombiano.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto md:flex-shrink-0 relative z-10">
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
            <div key={p.name} className={`bg-white rounded-2xl border-2 ${p.border} shadow-sm p-5 md:p-6 flex flex-col relative
                                          hover:shadow-md hover:-translate-y-0.5 transition-all`}>
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
          <p className="text-base font-bold text-white font-headline mb-2">🌱 AgTech Colombia</p>
          <p className="text-xs leading-relaxed mb-3">El ecosistema digital de innovación agrícola para Colombia.</p>
          <div className="flex gap-3">
            {["🚁","📡","📱","🌿"].map(e => (
              <span key={e} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">{e}</span>
            ))}
          </div>
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
        <p className="text-[11px] text-white/40">© 2026 AgTech Colombia · Tecnología para el campo colombiano</p>
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
