"use client";

import { useState } from "react";
import TopAppBarForm from "@/app/_components/TopAppBarForm";
import PageFooter from "@/app/_components/PageFooter";
import { VacanteFormData, CATEGORIES } from "../types";

const MAX_CHARS = 300;
const MIN_CHARS_FOR_BOOST = 50;

interface Props {
  data: VacanteFormData;
  onNext: (partial: Partial<VacanteFormData>) => void;
}

export default function Step1General({ data, onNext }: Props) {
  const [jobTitle, setJobTitle] = useState(data.jobTitle);
  const [category, setCategory] = useState(data.category);
  const [city, setCity] = useState(data.city);
  const [description, setDescription] = useState(data.description);

  const charCount = description.length;
  const charCountReached = charCount >= MIN_CHARS_FOR_BOOST;

  const handleNext = () => {
    onNext({ jobTitle, category, city, description });
  };

  return (
    <>
      <TopAppBarForm rightAction="close" />

      <main className="pt-24 pb-20 px-margin-mobile flex flex-col items-center min-h-screen">
        <div className="max-w-[800px] w-full">
          {/* ── Indicador de progreso ───────────────────────────────────── */}
          <section className="mb-xl text-center">
            <div className="flex flex-col items-center gap-sm">
              <span className="text-label-md text-primary bg-primary-fixed px-base py-xs rounded-full">
                Paso 1 de 3
              </span>
              <h2 className="text-headline-lg text-on-background">
                Información General
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-[500px]">
                Comencemos con los detalles básicos para encontrar a tu candidato
                ideal.
              </p>
            </div>

            {/* Barra de progreso lineal */}
            <div className="w-full h-2 bg-surface-container-highest rounded-full mt-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-primary w-1/3 rounded-full transition-all duration-500" />
            </div>
            <div className="flex justify-between mt-xs px-1">
              <span className="text-label-sm text-primary font-bold">General</span>
              <span className="text-label-sm text-outline">Requisitos</span>
              <span className="text-label-sm text-outline">Publicación</span>
            </div>
          </section>

          {/* ── Tarjeta de formulario ───────────────────────────────────── */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant p-lg md:p-xl mb-lg">
            <div className="flex flex-col gap-lg">
              {/* Título del cargo */}
              <div className="flex flex-col gap-xs focus-within:scale-[1.01] transition-transform">
                <label
                  htmlFor="job-title"
                  className="text-label-md text-on-surface"
                >
                  Título del cargo
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ej: Administrador de Tienda, Repostero..."
                  className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                />
                <p className="text-label-sm text-outline">
                  Sé específico para atraer a los perfiles correctos.
                </p>
              </div>

              {/* Grid: Categoría + Ciudad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {/* Categoría */}
                <div className="flex flex-col gap-xs focus-within:scale-[1.01] transition-transform">
                  <label
                    htmlFor="category"
                    className="text-label-md text-on-surface"
                  >
                    Categoría
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                    >
                      <option value="" disabled>
                        Selecciona una área
                      </option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Ciudad */}
                <div className="flex flex-col gap-xs focus-within:scale-[1.01] transition-transform">
                  <label
                    htmlFor="city"
                    className="text-label-md text-on-surface"
                  >
                    Ciudad
                  </label>
                  <div className="relative">
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej: Bogotá, Medellín..."
                      className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none">
                      location_on
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción con contador */}
              <div className="flex flex-col gap-xs focus-within:scale-[1.01] transition-transform">
                <label
                  htmlFor="description"
                  className="text-label-md text-on-surface"
                >
                  Descripción breve de lo que buscas
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, MAX_CHARS))
                  }
                  placeholder="Cuéntanos un poco sobre el ambiente de trabajo y qué esperas de esta persona..."
                  rows={5}
                  className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md resize-none"
                />
                <div className="flex justify-between">
                  <p className="text-label-sm text-outline">
                    Mínimo {MIN_CHARS_FOR_BOOST} caracteres para un mejor alcance.
                  </p>
                  <span
                    className={`text-label-sm font-bold transition-colors ${
                      charCountReached ? "text-secondary" : "text-outline"
                    }`}
                  >
                    {charCount} / {MAX_CHARS}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Botones de acción ───────────────────────────────────────── */}
          <div className="flex flex-col-reverse md:flex-row md:justify-end gap-md">
            <button className="w-full md:w-auto px-xl py-sm rounded-xl border border-primary text-primary text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95 duration-200">
              Guardar borrador
            </button>
            <button
              onClick={handleNext}
              className="w-full md:w-auto px-xl py-sm rounded-xl bg-brand-orange text-white text-label-md shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center justify-center gap-xs"
            >
              Siguiente
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── Decoración lateral (xl+) ─────────────────────────────────── */}
      <aside className="hidden xl:flex fixed left-12 top-1/2 -translate-y-1/2 flex-col gap-lg w-64 pointer-events-none">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm rotate-[-2deg]">
          <span className="material-symbols-outlined text-brand-orange mb-xs">
            tips_and_updates
          </span>
          <h4 className="text-label-md text-on-background mb-xs">
            Tip de TalentoYa
          </h4>
          <p className="text-body-sm text-on-surface-variant">
            Los cargos con ciudades específicas reciben 3x más aplicaciones que
            los puestos remotos genéricos.
          </p>
        </div>
        <div className="bg-primary p-md rounded-xl shadow-lg rotate-[1deg] text-on-primary">
          <div className="flex items-center gap-xs mb-xs">
            <span className="material-symbols-outlined text-secondary-container">
              verified_user
            </span>
            <span className="text-label-sm">Perfil SME Premium</span>
          </div>
          <p className="text-body-sm opacity-90">
            Tu vacante tendrá prioridad en los matches de los candidatos top.
          </p>
        </div>
      </aside>

      <PageFooter />
    </>
  );
}
