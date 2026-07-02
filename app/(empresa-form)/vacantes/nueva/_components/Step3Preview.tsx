"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopAppBarForm from "@/app/_components/TopAppBarForm";
import BottomNav from "@/app/_components/BottomNav";
import PageFooter from "@/app/_components/PageFooter";
import { VacanteFormData } from "../types";

interface Props {
  data: VacanteFormData;
  onBack: () => void;
}

export default function Step3Preview({ data, onBack }: Props) {
  const [isPublishing, setIsPublishing] = useState(false);

  // Construir datos de la preview desde el formulario con fallbacks
  const jobTitle = data.jobTitle || "Tu cargo aquí";
  const city = data.city || "Ciudad sin definir";
  const salaryDisplay =
    data.salaryMin && data.salaryMax
      ? `$${Number(data.salaryMin).toLocaleString("es-CO")} - $${Number(
          data.salaryMax
        ).toLocaleString("es-CO")} COP`
      : "Salario por definir";
  const previewSkills =
    data.selectedSkills.length > 0
      ? data.selectedSkills.slice(0, 3)
      : ["Atención al Cliente", "Ventas B2C", "Liderazgo"];

  const handlePublish = async () => {
    setIsPublishing(true);
    // TODO: await createDocument('vacantes', { ...data, status: 'active', createdAt: new Date() })
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPublishing(false);
    // TODO: redirect('/home') o mostrar pantalla de éxito
  };

  return (
    <>
      <TopAppBarForm rightAction="login" />

      <main className="flex-grow pt-24 pb-32 px-margin-mobile max-w-max-width mx-auto w-full">
        {/* ── Indicador de progreso — 3 pastillas ─────────────────── */}
        <div className="mb-xl text-center">
          <div className="flex items-center justify-center gap-xs mb-base">
            <div className="h-2 w-12 rounded-full bg-secondary-fixed" />
            <div className="h-2 w-12 rounded-full bg-secondary-fixed" />
            <div className="h-2 w-12 rounded-full bg-primary-container animate-pulse" />
          </div>
          <p className="text-label-md text-primary opacity-80 uppercase tracking-widest">
            Paso 3 de 3
          </p>
          <h1 className="text-headline-lg-mobile mt-xs text-primary">
            Confirma y Publica
          </h1>
        </div>

        {/* ── Grid: preview izquierda / panel derecho ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* ── Lado izquierdo: preview ───────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-lg">
            {/* Banner de éxito */}
            <div className="bg-secondary-container text-on-secondary-container p-md rounded-xl shadow-sm flex items-start gap-md border border-secondary">
              <span
                className="material-symbols-outlined text-secondary text-[32px] flex-shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <p className="text-label-md font-bold">
                  ¡Todo listo para conectar!
                </p>
                <p className="text-body-sm">
                  Tu vacante será visible para miles de candidatos en minutos
                  una vez confirmes la publicación.
                </p>
              </div>
            </div>

            {/* Tarjeta de vista previa */}
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant relative overflow-hidden">
              {/* Badge "Vista previa" */}
              <div className="absolute top-0 right-0 bg-primary-fixed text-on-primary-fixed text-label-sm px-md py-base rounded-bl-xl">
                Vista previa
              </div>

              {/* Cabecera de la tarjeta */}
              <div className="flex items-center gap-md mb-lg">
                <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant flex-shrink-0">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIJLS2lC5KCqoveCXlVaWHSTUQRBa4dgM3ttFaBBcFlE9XWyC0kxQsqctK3kPX67GYJktB1Et37NwAsnNRpb00HkQi62zeuPcnTGny0uBted5w85aal_EqUbOL3QO7hiPw5dwMR7icIY_wXxO_Y0AJ6hird0R7hN6uiKrfmhxdic71NiZXEX-XGzBm0NsBK0W3c_lhcoq2gukKYURtEGdbGyOU9YdogoGgcv80c6M9yLG5IN90JAaJP9x5oFJ3qMQzGP65rIXfSQ"
                    alt="Logo empresa"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-headline-md text-primary">{jobTitle}</h2>
                  <p className="text-on-surface-variant text-body-sm">
                    Tu empresa
                  </p>
                </div>
              </div>

              {/* Detalle en grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md border-t border-outline-variant pt-lg">
                <div className="flex items-center gap-base">
                  <span className="material-symbols-outlined text-outline">
                    location_on
                  </span>
                  <div>
                    <p className="text-label-sm text-outline uppercase">Ubicación</p>
                    <p className="text-body-md font-semibold">{city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-base">
                  <span className="material-symbols-outlined text-outline">
                    payments
                  </span>
                  <div>
                    <p className="text-label-sm text-outline uppercase">Salario</p>
                    <p className="text-body-md font-semibold">{salaryDisplay}</p>
                  </div>
                </div>

                <div className="flex items-center gap-base">
                  <span className="material-symbols-outlined text-outline">
                    school
                  </span>
                  <div>
                    <p className="text-label-sm text-outline uppercase">Educación</p>
                    <p className="text-body-md font-semibold">
                      {data.educationLevel || "Sin especificar"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-base">
                  <span className="material-symbols-outlined text-outline">
                    verified_user
                  </span>
                  <div>
                    <p className="text-label-sm text-outline uppercase">
                      Matching Score
                    </p>
                    <div className="flex items-center gap-xs">
                      <div className="w-16 h-2 bg-outline-variant rounded-full overflow-hidden">
                        <div className="bg-secondary h-full w-[85%]" />
                      </div>
                      <span className="text-label-sm text-secondary font-bold">
                        85%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Habilidades */}
              <div className="mt-lg">
                <p className="text-label-sm text-outline uppercase mb-xs">
                  Habilidades Clave
                </p>
                <div className="flex flex-wrap gap-xs">
                  {previewSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-surface-container px-md py-xs rounded-full text-label-sm text-on-surface-variant"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Lado derecho: panel de acción ─────────────────────── */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 flex flex-col gap-md">
              {/* Tarjeta de publicación */}
              <div className="bg-white p-lg rounded-xl shadow-[0px_8px_30px_rgba(15,76,129,0.08)] border border-outline-variant/40">
                <h3 className="text-headline-md text-primary mb-md">
                  Finalizar Proceso
                </h3>
                <p className="text-body-sm text-on-surface-variant mb-lg">
                  Al publicar, tu vacante será analizada por nuestro algoritmo
                  para mostrarte solo los perfiles más compatibles.
                </p>

                <div className="flex flex-col gap-sm">
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full bg-energy-orange hover:brightness-110 text-white text-headline-md py-md rounded-xl flex items-center justify-center gap-base shadow-lg transition-all active:scale-95 duration-200 disabled:opacity-80 disabled:pointer-events-none"
                  >
                    <span
                      className={`material-symbols-outlined ${
                        isPublishing ? "animate-spin" : ""
                      }`}
                    >
                      {isPublishing ? "sync" : "rocket_launch"}
                    </span>
                    {isPublishing ? "Publicando..." : "Publicar Ahora"}
                  </button>

                  <button
                    onClick={onBack}
                    className="w-full border border-primary text-primary hover:bg-primary-container hover:text-on-primary-container text-label-md py-md rounded-xl transition-all"
                  >
                    Guardar como Borrador
                  </button>
                </div>

                <hr className="my-lg border-outline-variant" />

                {/* Soporte WhatsApp */}
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-whatsapp-green text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer flex-shrink-0">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      chat
                    </span>
                  </div>
                  <div>
                    <p className="text-label-md">¿Necesitas ayuda?</p>
                    <p className="text-body-sm text-on-surface-variant">
                      Habla con un asesor por WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              {/* Bento fragment — estadística */}
              <div className="bg-primary text-white p-md rounded-xl overflow-hidden relative">
                <div className="relative z-10">
                  <p className="text-label-sm opacity-80 uppercase mb-xs">
                    Beneficio TalentoYa
                  </p>
                  <p className="text-body-md font-bold italic">
                    "El 90% de nuestras vacantes reciben su primer match en
                    menos de 24 horas."
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">
                    bolt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNav solo en mobile (md:hidden) */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Footer solo en desktop */}
      <PageFooter className="hidden md:flex" />
    </>
  );
}
