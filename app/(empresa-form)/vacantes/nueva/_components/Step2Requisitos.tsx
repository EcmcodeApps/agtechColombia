"use client";

import { useState } from "react";
import TopAppBarForm from "@/app/_components/TopAppBarForm";
import PageFooter from "@/app/_components/PageFooter";
import {
  VacanteFormData,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  PREDEFINED_SKILLS,
} from "../types";

interface Props {
  data: VacanteFormData;
  onNext: (partial: Partial<VacanteFormData>) => void;
  onBack: () => void;
}

export default function Step2Requisitos({ data, onNext, onBack }: Props) {
  const [educationLevel, setEducationLevel] = useState(data.educationLevel);
  const [experienceLevel, setExperienceLevel] = useState(data.experienceLevel);
  const [salaryMin, setSalaryMin] = useState(data.salaryMin);
  const [salaryMax, setSalaryMax] = useState(data.salaryMax);
  const [hideSalary, setHideSalary] = useState(data.hideSalary);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(data.selectedSkills)
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const handleNext = () => {
    onNext({
      educationLevel,
      experienceLevel,
      salaryMin,
      salaryMax,
      hideSalary,
      selectedSkills: Array.from(selectedSkills),
    });
  };

  return (
    <>
      <TopAppBarForm rightAction="close" />

      {/* Decoración de fondo */}
      <div className="fixed top-1/4 right-0 -z-10 w-64 h-64 bg-secondary-fixed-dim rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-1/4 left-0 -z-10 w-96 h-96 bg-primary-fixed rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <main className="mt-16 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-36 md:pb-lg">
        {/* ── Indicador de progreso ─────────────────────────────────── */}
        <section className="mb-xl max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-base">
            <span className="text-label-md text-primary uppercase tracking-wider">
              Publicar Vacante
            </span>
            <span className="text-label-md text-on-surface-variant">
              Paso 2 de 3
            </span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-500 ease-out"
              style={{ width: "66.6%" }}
            />
          </div>
          <h1 className="mt-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Requisitos del Cargo
          </h1>
          <p className="text-on-surface-variant text-body-md mt-xs">
            Define el perfil ideal para encontrar a tu candidato perfecto.
          </p>
        </section>

        {/* ── Formulario ───────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto space-y-lg">
          {/* Educación + Experiencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Nivel educativo */}
            <div className="space-y-xs">
              <label htmlFor="edu-level" className="text-label-md text-on-surface">
                Nivel educativo
              </label>
              <div className="relative">
                <select
                  id="edu-level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all text-body-md"
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-md top-3 pointer-events-none text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* Experiencia requerida */}
            <div className="space-y-xs">
              <label htmlFor="exp-level" className="text-label-md text-on-surface">
                Experiencia requerida
              </label>
              <div className="relative">
                <select
                  id="exp-level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all text-body-md"
                >
                  <option value="" disabled>
                    Mínimo de años
                  </option>
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-md top-3 pointer-events-none text-on-surface-variant">
                  work
                </span>
              </div>
            </div>
          </div>

          {/* Rango salarial */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant space-y-md shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
            <label className="text-label-md text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">
                payments
              </span>
              Rango salarial mensual (COP)
            </label>

            <div className="grid grid-cols-2 gap-md">
              {/* Mínimo */}
              <div className="space-y-xs">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Mínimo
                </span>
                <div className="relative">
                  <span className="absolute left-md top-3 text-on-surface-variant pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="1.300.000"
                    className="w-full h-12 pl-8 pr-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container outline-none text-body-md"
                  />
                </div>
              </div>

              {/* Máximo */}
              <div className="space-y-xs">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Máximo
                </span>
                <div className="relative">
                  <span className="absolute left-md top-3 text-on-surface-variant pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="2.500.000"
                    className="w-full h-12 pl-8 pr-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container outline-none text-body-md"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideSalary}
                onChange={(e) => setHideSalary(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-body-sm text-on-surface-variant italic">
                No mostrar salario públicamente (se usará para filtros de matching)
              </span>
            </label>
          </div>

          {/* Habilidades clave */}
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <label className="text-label-md text-on-surface">
                Habilidades clave
              </label>
              <span className="text-[11px] text-secondary font-bold">
                Matching dinámico activado
              </span>
            </div>

            <div className="flex flex-wrap gap-sm">
              {PREDEFINED_SKILLS.map((skill) => {
                const active = selectedSkills.has(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-md py-base rounded-full text-label-md border transition-all active:scale-95 ${
                      active
                        ? "bg-primary text-white border-transparent"
                        : "bg-surface-container text-on-surface-variant border-transparent hover:border-primary"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}

              {/* Agregar habilidad personalizada */}
              <button
                type="button"
                className="px-md py-base border-2 border-dashed border-outline text-on-surface-variant rounded-full text-label-md flex items-center gap-xs hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Otra habilidad
              </button>
            </div>
          </div>

          {/* Tarjeta de consejo */}
          <div className="flex gap-md bg-secondary-container p-md rounded-xl items-start">
            <span className="material-symbols-outlined text-on-secondary-container mt-1">
              lightbulb
            </span>
            <div className="space-y-xs">
              <p className="text-label-md text-on-secondary-container font-bold">
                Consejo de TalentoYa
              </p>
              <p className="text-body-sm text-on-secondary-container opacity-90">
                Las vacantes que incluyen un rango salarial transparente reciben
                un 35% más de aplicaciones de candidatos calificados.
              </p>
            </div>
          </div>

          {/* ── Botones sticky (mobile) / normal (desktop) ─────────── */}
          <div className="fixed bottom-0 left-0 w-full bg-surface px-margin-mobile py-md flex gap-md shadow-[0px_-4px_20px_rgba(15,76,129,0.05)] border-t border-outline-variant md:relative md:bg-transparent md:shadow-none md:border-none md:px-0 md:pt-xl z-40">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 md:flex-none md:w-32 py-md border border-primary text-primary text-label-md rounded-xl active:scale-95 transition-all hover:bg-primary-container hover:text-white"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-[2] md:flex-none md:w-48 py-md bg-brand-orange text-white text-label-md rounded-xl shadow-lg active:scale-95 transition-all hover:opacity-90"
            >
              Siguiente
            </button>
          </div>
        </div>
      </main>

      {/* FAB WhatsApp */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-whatsapp-green text-white rounded-full shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform hover:brightness-105">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat
        </span>
      </button>

      <PageFooter showLogo className="mt-20" />
    </>
  );
}
