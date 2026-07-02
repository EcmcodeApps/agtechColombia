"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import TopAppBar from "@/app/_components/TopAppBar";
import { CV_STORAGE_KEY, CvData, DEFAULT_CV, lines } from "../_lib/cv-data";

const NAV = [
  { id: "personal", icon: "person", label: "Datos personales" },
  { id: "foto", icon: "photo_camera", label: "Foto" },
  { id: "perfil", icon: "history_edu", label: "Acerca de mí" },
  { id: "habilidades", icon: "psychology", label: "Habilidades" },
  { id: "educacion", icon: "school", label: "Educación y cursos" },
  { id: "experiencia", icon: "work", label: "Experiencia" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-xs ${className}`}>
      <span className="text-label-md text-on-surface-variant">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 px-md rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
      />
    </label>
  );
}

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white rounded-2xl p-lg border border-outline-variant shadow-[0px_4px_20px_rgba(15,76,129,0.05)]"
    >
      <div className="flex items-center gap-md mb-lg border-b border-outline-variant pb-md">
        <span className="material-symbols-outlined text-primary text-[32px]">{icon}</span>
        <h2 className="text-headline-md text-on-surface">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function CvEditorPage() {
  const [cv, setCv] = useState<CvData>(DEFAULT_CV);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [skillsText, setSkillsText] = useState(DEFAULT_CV.skills.join("\n"));

  useEffect(() => {
    window.setTimeout(() => {
      const stored = window.localStorage.getItem(CV_STORAGE_KEY);
      if (!stored) return;

      try {
        const parsed = JSON.parse(stored) as CvData;
        setCv(parsed);
        setSkillsText(parsed.skills.join("\n"));
      } catch {
        window.localStorage.removeItem(CV_STORAGE_KEY);
      }
    }, 0);
  }, []);

  function patch(data: Partial<CvData>) {
    setCv((current) => ({ ...current, ...data }));
  }

  function save() {
    const next = { ...cv, skills: lines(skillsText) };
    setCv(next);
    setSaveState("saving");
    window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(next));
    window.setTimeout(() => setSaveState("saved"), 600);
    window.setTimeout(() => setSaveState("idle"), 2200);
  }

  function readPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") patch({ photoUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function addEducation() {
    patch({
      education: [
        ...cv.education,
        { title: "", institution: "", period: "" },
      ],
    });
  }

  function removeEducation(index: number) {
    patch({ education: cv.education.filter((_, itemIndex) => itemIndex !== index) });
  }

  function addExperience() {
    patch({
      experience: [
        ...cv.experience,
        { role: "", company: "", period: "", description: "" },
      ],
    });
  }

  function removeExperience(index: number) {
    patch({ experience: cv.experience.filter((_, itemIndex) => itemIndex !== index) });
  }

  return (
    <>
      <TopAppBar
        userName={cv.fullName || "Candidato"}
        userType="Candidato"
        avatarUrl={DEFAULT_CV.photoUrl}
        hasNotification
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-32 lg:pb-xl">
        <div className="flex flex-col lg:flex-row gap-lg">
          <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-24 h-fit">
            <Link
              href="/cv"
              className="inline-flex items-center gap-xs text-primary text-label-md hover:underline mb-lg"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Volver a mi CV
            </Link>
            <nav className="bg-white border border-outline-variant rounded-2xl p-sm shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
              {NAV.map(({ id, icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="w-full flex items-center gap-sm text-left px-md py-sm rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[21px]">{icon}</span>
                  <span className="text-label-md">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 max-w-4xl mx-auto lg:mx-0 w-full space-y-lg">
            <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-xl">
              <div>
                <Link
                  href="/cv"
                  className="lg:hidden inline-flex items-center gap-xs text-primary text-label-md hover:underline mb-md"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  Volver a mi CV
                </Link>
                <p className="text-secondary text-label-md uppercase tracking-wider">
                  Formato CV con foto
                </p>
                <h1 className="mt-xs text-headline-lg-mobile md:text-headline-lg text-primary">
                  Crear hoja de vida
                </h1>
                <p className="mt-xs text-body-md text-on-surface-variant">
                  Ingresa tus datos y sube tu foto. La vista previa generará un CV con
                  sidebar, línea de tiempo y diseño listo para PDF.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-sm">
                <button
                  onClick={save}
                  className="inline-flex items-center justify-center gap-xs bg-primary text-white px-lg py-sm rounded-xl text-label-md hover:brightness-110 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {saveState === "saved" ? "check" : "save"}
                  </span>
                  {saveState === "saving" ? "Guardando..." : saveState === "saved" ? "Guardado" : "Guardar"}
                </button>
                <Link
                  href="/cv/preview"
                  className="inline-flex items-center justify-center gap-xs border border-primary text-primary px-lg py-sm rounded-xl text-label-md hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                  Ver resultado
                </Link>
              </div>
            </header>

            <Section id="personal" icon="account_circle" title="Datos personales">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <Field label="Nombre completo" value={cv.fullName} onChange={(fullName) => patch({ fullName })} placeholder="Ej: Carla Rodríguez" />
                <Field label="Cargo o título profesional" value={cv.headline} onChange={(headline) => patch({ headline })} placeholder="Ej: Lic. en Contabilidad" />
                <Field label="Teléfono" value={cv.phone} onChange={(phone) => patch({ phone })} placeholder="+57 300 123 4567" />
                <Field label="Correo electrónico" type="email" value={cv.email} onChange={(email) => patch({ email })} placeholder="correo@ejemplo.com" />
                <Field label="Sitio web o LinkedIn" value={cv.website} onChange={(website) => patch({ website })} placeholder="linkedin.com/in/usuario" />
                <Field label="Ciudad" value={cv.city} onChange={(city) => patch({ city })} placeholder="Bogotá, Colombia" />
              </div>
            </Section>

            <Section id="foto" icon="photo_camera" title="Foto profesional">
              <div className="flex flex-col md:flex-row md:items-center gap-lg">
                <div
                  className="w-40 h-40 rounded-full border-4 border-white shadow-md bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url("${cv.photoUrl}")` }}
                />
                <div className="flex-1">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-xs bg-primary text-white px-lg py-sm rounded-xl text-label-md hover:brightness-110 active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px]">upload</span>
                    Subir foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={readPhoto}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-sm text-body-sm text-on-surface-variant">
                    Usa una foto frontal, bien iluminada y con fondo limpio. Se guardará
                    localmente para esta vista previa.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="perfil" icon="history_edu" title="Acerca de mí">
              <textarea
                rows={5}
                value={cv.about}
                onChange={(event) => patch({ about: event.target.value })}
                className="w-full p-md rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-body-md"
                placeholder="Describe tu experiencia, fortalezas y objetivo profesional."
              />
            </Section>

            <Section id="habilidades" icon="psychology" title="Habilidades">
              <label className="flex flex-col gap-xs">
                <span className="text-label-md text-on-surface-variant">
                  Escribe una habilidad por línea
                </span>
                <textarea
                  rows={7}
                  value={skillsText}
                  onChange={(event) => setSkillsText(event.target.value)}
                  className="w-full p-md rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-body-md"
                  placeholder={"Liderazgo\nComunicación asertiva\nTrabajo en equipo"}
                />
              </label>
            </Section>

            <Section id="educacion" icon="school" title="Educación y cursos">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm mb-md">
                <p className="text-body-sm text-on-surface-variant">
                  Agrega estudios formales, diplomados, cursos, bootcamps y certificaciones.
                </p>
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center justify-center gap-xs text-secondary text-label-md hover:underline"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Añadir estudio
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {cv.education.map((item, index) => (
                  <div
                    key={index}
                    className="p-md rounded-2xl bg-surface-container-low border border-outline-variant space-y-sm"
                  >
                    <div className="flex items-center justify-between gap-sm">
                      <span className="text-label-sm text-on-surface-variant">
                        Registro {index + 1}
                      </span>
                      {cv.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="inline-flex items-center gap-xs text-error text-label-sm hover:underline"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                          Quitar
                        </button>
                      )}
                    </div>
                    <Field label="Título" value={item.title} onChange={(title) => {
                      const education = [...cv.education];
                      education[index] = { ...item, title };
                      patch({ education });
                    }} />
                    <Field label="Institución" value={item.institution} onChange={(institution) => {
                      const education = [...cv.education];
                      education[index] = { ...item, institution };
                      patch({ education });
                    }} />
                    <Field label="Periodo" value={item.period} onChange={(period) => {
                      const education = [...cv.education];
                      education[index] = { ...item, period };
                      patch({ education });
                    }} placeholder="2010 - 2014" />
                  </div>
                ))}
              </div>
            </Section>

            <Section id="experiencia" icon="work" title="Experiencia laboral">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm mb-md">
                <p className="text-body-sm text-on-surface-variant">
                  Añade todos tus empleos relevantes. El CV se extenderá si tu historia laboral es larga.
                </p>
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center justify-center gap-xs text-secondary text-label-md hover:underline"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  Añadir experiencia
                </button>
              </div>
              <div className="space-y-md">
                {cv.experience.map((item, index) => (
                  <div
                    key={index}
                    className="p-md rounded-2xl bg-surface-container-low border border-outline-variant space-y-md"
                  >
                    <div className="flex items-center justify-between gap-sm">
                      <span className="text-label-sm text-on-surface-variant">
                        Experiencia {index + 1}
                      </span>
                      {cv.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="inline-flex items-center gap-xs text-error text-label-sm hover:underline"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                          Quitar
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                      <Field label="Cargo o área" value={item.role} onChange={(role) => {
                        const experience = [...cv.experience];
                        experience[index] = { ...item, role };
                        patch({ experience });
                      }} />
                      <Field label="Empresa" value={item.company} onChange={(company) => {
                        const experience = [...cv.experience];
                        experience[index] = { ...item, company };
                        patch({ experience });
                      }} />
                      <Field label="Periodo" value={item.period} onChange={(period) => {
                        const experience = [...cv.experience];
                        experience[index] = { ...item, period };
                        patch({ experience });
                      }} placeholder="2014 - 2016" />
                    </div>
                    <label className="flex flex-col gap-xs">
                      <span className="text-label-md text-on-surface-variant">Descripción</span>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(event) => {
                          const experience = [...cv.experience];
                          experience[index] = { ...item, description: event.target.value };
                          patch({ experience });
                        }}
                        className="w-full p-md rounded-xl border border-outline-variant bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-body-md"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </main>

      <button
        onClick={save}
        className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-90"
        aria-label="Guardar cambios"
      >
        <span className="material-symbols-outlined">
          {saveState === "saved" ? "check" : "save"}
        </span>
      </button>
    </>
  );
}
