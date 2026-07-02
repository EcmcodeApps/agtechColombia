"use client";

import Link from "next/link";
import { useState } from "react";

const STATS = [
  { icon: "visibility",    label: "Vistas totales", val: "0" },
  { icon: "person_search", label: "Postulantes",     val: "0" },
  { icon: "bolt",          label: "Matches AI",      val: "0" },
];

export default function VacantesPage() {
  const [tip, setTip] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Contenedor central */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-xl px-md md:px-lg">
        <div className="flex flex-col items-center text-center w-full" style={{ maxWidth: 480 }}>

          {/* ── Ilustración ──────────────────────────────────────────── */}
          <div className="relative w-full mb-xl flex-shrink-0" style={{ height: 200 }}>

            {/* Badge: Primera vacante */}
            <div
              className="absolute top-2 left-0 animate-bounce bg-white rounded-2xl shadow-lg px-md py-sm flex items-center gap-sm border border-outline-variant"
              style={{ animationDelay: "0s" }}
            >
              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              <span className="text-label-sm text-on-surface whitespace-nowrap">Primera vacante</span>
            </div>

            {/* Badge: +Candidatos */}
            <div
              className="absolute top-2 right-0 animate-bounce bg-white rounded-2xl shadow-lg px-md py-sm flex items-center gap-sm border border-outline-variant"
              style={{ animationDelay: "0.4s" }}
            >
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <span className="text-label-sm text-on-surface whitespace-nowrap">+Candidatos</span>
            </div>

            {/* Badge: Match AI */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce bg-energy-orange/10 border border-energy-orange/30 rounded-2xl px-md py-sm flex items-center gap-sm"
              style={{ animationDelay: "0.8s" }}
            >
              <span className="material-symbols-outlined text-energy-orange text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="text-label-sm text-energy-orange font-bold whitespace-nowrap">Match AI</span>
            </div>

            {/* Ícono central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center shadow-xl">
                <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>work_history</span>
              </div>
            </div>
          </div>

          {/* ── Copy ─────────────────────────────────────────────────── */}
          <h1 className="text-headline-lg text-primary mb-sm">
            ¡Bienvenido a TalentoYa!
          </h1>
          <p className="text-body-md text-on-surface-variant mb-xl leading-relaxed">
            Publica tu primera vacante y deja que nuestra IA encuentre los mejores candidatos para tu empresa.
          </p>

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <Link
            href="/vacantes/nueva"
            className="self-center inline-flex items-center gap-sm bg-energy-orange text-white px-xl py-md rounded-2xl text-label-lg font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all mb-lg"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Publicar Vacante
          </Link>

          <a
            href="#"
            className="self-center inline-flex items-center gap-xs text-label-sm text-[#25D366] hover:underline mb-xl"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            ¿Necesitas ayuda? Contáctanos por WhatsApp
          </a>

          {/* ── Stats fantasma ────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-md w-full mt-lg opacity-60">
            {STATS.map(({ icon, label, val }) => (
              <div key={label} className="bg-white rounded-2xl p-md shadow-sm border border-outline-variant flex flex-col items-center gap-xs">
                <span className="material-symbols-outlined text-on-surface-variant text-[24px]">{icon}</span>
                <span className="text-headline-md text-on-surface">{val}</span>
                <span className="text-label-sm text-on-surface-variant text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAB ──────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-sm">
        {tip && (
          <span className="bg-on-surface text-surface text-label-sm px-md py-xs rounded-lg shadow-lg whitespace-nowrap">
            Nueva Vacante
          </span>
        )}
        <Link
          href="/vacantes/nueva"
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          className="w-14 h-14 bg-energy-orange text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
          aria-label="Nueva vacante"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </Link>
      </div>
    </div>
  );
}
