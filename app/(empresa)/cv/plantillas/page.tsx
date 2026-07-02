"use client";

import Link from "next/link";
import { useState } from "react";
import TopAppBar from "@/app/_components/TopAppBar";

type TemplateId = "clasico" | "tech" | "ejecutivo";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwRkSmdA_d64KqxwOAkz_6KEjJJ2liFrcOY7c-eC6_wXrcUYlJCDXjoTZbnyAFCNTp2Kb2n2Z5Vlbm4x7ArAGEHGR5CVYxQJURjBRyk4k2620cX82k0vo3QCO3H9PXGywaD9hc38vro_1F9EwV_RhjXUDslrWTNGRNQcYLW_eidR774XhjZIiDnDhMisPK50scWMbhsbTF4Dxw9gJxrLrNmlWdiK1rRwz57JMwwMDEged9PfGUYB6siA_GCKBDrwqoer9jHWvdyg";

const TEMPLATES: {
  id: TemplateId;
  name: string;
  desc: string;
  tags: string[];
  accent: string;
  preview: string;
}[] = [
  {
    id: "clasico",
    name: "Clásico profesional",
    desc: "Ideal para perfiles administrativos, legales o contables que buscan transmitir seriedad y orden.",
    tags: ["Tradicional", "ATS"],
    accent: "bg-primary",
    preview:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBI9OC3UV9frRSdAiOBKMfhXAcyuBwqof7QzHSMGCCJ4FBysKGL0sAgDdEvV4v_nqFFwi4rUC2KTZjp4EVKN9gKzAPvWm6Aw6ZrOw7DsxiKOZDsE_micv2cAfKZFYC-K-ss1B2J2d4R8lU_RdDz0c2Hv_g1R4IWYzw5pFU5_m1VZ-472AFe_CD0KOF0sjaubzIwppOIQ9Zio9eaHR4E8MTwEdVdGLC8udJnVtzV_wSCurFQ3rFmte5MvNA1sXQ7n6lzO3zxJPDMini9",
  },
  {
    id: "tech",
    name: "Moderno tech",
    desc: "Diseño dinámico con foco en habilidades técnicas, proyectos y portafolio. Perfecto para TI y roles creativos.",
    tags: ["Vibrante", "Proyectos"],
    accent: "bg-energy-orange",
    preview:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFXoR1eqZnk_FUSy6eGmzPJRC0pfFUyv9d3uC1A7emgJ6AYnJMbDZ3bYYvnHUDwfhtAwjjDmkPa84oDC1hfPUNtJs8cCSz1H36SWF7E0sx7wTG9tHvLGhnYkfQXWXaFb6B4Cv-eT6N0UKc23XCvPBQrzQLCx9SaQqDpRAp0-oaxb9KYa42c7ol1IuWL-g8DG7-6IODH1r7m41wXVAbCiaiZmx9DpBH2NMPKKdpPolOCCcXtxl0p7YGYmiqz1BB4kK_jt3Wjv37GZl-",
  },
  {
    id: "ejecutivo",
    name: "Ejecutivo minimalista",
    desc: "Elegancia y síntesis para roles directivos. Destaca logros, liderazgo e impacto con un estilo limpio.",
    tags: ["Elegante", "Gerencial"],
    accent: "bg-secondary",
    preview:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0VKKgKIj6ILr-SBZh4Ag_71rXbWkQzFGIgsziM28qCbQD8FvYgAZcAVfKN_9blEItVrhlu4yxcgve6SQryTR6gUs3VRw45MLaJzKFHcHDTIBABTOXpzOBeZM8SyeTvOmKh4wSZf6A5HY6pRf0mZtaEDF6OHyoAZIkpdZgkfDGNHMD9yDxQsbGqYkZrl-tK2sUfMWLiZ9mS7P76vB5Pw8Ip1JoaBu65B5OUW1zEMMuVsSFzfjnMmLVc8bSkdfBb5fOpyZdZ-gPLagS",
  },
];

