"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ── Imágenes ──────────────────────────────────────────────────────────────────
const COMPANY_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCE0NM-XbeA7gvP3e8u1vAQoW5fZHv1GG4LrdPAYusBYYk5JiupLPxitq297ZWWqoicQmg1T52XhsmuajlT0YqxLAAuJAkI2c_Mm0ZoW5pQRf7vGiRWtbfQt-Ccry5d1pYTsS-3QhdMAdSJ_UJTLDUw-mYtjqVOR3o0tFA2yQHmMMalyICWz1wAGc_CbzyKNz-46SnYAP1Uoe09o8aSh_CeDqg1fd028EVRKYkdr1ME_E1SQPrUAL6DYPzjUw50gcZGw4lcx6ywzA";

const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Ht1jMMZPrT_zVDbq4QrE-n5BQXXg8-bmMrzlzHg0LQu7paWGoQ6HrPpjuv4AqMRFjuRHvvjN_FjfXcXOjLvZAIab8B773e7k_2GrQM3qldnBXSA2ssQtnk3uMMms025vormYpn_DaIe7ov214qBV_fbPWABfStuvYX5tCNVVPZiBaOaSEsHEzImzRo-TIvI55EwYVLsMdQvvdYNQFpd6GavZeSqanI0ejEaWO279PgyLx8cTCYcIaLe-mkqUmUs2-f4j1RaqQg";

// ── Datos demo — TODO: reemplazar con Firestore fetch usando params.id ───────
const BENEFITS: { icon: string; label: string }[] = [
  { icon: "directions_bus",  label: "Transporte incluido"    },
  { icon: "restaurant",      label: "Casino"                  },
  { icon: "trending_up",     label: "Crecimiento profesional" },
  { icon: "health_and_safety", label: "Seguro complementario" },
];

interface VacancyCard {
  id: string;
  title: string;
  subtitle: string;
  salaryRange: string;
  experience: string;
  matchScore: number;
  accent: "secondary" | "orange";
}

