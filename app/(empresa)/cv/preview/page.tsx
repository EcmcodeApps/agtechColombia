"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CV_STORAGE_KEY, CvData, DEFAULT_CV } from "../_lib/cv-data";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-headline-md text-primary uppercase">
      {children}
      <span className="block w-12 h-[3px] bg-primary mt-xs" />
    </h2>
  );
}

function ContactItem({ icon, value }: { icon: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-md min-w-0">
      <div className="bg-primary-container text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <span className="text-body-sm text-on-surface break-words">{value}</span>
    </div>
  );
}

export default function CvPreviewPage() {
  const [cv, setCv] = useState<CvData>(DEFAULT_CV);

  useEffect(() => {
    window.setTimeout(() => {
      const stored = window.localStorage.getItem(CV_STORAGE_KEY);
      if (!stored) return;

      try {
        setCv(JSON.parse(stored) as CvData);
      } catch {
        window.localStorage.removeItem(CV_STORAGE_KEY);
      }
    }, 0);
  }, []);

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .cv-print-area {
            max-width: none !important;
            width: 210mm !important;
            min-height: 297mm !important;
            height: auto !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
          }

          .print-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>

      <header className="no-print fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-md min-w-0">
          <Link
            href="/cv"
            className="material-symbols-outlined text-primary hover:bg-surface-container-high p-2 rounded-full"
            aria-label="Volver a mi CV"
          >
            arrow_back
          </Link>
          <span className="text-headline-md font-bold text-primary truncate">TalentoYA</span>
        </div>
        <div className="flex items-center gap-sm">
          <Link
            href="/cv/editar"
            className="hidden sm:inline-flex items-center gap-xs border border-primary text-primary px-md py-sm rounded-xl text-label-md hover:bg-white"
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            Editar
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-xs bg-energy-orange text-white px-md py-sm rounded-xl text-label-md shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            PDF
          </button>
        </div>
      </header>

      <main className="pt-20 pb-32 lg:pb-xl px-margin-mobile md:px-margin-desktop min-h-screen bg-surface">
        <article className="cv-print-area max-w-[1000px] mx-auto bg-white shadow-[0px_18px_60px_rgba(15,76,129,0.14)] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-outline-variant">
          <aside className="w-full md:w-[320px] bg-slate-200 p-xl flex flex-col gap-xl">
            <div className="flex justify-center">
              <div
                className="w-48 h-48 rounded-full border-4 border-white shadow-md overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url("${cv.photoUrl}")` }}
                aria-label={`Foto de ${cv.fullName}`}
              />
            </div>

            <section className="flex flex-col gap-lg">
              <SectionTitle>Contacto</SectionTitle>
              <div className="flex flex-col gap-md">
                <ContactItem icon="call" value={cv.phone} />
                <ContactItem icon="mail" value={cv.email} />
                <ContactItem icon="language" value={cv.website} />
                <ContactItem icon="location_on" value={cv.city} />
              </div>
            </section>

            <section className="flex flex-col gap-lg">
              <SectionTitle>Habilidades</SectionTitle>
              <ul className="flex flex-col gap-sm">
                {cv.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-body-md text-on-surface">{skill}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-lg">
              <SectionTitle>Educación y cursos</SectionTitle>
              <div className="flex flex-col gap-lg">
                {cv.education.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="print-avoid-break flex flex-col gap-xs"
                  >
                    <div className="flex items-start gap-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      <h3 className="text-label-md text-on-surface">{item.title}</h3>
                    </div>
                    <p className="text-body-sm ml-4">{item.institution}</p>
                    <p className="text-body-sm ml-4 text-on-surface-variant">{item.period}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <div className="flex-1 p-xl flex flex-col gap-xl">
            <header className="border-b-4 border-primary-container pb-lg">
              <h1 className="text-headline-lg-mobile md:text-display-lg text-primary-container leading-tight">
                {cv.fullName}
              </h1>
              <p className="text-headline-md text-on-surface-variant tracking-[0.18em] mt-sm uppercase opacity-80">
                {cv.headline}
              </p>
            </header>

            <section className="flex flex-col gap-lg">
              <SectionTitle>Acerca de mí</SectionTitle>
              <p className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {cv.about}
              </p>
            </section>

            <section className="flex flex-col gap-lg">
              <SectionTitle>Experiencia laboral</SectionTitle>
              <div className="flex flex-col gap-xl relative">
                <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-outline-variant" />
                {cv.experience.map((item, index) => (
                  <article
                    key={`${item.role}-${index}`}
                    className="print-avoid-break relative pl-8"
                  >
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-white shadow-sm" />
                    <div className="flex flex-col gap-sm">
                      <h3 className="text-[20px] leading-7 font-semibold text-primary uppercase">
                        {item.role}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-xs">
                        <span className="text-label-md text-on-surface">{item.company}</span>
                        <span className="text-label-md text-on-surface-variant">{item.period}</span>
                      </div>
                      <p className="text-body-md text-on-surface-variant italic leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>
      </main>

      <div className="no-print md:hidden fixed bottom-20 left-0 w-full px-margin-mobile pb-md z-40">
        <button
          onClick={() => window.print()}
          className="w-full bg-energy-orange text-white py-md rounded-2xl text-label-md flex justify-center items-center gap-xs shadow-lg shadow-orange-500/20 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">download</span>
          Descargar PDF
        </button>
      </div>
    </>
  );
}
