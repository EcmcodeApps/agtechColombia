"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { candidatosService } from "@/app/lib/firestore-service";
import type {
  ExperienciaLaboral,
  Educacion,
  Habilidad,
  Disponibilidad,
  VacanteModalidad,
} from "@/app/lib/types";

type Tab = "info" | "experiencia" | "educacion" | "habilidades" | "preferencias";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "info",         label: "Info",         icon: "person"     },
  { key: "experiencia",  label: "Experiencia",  icon: "work"       },
  { key: "educacion",    label: "Educación",    icon: "school"     },
  { key: "habilidades",  label: "Habilidades",  icon: "psychology" },
  { key: "preferencias", label: "Preferencias", icon: "tune"       },
];

const DISPONIBILIDAD_OPTS: { value: Disponibilidad; label: string }[] = [
  { value: "inmediata",  label: "Inmediata"      },
  { value: "15_dias",    label: "15 días"        },
  { value: "30_dias",    label: "30 días"        },
  { value: "mas_de_30",  label: "Más de 30 días" },
];

const MODALIDAD_OPTS: { value: VacanteModalidad | "indiferente"; label: string }[] = [
  { value: "presencial",  label: "Presencial"  },
  { value: "remoto",      label: "Remoto"      },
  { value: "hibrido",     label: "Híbrido"     },
  { value: "indiferente", label: "Indiferente" },
];

const NIVEL_OPTS = [
  { value: 25,  label: "Básico"     },
  { value: 50,  label: "Intermedio" },
  { value: 75,  label: "Avanzado"   },
  { value: 100, label: "Experto"    },
];

const BLANK_EXP: ExperienciaLaboral = {
  empresa: "", cargo: "", desde: "", hasta: "", actual: false, descripcion: "",
};
const BLANK_EDU: Educacion = {
  institucion: "", titulo: "", desde: "", hasta: "",
};

