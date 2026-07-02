"use client";

import Image from "next/image";
import { useState } from "react";

// ── SVG ring constants (r=28, viewBox 0 0 64 64) ─────────────────────────────
const RING_R = 28;
const RING_C = 2 * Math.PI * RING_R; // ≈ 175.93

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface MatchCardData {
  id: string;
  badge: string;
  title: string;
  company: string;
  imageUrl: string;
  matchScore: number;
}

type NotifId = "interview" | "message" | "process" | "profile";

// ── Datos demo — TODO: reemplazar con Firestore ──────────────────────────────
const TOP_MATCHES: MatchCardData[] = [
  {
    id: "1",
    badge: "Alta Compatibilidad",
    title: "Desarrollador Fullstack Senior",
    company: "TechInnovate S.A.S",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIPziy7GpOe3WKHChBtUxozPdaxN4qJTUnKhCByzQthyPgQeSOw5vIfRZsffHemy_WrannjA8gnHzFmRuR013vKUB3LfkrXzON4tlMGdUGRMi3Ky-z8ikGnHd-5mYUcgmwdol_9dJIe_5mIJ7wDoGKRsXbU5J0H__L9bnkbH67WMREwMd_RnsJCCxvh_6AkPKvfwb-ZbR2j45vpcgat2S46YTJ7v13wj533C94S2C-EMfGCz9ordZA2gLJDUmz6ehuKRacTJWtmw",
    matchScore: 92,
  },
  {
    id: "2",
    badge: "Match Sugerido",
    title: "Director de Marketing",
    company: "Boutique Creativa",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeLN1xcCguSmfi9QyCftH37daPwo4ZEO0H6SQFR68A6vUAh-3Joln85oyRTKnl0UI5pbl5sPoRMCTkz6v-8O5dNjRBt0KofnMMwGS-p7JQR0x0fpfhrHj36VG6JBgsRAg1rc6uu4cGl8ay1a_Ir0YjxpmfL6gkoRD0B60vABWcZtlxVP2YNGIZdmdzaUDEtnINtM7ABs5pWJb-kaewb1JkdKh3NyVAtQpgi3vERr7u9Fxem1sfZOGMXpUP1HYcFo4qsQVmhYTlpw",
    matchScore: 95,
  },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function NotificacionesPage() {
  // IDs de notificaciones sin leer al cargar
  const [unread, setUnread] = useState<Set<NotifId>>(
    new Set(["interview", "message"])
  );
  const [btnLabel, setBtnLabel] = useState("Marcar todo como leído");

  const markAllRead = () => {
    setUnread(new Set());
    setBtnLabel("¡Listo!");
    setTimeout(() => setBtnLabel("Marcar todo como leído"), 2000);
  };

  return (
    <>
      {/* ── Header personalizado ────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between gap-md">
          <h1 className="text-headline-md font-bold text-primary">TalentoYa</h1>
          <button
            onClick={markAllRead}
            className="text-label-md text-energy-orange hover:bg-surface-container px-md py-xs rounded-lg active:scale-95 transition-all duration-200 flex-shrink-0"
          >
            {btnLabel}
          </button>
        </div>
      </header>

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl space-y-xl">

        {/* ── Matches Destacados (IA) ───────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-xs mb-md">
            <span
              className="material-symbols-outlined text-energy-orange"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <h2 className="text-headline-lg-mobile text-on-surface">
              Matches Destacados (IA)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {TOP_MATCHES.map((m) => {
              const dashOffset = RING_C * (1 - m.matchScore / 100);
              return (
                <div
                  key={m.id}
                  className="bg-white/70 backdrop-blur-md border border-white/30 border-l-4 border-l-energy-orange rounded-xl p-md shadow-[0px_4px_20px_rgba(15,76,129,0.05)] flex items-center justify-between gap-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  {/* Imagen + info */}
                  <div className="flex gap-md items-center min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                      <Image
                        src={m.imageUrl}
                        alt={m.company}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-label-sm text-energy-orange flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">
                          rocket_launch
                        </span>
                        {m.badge}
                      </p>
                      <h3 className="text-label-md text-on-surface font-bold truncate">
                        {m.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant truncate">
                        {m.company}
                      </p>
                    </div>
                  </div>

                  {/* Anillo de match */}
                  <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                    >
                      <circle
                        cx="32" cy="32" r={RING_R}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-surface-container-high"
                      />
                      <circle
                        cx="32" cy="32" r={RING_R}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={RING_C}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        className="text-energy-orange transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute text-label-md font-bold text-primary">
                      {m.matchScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Actividad Reciente ────────────────────────────────────────── */}
        <section>
          <h2 className="text-headline-lg-mobile text-on-surface mb-md">
            Actividad Reciente
          </h2>

          <div className="flex flex-col gap-sm">

            {/* ── Entrevista programada ─────────────────────────────── */}
            <div
              className={`bg-surface rounded-xl p-md flex items-start gap-md border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer active:scale-[0.99] ${
                !unread.has("interview") ? "opacity-80" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">
                  calendar_month
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-sm">
                  <h4 className="text-label-md text-on-surface font-bold">
                    Entrevista Programada
                  </h4>
                  <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                    10m
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-xs leading-relaxed">
                  Tu entrevista para{" "}
                  <span className="text-primary font-semibold">
                    Analista de Datos
                  </span>{" "}
                  en GlobalLogix ha sido confirmada para mañana a las 9:00 AM.
                </p>
                <div className="mt-md flex gap-sm flex-wrap">
                  <button className="px-md py-xs bg-primary text-white rounded-lg text-label-sm active:scale-95 transition-transform">
                    Ver detalles
                  </button>
                  <button className="px-md py-xs border border-outline text-on-surface-variant rounded-lg text-label-sm hover:bg-surface-container active:scale-95 transition-transform">
                    Posponer
                  </button>
                </div>
              </div>
              {unread.has("interview") && (
                <div className="w-2 h-2 rounded-full bg-energy-orange flex-shrink-0 mt-2" />
              )}
            </div>

            {/* ── Nuevo mensaje ─────────────────────────────────────── */}
            <div
              className={`bg-surface rounded-xl p-md flex items-start gap-md border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer active:scale-[0.99] ${
                !unread.has("message") ? "opacity-80" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                <span
                  className="material-symbols-outlined text-on-secondary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  chat
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-sm">
                  <h4 className="text-label-md text-on-surface font-bold">
                    Nuevo Mensaje
                  </h4>
                  <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                    2h
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-xs leading-relaxed">
                  <span className="font-semibold text-on-surface">
                    Carolina Herrera (Empresaria)
                  </span>{" "}
                  envió: &ldquo;¿Estarías disponible para una breve llamada
                  técnica el viernes?&rdquo;
                </p>
              </div>
              {unread.has("message") && (
                <div className="w-2 h-2 rounded-full bg-energy-orange flex-shrink-0 mt-2" />
              )}
            </div>

            {/* ── Proceso actualizado (leído) ───────────────────────── */}
            <div className="bg-surface rounded-xl p-md flex items-start gap-md border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer opacity-80 active:scale-[0.99]">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">
                  description
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-sm">
                  <h4 className="text-label-md text-on-surface">
                    Proceso Actualizado
                  </h4>
                  <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                    Ayer
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-xs leading-relaxed">
                  Tu postulación para{" "}
                  <span className="text-on-surface font-semibold">
                    Diseñador UI/UX
                  </span>{" "}
                  ha pasado a la fase de &lsquo;Revisión Técnica&rsquo;.
                </p>
              </div>
            </div>

            {/* ── Perfil visto (leído) ──────────────────────────────── */}
            <div className="bg-surface rounded-xl p-md flex items-start gap-md hover:bg-surface-container-low transition-colors cursor-pointer opacity-80 active:scale-[0.99]">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant">
                  person
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-sm">
                  <h4 className="text-label-md text-on-surface">Perfil Visto</h4>
                  <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                    2 días
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-xs leading-relaxed">
                  Tres empresas en el sector de &lsquo;Logística&rsquo; vieron
                  tu perfil en las últimas 48 horas.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ── WhatsApp FAB ──────────────────────────────────────────────────── */}
      <button
        className="fixed bottom-24 lg:bottom-8 right-4 z-40 w-14 h-14 bg-whatsapp-green text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"
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