export default function CvTemplatesPage() {
  const [selected, setSelected] = useState<TemplateId>("clasico");
  const current = TEMPLATES.find((template) => template.id === selected) ?? TEMPLATES[0];

  return (
    <>
      <TopAppBar
        userName="Mateo Rivera"
        userType="Candidato"
        avatarUrl={AVATAR}
        hasNotification
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">
        <div className="mb-xl flex flex-col lg:flex-row lg:items-end lg:justify-between gap-lg">
          <div className="max-w-3xl">
            <Link
              href="/cv"
              className="inline-flex items-center gap-xs text-primary text-label-md hover:underline mb-md"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Volver a mi CV
            </Link>
            <p className="text-secondary text-label-md uppercase tracking-wider">
              Diseño del documento
            </p>
            <h1 className="mt-xs text-headline-lg-mobile md:text-display-lg text-primary">
              Elige tu plantilla
            </h1>
            <p className="mt-sm text-body-lg text-on-surface-variant">
              Selecciona el diseño que mejor represente tu trayectoria profesional.
              Todas las plantillas están optimizadas para lectura ATS.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant shadow-[0px_4px_20px_rgba(15,76,129,0.05)] p-md lg:min-w-[280px]">
            <p className="text-label-sm text-on-surface-variant">Plantilla seleccionada</p>
            <div className="mt-xs flex items-center gap-sm">
              <span className={`w-3 h-3 rounded-full ${current.accent}`} />
              <span className="text-label-md text-primary">{current.name}</span>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {TEMPLATES.map((template) => {
            const active = selected === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelected(template.id)}
                className={`group text-left rounded-2xl p-md md:p-lg flex flex-col h-full border-2 transition-all active:scale-[0.99] ${
                  active
                    ? "bg-white border-primary shadow-[0px_18px_45px_rgba(0,53,95,0.14)]"
                    : "bg-surface-container-lowest border-outline-variant hover:-translate-y-1 hover:border-primary/30 hover:bg-white"
                }`}
              >
                <div className="relative overflow-hidden rounded-xl mb-md aspect-[3/4] bg-surface-container-low border border-outline-variant">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${template.preview}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                  {active && (
                    <div className="absolute top-sm right-sm bg-secondary text-white px-sm py-xs rounded-full text-label-sm font-bold shadow-sm flex items-center gap-xs">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      Seleccionado
                    </div>
                  )}
                </div>

                <h2 className={`text-headline-md mb-xs ${active ? "text-primary" : "text-on-surface"}`}>
                  {template.name}
                </h2>
                <p className="text-body-sm text-on-surface-variant mb-md flex-1">
                  {template.desc}
                </p>
                <div className="flex gap-xs flex-wrap">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-sm py-xs bg-surface-container-high text-on-surface-variant rounded-full text-label-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </section>

        <section className="mt-xl bg-surface-container rounded-2xl p-lg border border-outline-variant flex flex-col lg:flex-row lg:items-center lg:justify-between gap-lg">
          <div className="flex items-start gap-md">
            <span className="material-symbols-outlined text-primary p-sm bg-primary-fixed rounded-full">
              info
            </span>
            <div>
              <h2 className="text-label-md text-primary">Previsualización en tiempo real</h2>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                Puedes cambiar de plantilla en cualquier momento sin perder tus datos.
                La descarga en PDF usará el diseño seleccionado.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-md w-full lg:w-auto">
            <Link
              href="/cv"
              className="flex-1 lg:flex-none inline-flex items-center justify-center px-xl py-md border border-primary text-primary text-label-md rounded-xl hover:bg-white transition-all"
            >
              Cancelar
            </Link>
            <Link
              href={`/cv/preview?plantilla=${selected}`}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-xs px-xl py-md bg-energy-orange text-white text-label-md rounded-xl shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Continuar
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