export default function PerfilCandidatoPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [tab,     setTab]     = useState<Tab>("info");
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Tab info
  const [nombre,   setNombre]   = useState("");
  const [titulo,   setTitulo]   = useState("");
  const [ciudad,   setCiudad]   = useState("");
  const [telefono, setTelefono] = useState("");
  const [resumen,  setResumen]  = useState("");

  // Tab experiencia
  const [experiencia, setExperiencia] = useState<ExperienciaLaboral[]>([]);
  const [addingExp,   setAddingExp]   = useState(false);
  const [newExp,      setNewExp]      = useState<ExperienciaLaboral>(BLANK_EXP);

  // Tab educación
  const [educacion, setEducacion] = useState<Educacion[]>([]);
  const [addingEdu, setAddingEdu] = useState(false);
  const [newEdu,    setNewEdu]    = useState<Educacion>(BLANK_EDU);

  // Tab habilidades
  const [habilidades,  setHabilidades]  = useState<Habilidad[]>([]);
  const [nuevoNombre,  setNuevoNombre]  = useState("");
  const [nuevoNivel,   setNuevoNivel]   = useState(50);

  // Tab preferencias
  const [disponibilidad,     setDisponibilidad]     = useState<Disponibilidad>("inmediata");
  const [salarioEsperado,    setSalarioEsperado]    = useState(0);
  const [modalidadPreferida, setModalidadPreferida] = useState<VacanteModalidad | "indiferente">("indiferente");

  useEffect(() => {
    if (!user) return;
    candidatosService.get(user.uid).then(c => {
      if (c) {
        setNombre(c.nombre ?? "");
        setTitulo(c.titulo ?? "");
        setCiudad(c.ciudad ?? "");
        setTelefono(c.telefono ?? "");
        setResumen(c.resumen ?? "");
        setExperiencia(c.experiencia ?? []);
        setEducacion(c.educacion ?? []);
        setHabilidades(c.habilidades ?? []);
        setDisponibilidad(c.disponibilidad ?? "inmediata");
        setSalarioEsperado(c.salarioEsperado ?? 0);
        setModalidadPreferida(c.modalidadPreferida ?? "indiferente");
        setProfileCompleted(c.profileCompleted ?? false);
      }
      setLoading(false);
    });
  }, [user]);

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const save = async (data: Record<string, unknown>) => {
    if (!user) return;
    setSaving(true);
    await candidatosService.update(user.uid, data as never);
    setSaving(false);
    flash();
  };

  const addExp = () => {
    if (!newExp.empresa || !newExp.cargo || !newExp.desde) return;
    setExperiencia(p => [...p, { ...newExp }]);
    setNewExp(BLANK_EXP);
    setAddingExp(false);
  };

  const addEdu = () => {
    if (!newEdu.institucion || !newEdu.titulo || !newEdu.desde) return;
    setEducacion(p => [...p, { ...newEdu }]);
    setNewEdu(BLANK_EDU);
    setAddingEdu(false);
  };

  const addHabilidad = () => {
    const n = nuevoNombre.trim();
    if (!n || habilidades.some(h => h.nombre.toLowerCase() === n.toLowerCase())) return;
    setHabilidades(p => [...p, { nombre: n, nivel: nuevoNivel }]);
    setNuevoNombre("");
    setNuevoNivel(50);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  const SaveBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      disabled={saving}
      className="w-full py-md rounded-2xl bg-primary text-white font-bold text-label-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-sm"
    >
      {saving
        ? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
        : <span className="material-symbols-outlined text-[20px]">save</span>}
      Guardar
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant/30 shadow-sm">
        <div className="h-16 flex items-center gap-md px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <div className="flex-1 min-w-0">
            <h1 className="text-headline-md font-bold text-primary truncate">Mi Perfil</h1>
            <p className="text-label-sm text-on-surface-variant">
              {profileCompleted ? "Perfil completo ✓" : "Completa tu perfil para mejores matches"}
            </p>
          </div>
          {saved && (
            <span className="flex items-center gap-xs text-brand-green text-label-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Guardado
            </span>
          )}
        </div>
      </header>

      {/* Tab bar */}
      <div className="fixed top-16 w-full z-40 bg-surface border-b border-outline-variant/30 overflow-x-auto scrollbar-none">
        <div className="flex px-margin-mobile">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-xs flex-shrink-0 px-md py-md text-label-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={tab === t.key ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mt-32 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pt-lg space-y-md">

        {/* ── INFO BÁSICA ─────────────────────────────────────────────────── */}
        {tab === "info" && (
          <>
            <div className="bg-white rounded-2xl border border-surface-container p-lg space-y-md">
              <h2 className="text-headline-sm font-bold text-on-surface">Información básica</h2>

              <label className="block">
                <span className="text-label-sm text-on-surface-variant mb-xs block">Nombre completo</span>
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tu nombre completo"
                />
              </label>

              <label className="block">
                <span className="text-label-sm text-on-surface-variant mb-xs block">Título profesional</span>
                <input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Técnico electromecánico · 4 años de experiencia"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <label className="block">
                  <span className="text-label-sm text-on-surface-variant mb-xs block">Ciudad</span>
                  <input
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                    className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Medellín"
                  />
                </label>
                <label className="block">
                  <span className="text-label-sm text-on-surface-variant mb-xs block">Teléfono</span>
                  <input
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+57 300 000 0000"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-label-sm text-on-surface-variant mb-xs block">Resumen profesional</span>
                <textarea
                  value={resumen}
                  onChange={e => setResumen(e.target.value)}
                  rows={4}
                  className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Cuéntale a las empresas quién eres, tu experiencia y qué tipo de trabajo buscas."
                />
              </label>
            </div>
            <SaveBtn onClick={() => save({ nombre, titulo, ciudad, telefono, resumen })} />
          </>
        )}

        {/* ── EXPERIENCIA ─────────────────────────────────────────────────── */}
        {tab === "experiencia" && (
          <>
            {experiencia.map((exp, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-surface-container p-lg">
                <div className="flex items-start justify-between gap-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-bold text-on-surface">{exp.cargo}</p>
                    <p className="text-body-sm text-on-surface-variant">{exp.empresa}</p>
                    <p className="text-label-sm text-outline mt-xs">
                      {exp.desde} → {exp.actual ? "Actual" : exp.hasta}
                    </p>
                    {exp.descripcion && (
                      <p className="text-body-sm text-on-surface-variant mt-sm leading-relaxed">{exp.descripcion}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setExperiencia(p => p.filter((_, i) => i !== idx))}
                    className="text-on-surface-variant hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {experiencia.length === 0 && !addingExp && (
              <div className="bg-white rounded-2xl border border-surface-container p-2xl text-center">
                <span className="material-symbols-outlined text-outline text-[48px] block mb-md">work_history</span>
                <p className="text-body-md text-on-surface-variant">Sin experiencia registrada aún.</p>
              </div>
            )}

            {addingExp ? (
              <div className="bg-white rounded-2xl border-2 border-primary/30 p-lg space-y-md">
                <h3 className="text-label-md font-bold text-primary">Nueva experiencia</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Empresa *</span>
                    <input
                      value={newExp.empresa}
                      onChange={e => setNewExp(p => ({ ...p, empresa: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Empresa S.A.S"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Cargo *</span>
                    <input
                      value={newExp.cargo}
                      onChange={e => setNewExp(p => ({ ...p, cargo: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Analista de sistemas"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Desde *</span>
                    <input
                      type="month"
                      value={newExp.desde}
                      onChange={e => setNewExp(p => ({ ...p, desde: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </label>
                  <div>
                    <label className="block">
                      <span className="text-label-sm text-on-surface-variant mb-xs block">Hasta</span>
                      <input
                        type="month"
                        value={newExp.hasta}
                        onChange={e => setNewExp(p => ({ ...p, hasta: e.target.value }))}
                        disabled={newExp.actual}
                        className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40"
                      />
                    </label>
                    <label className="flex items-center gap-xs mt-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newExp.actual}
                        onChange={e => setNewExp(p => ({ ...p, actual: e.target.checked, hasta: "" }))}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-label-sm text-on-surface-variant">Trabajo actual</span>
                    </label>
                  </div>
                </div>
                <label className="block">
                  <span className="text-label-sm text-on-surface-variant mb-xs block">Descripción (opcional)</span>
                  <textarea
                    value={newExp.descripcion}
                    onChange={e => setNewExp(p => ({ ...p, descripcion: e.target.value }))}
                    rows={2}
                    className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Logros o responsabilidades clave..."
                  />
                </label>
                <div className="flex gap-md">
                  <button
                    onClick={addExp}
                    className="flex-1 py-sm rounded-xl bg-primary text-white font-bold text-label-md hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => { setAddingExp(false); setNewExp(BLANK_EXP); }}
                    className="px-lg py-sm rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container active:scale-[0.98] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingExp(true)}
                className="w-full py-md rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant text-label-md hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">add</span>
                Agregar experiencia
              </button>
            )}

            <SaveBtn onClick={() => save({ experiencia })} />
          </>
        )}

        {/* ── EDUCACIÓN ───────────────────────────────────────────────────── */}
        {tab === "educacion" && (
          <>
            {educacion.map((edu, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-surface-container p-lg">
                <div className="flex items-start justify-between gap-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-bold text-on-surface">{edu.titulo}</p>
                    <p className="text-body-sm text-on-surface-variant">{edu.institucion}</p>
                    <p className="text-label-sm text-outline mt-xs">{edu.desde} – {edu.hasta}</p>
                  </div>
                  <button
                    onClick={() => setEducacion(p => p.filter((_, i) => i !== idx))}
                    className="text-on-surface-variant hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {educacion.length === 0 && !addingEdu && (
              <div className="bg-white rounded-2xl border border-surface-container p-2xl text-center">
                <span className="material-symbols-outlined text-outline text-[48px] block mb-md">school</span>
                <p className="text-body-md text-on-surface-variant">Sin formación registrada aún.</p>
              </div>
            )}

            {addingEdu ? (
              <div className="bg-white rounded-2xl border-2 border-primary/30 p-lg space-y-md">
                <h3 className="text-label-md font-bold text-primary">Nueva formación</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Institución *</span>
                    <input
                      value={newEdu.institucion}
                      onChange={e => setNewEdu(p => ({ ...p, institucion: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Universidad Nacional"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Título / Carrera *</span>
                    <input
                      value={newEdu.titulo}
                      onChange={e => setNewEdu(p => ({ ...p, titulo: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ingeniería Industrial"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Desde (año) *</span>
                    <input
                      type="number"
                      min={1980}
                      max={2030}
                      value={newEdu.desde}
                      onChange={e => setNewEdu(p => ({ ...p, desde: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="2019"
                    />
                  </label>
                  <label className="block">
                    <span className="text-label-sm text-on-surface-variant mb-xs block">Hasta (año)</span>
                    <input
                      type="number"
                      min={1980}
                      max={2030}
                      value={newEdu.hasta}
                      onChange={e => setNewEdu(p => ({ ...p, hasta: e.target.value }))}
                      className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="2024 ó en curso"
                    />
                  </label>
                </div>
                <div className="flex gap-md">
                  <button
                    onClick={addEdu}
                    className="flex-1 py-sm rounded-xl bg-primary text-white font-bold text-label-md hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => { setAddingEdu(false); setNewEdu(BLANK_EDU); }}
                    className="px-lg py-sm rounded-xl border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container active:scale-[0.98] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingEdu(true)}
                className="w-full py-md rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant text-label-md hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">add</span>
                Agregar formación
              </button>
            )}

            <SaveBtn onClick={() => save({ educacion })} />
          </>
        )}

        {/* ── HABILIDADES ─────────────────────────────────────────────────── */}
        {tab === "habilidades" && (
          <>
            <div className="bg-white rounded-2xl border border-surface-container p-lg space-y-md">
              <h2 className="text-headline-sm font-bold text-on-surface">Mis habilidades</h2>

              {habilidades.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant text-center py-lg">
                  Agrega habilidades para mejorar el puntaje de tus matches.
                </p>
              ) : (
                <div className="space-y-md">
                  {habilidades.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-md">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-xs">
                          <span className="text-label-sm font-semibold text-on-surface truncate">{h.nombre}</span>
                          <span className="text-label-sm text-on-surface-variant ml-sm flex-shrink-0">
                            {NIVEL_OPTS.find(n => n.value === h.nivel)?.label ?? "Experto"}
                          </span>
                        </div>
                        <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${h.nivel}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setHabilidades(p => p.filter((_, i) => i !== idx))}
                        className="text-on-surface-variant hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-md border-t border-outline-variant/30">
                <p className="text-label-sm text-on-surface-variant mb-sm">Agregar habilidad</p>
                <div className="flex gap-sm">
                  <input
                    value={nuevoNombre}
                    onChange={e => setNuevoNombre(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addHabilidad()}
                    className="flex-1 border border-outline-variant rounded-xl px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                    placeholder="Excel, Liderazgo..."
                  />
                  <select
                    value={nuevoNivel}
                    onChange={e => setNuevoNivel(Number(e.target.value))}
                    className="border border-outline-variant rounded-xl px-sm py-sm text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0"
                  >
                    {NIVEL_OPTS.map(n => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={addHabilidad}
                    className="px-md py-sm rounded-xl bg-primary text-white text-label-md hover:opacity-90 active:scale-[0.98] transition-all flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            </div>

            <SaveBtn onClick={() => save({ habilidades })} />
          </>
        )}

        {/* ── PREFERENCIAS ────────────────────────────────────────────────── */}
        {tab === "preferencias" && (
          <>
            <div className="bg-white rounded-2xl border border-surface-container p-lg space-y-lg">
              <h2 className="text-headline-sm font-bold text-on-surface">Preferencias laborales</h2>

              <label className="block">
                <span className="text-label-sm text-on-surface-variant mb-xs block">Disponibilidad para empezar</span>
                <select
                  value={disponibilidad}
                  onChange={e => setDisponibilidad(e.target.value as Disponibilidad)}
                  className="w-full border border-outline-variant rounded-xl px-md py-sm text-body-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DISPONIBILIDAD_OPTS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-label-sm text-on-surface-variant mb-xs block">
                  Aspiración salarial mensual (COP)
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                  <input
                    type="number"
                    value={salarioEsperado || ""}
                    onChange={e => setSalarioEsperado(Number(e.target.value))}
                    className="w-full border border-outline-variant rounded-xl pl-7 pr-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="2500000"
                    min={0}
                    step={100000}
                  />
                </div>
                {salarioEsperado > 0 && (
                  <p className="text-label-sm text-on-surface-variant mt-xs">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(salarioEsperado)} / mes
                  </p>
                )}
              </label>

              <div>
                <span className="text-label-sm text-on-surface-variant mb-sm block">Modalidad preferida</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                  {MODALIDAD_OPTS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => setModalidadPreferida(o.value)}
                      className={`py-sm px-md rounded-xl border text-label-sm font-semibold transition-all ${
                        modalidadPreferida === o.value
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <SaveBtn onClick={() => save({ disponibilidad, salarioEsperado, modalidadPreferida, profileCompleted: true })} />
          </>
        )}
      </main>
    </div>
  );
}