const VACANTES: VacancyCard[] = [
  {
    id: "1",
    title: "Técnico Electromecánico",
    subtitle: "Planta Medellín • Tiempo Completo",
    salaryRange: "$2.4M – $2.8M COP",
    experience: "Exp: 2 años",
    matchScore: 92,
    accent: "secondary",
  },
  {
    id: "2",
    title: "Auxiliar de Logística",
    subtitle: "CEDI Itagüí • Turnos Rotativos",
    salaryRange: "$1.4M – $1.6M COP",
    experience: "Sin experiencia",
    matchScore: 78,
    accent: "orange",
  },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function EmpresaPerfilPage() {
  const router = useRouter();
  const [siguiendo, setSiguiendo] = useState(false);

  return (
    <>
      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200"
            aria-label="Volver"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="text-headline-md font-bold text-primary">TalentoYa</h1>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200"
            aria-label="Compartir perfil"
          >
            <span className="material-symbols-outlined text-on-surface">share</span>
          </button>
        </div>
      </header>

      {/* ── Contenido ─────────────────────────────────────────────────────── */}
      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-xl">

        {/* ── Hero: logo + datos + mapa ────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">

          {/* Perfil principal */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30 p-xl flex flex-col md:flex-row items-center md:items-start gap-lg overflow-hidden relative">

            {/* Logo */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl bg-surface-container-high border border-outline-variant overflow-hidden flex-shrink-0">
              <Image
                src={COMPANY_LOGO}
                alt="Logo Inversiones Antioquia S.A.S"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-xs mb-xs flex-wrap md:gap-sm">
                <h2 className="text-headline-lg-mobile md:text-headline-lg text-primary">
                  Inversiones Antioquia S.A.S
                </h2>
                <div className="inline-flex items-center gap-xs bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full w-fit mx-auto md:mx-0 flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-label-sm">Verificado por TalentoYa</span>
                </div>
              </div>

              <p className="text-body-lg text-on-surface-variant mb-md">
                Sector Industrial • Medellín, Antioquia
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-sm">
                <button
                  onClick={() => setSiguiendo((s) => !s)}
                  className={`px-xl py-sm rounded-xl text-label-md font-bold shadow-md hover:brightness-110 active:scale-[0.98] transition-all ${
                    siguiendo ? "bg-primary text-white" : "bg-energy-orange text-white"
                  }`}
                >
                  {siguiendo ? "Siguiendo ✓" : "Seguir Empresa"}
                </button>
                <Link
                  href="#vacantes"
                  className="border-2 border-primary text-primary px-xl py-sm rounded-xl text-label-md font-bold hover:bg-primary/5 active:scale-[0.98] transition-all"
                >
                  Ver vacantes
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta de ubicación */}
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30 p-md flex flex-col gap-sm">
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider">
              Ubicación
            </h3>
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-outline-variant">
              <Image
                src={MAP_IMG}
                alt="Mapa — Medellín, Colombia"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                <span
                  className="material-symbols-outlined text-energy-orange text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
            </div>
            <p className="text-body-sm text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">pin_drop</span>
              Zona Industrial de Guayabal, Medellín
            </p>
          </div>
        </section>

        {/* ── Sobre nosotros + Cultura y Beneficios ────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xl">

          {/* Sobre nosotros */}
          <div className="md:col-span-7 bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30 p-xl">
            <h3 className="text-headline-md text-primary mb-md">Sobre nosotros</h3>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Con más de 25 años en el sector industrial de Antioquia, nos especializamos en la
              optimización de procesos logísticos y manufactura de alta precisión. Nuestra misión
              es impulsar el desarrollo económico regional a través de la excelencia operativa y
              el bienestar de nuestro talento humano.
            </p>
            <div className="mt-lg grid grid-cols-2 gap-md">
              <div className="p-md bg-surface-container rounded-xl">
                <span className="material-symbols-outlined text-primary block mb-xs">
                  rocket_launch
                </span>
                <h4 className="text-label-md text-primary">Misión</h4>
                <p className="text-body-sm text-on-surface-variant mt-xs">
                  Innovación constante en procesos industriales.
                </p>
              </div>
              <div className="p-md bg-surface-container rounded-xl">
                <span className="material-symbols-outlined text-primary block mb-xs">
                  visibility
                </span>
                <h4 className="text-label-md text-primary">Visión 2030</h4>
                <p className="text-body-sm text-on-surface-variant mt-xs">
                  Líderes en sostenibilidad industrial en Colombia.
                </p>
              </div>
            </div>
          </div>

          {/* Cultura y beneficios */}
          <div className="md:col-span-5 bg-primary rounded-xl p-xl text-white relative overflow-hidden">
            <h3 className="text-headline-md text-white mb-sm">Cultura y Beneficios</h3>
            <p className="text-body-sm text-primary-fixed mb-lg opacity-90">
              Priorizamos el equilibrio vida‑trabajo y el crecimiento técnico de nuestros
              colaboradores.
            </p>
            <div className="flex flex-wrap gap-sm">
              {BENEFITS.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-xs bg-white/10 px-md py-sm rounded-full border border-white/20"
                >
                  <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                    {icon}
                  </span>
                  <span className="text-label-sm">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-xl pt-lg border-t border-white/10">
              <p className="text-label-md text-white mb-sm flex items-center gap-xs">
                <span
                  className="material-symbols-outlined text-energy-orange text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  forum
                </span>
                ¿Tienes dudas sobre la empresa?
              </p>
              <button className="bg-whatsapp-green w-full flex items-center justify-center gap-sm py-md rounded-xl text-label-md text-white font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  chat
                </span>
                Hablar por WhatsApp
              </button>
            </div>
            {/* Decoración */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* ── Vacantes activas ──────────────────────────────────────────── */}
        <section id="vacantes" className="mb-xl scroll-mt-20">
          <div className="flex justify-between items-end mb-lg flex-wrap gap-sm">
            <div>
              <h3 className="text-headline-md text-primary">Vacantes Activas</h3>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                Posiciones que coinciden con tu perfil
              </p>
            </div>
            <Link
              href="/vacantes"
              className="text-primary text-label-md flex items-center gap-xs hover:underline"
            >
              Ver todas
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {VACANTES.map((v) => (
              <div
                key={v.id}
                className={`bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30 border-l-4 p-lg hover:shadow-[0px_8px_30px_rgba(15,76,129,0.10)] hover:-translate-y-0.5 transition-all duration-300 ${
                  v.accent === "secondary"
                    ? "border-l-secondary"
                    : "border-l-energy-orange"
                }`}
              >
                {/* Encabezado */}
                <div className="flex justify-between items-start mb-md gap-sm">
                  <div className="min-w-0">
                    <h4 className="text-headline-md text-on-surface mb-xs truncate">{v.title}</h4>
                    <p className="text-body-sm text-on-surface-variant">{v.subtitle}</p>
                  </div>
                  {/* Match badge */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${
                        v.accent === "secondary"
                          ? "border-secondary-container"
                          : "border-surface-container-highest"
                      }`}
                    >
                      <span
                        className={`text-label-md font-bold ${
                          v.accent === "secondary"
                            ? "text-secondary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {v.matchScore}%
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-on-surface-variant uppercase mt-1 tracking-wide">
                      Match
                    </span>
                  </div>
                </div>

                {/* Chips de info */}
                <div className="flex gap-sm mb-lg flex-wrap">
                  <span className="bg-surface-container px-sm py-xs rounded-lg text-label-sm text-on-surface-variant">
                    {v.salaryRange}
                  </span>
                  <span className="bg-surface-container px-sm py-xs rounded-lg text-label-sm text-on-surface-variant">
                    {v.experience}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href={`/vacantes/${v.id}`}
                  className="block w-full bg-primary text-white text-center py-sm rounded-xl text-label-md font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-sm"
                >
                  Postularme ahora
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t border-outline-variant pt-xl flex flex-col items-center gap-md">
          <h2 className="text-headline-md font-bold text-primary">TalentoYa</h2>
          <div className="flex flex-wrap justify-center gap-lg">
            {[
              "Política de privacidad",
              "Términos de uso",
              "Soporte y contacto",
              "Soporte por WhatsApp",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="text-on-surface-variant hover:text-primary transition-colors text-body-sm"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-on-surface-variant text-body-sm text-center">
            © 2025 TalentoYa Colombia. Todos los derechos reservados.
          </p>
        </footer>
      </main>

      {/* ── WhatsApp FAB ──────────────────────────────────────────────────── */}
      <button
        className="fixed bottom-8 right-4 z-40 w-14 h-14 bg-whatsapp-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"
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
