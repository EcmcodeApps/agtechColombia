"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import TopAppBarForm from "@/app/_components/TopAppBarForm";

// ── Constantes ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "ventas",        label: "Ventas y Comercial"      },
  { value: "gastronomia",   label: "Gastronomía y Turismo"   },
  { value: "logistica",     label: "Logística y Bodega"      },
  { value: "administrativo",label: "Administrativo"           },
  { value: "servicios",     label: "Servicios Generales"     },
  { value: "tecnologia",    label: "Tecnología"               },
  { value: "manufactura",   label: "Manufactura e Industria" },
  { value: "salud",         label: "Salud y Bienestar"       },
];

const CIUDADES = [
  "Bogotá","Medellín","Cali","Barranquilla","Cartagena",
  "Bucaramanga","Pereira","Manizales","Ibagué","Santa Marta",
];

const EDUCATION = [
  "Primaria completa","Bachiller","Técnico / Tecnólogo",
  "Universitario","Especialización / Maestría",
];

const EXPERIENCE = [
  "Sin experiencia","Menos de 1 año","1 a 2 años","3 a 5 años","Más de 5 años",
];

const MODALIDADES = ["Presencial","Remoto","Híbrido"];

const CONTRATOS = ["Indefinido","Término fijo","Obra o labor","Prestación de servicios"];

const JORNADAS = ["Tiempo completo","Medio tiempo","Por horas","Turnos rotativos"];

const SKILLS_PREDEFINIDAS = [
  "Atención al Cliente","Ventas B2C","Manejo de Inventario",
  "Liderazgo de Equipos","Excel Básico","Comunicación Asertiva",
  "Trabajo en equipo","Resolución de problemas","Servicio al cliente","Gestión de tiempo",
];

const BENEFICIOS_PRED = [
  { icon: "restaurant",      label: "Casino / Alimentación"   },
  { icon: "directions_bus",  label: "Ruta de transporte"       },
  { icon: "local_hospital",  label: "Medicina prepagada"       },
  { icon: "star",            label: "Prima extralegal"         },
  { icon: "fitness_center",  label: "Gym / bienestar"          },
  { icon: "school",          label: "Educación / convenios"    },
  { icon: "home",            label: "Teletrabajo parcial"      },
  { icon: "card_giftcard",   label: "Bonificaciones"           },
];

// ── Datos demo pre-cargados ────────────────────────────────────────────────────
// TODO: fetch desde Firestore usando params.id
const DEMO: {
  titulo: string; categoria: string; ciudad: string; descripcion: string;
  educacion: string; experiencia: string; salarioMin: string; salarioMax: string;
  ocultarSalario: boolean; modalidad: string; contrato: string; jornada: string;
  skills: string[]; beneficios: string[]; estado: "activa" | "pausada" | "cerrada";
  postulaciones: number; vistas: number;
} = {
  titulo:        "Técnico Electromecánico Senior",
  categoria:     "manufactura",
  ciudad:        "Medellín",
  descripcion:   "Buscamos un Técnico Electromecánico Senior para liderar el equipo de mantenimiento en nuestra planta principal. Serás responsable de garantizar la operatividad de maquinaria industrial compleja y coordinar planes de mantenimiento preventivo y correctivo.",
  educacion:     "Técnico / Tecnólogo",
  experiencia:   "3 a 5 años",
  salarioMin:    "2500000",
  salarioMax:    "3200000",
  ocultarSalario:false,
  modalidad:     "Presencial",
  contrato:      "Indefinido",
  jornada:       "Tiempo completo",
  skills:        ["Atención al Cliente","Liderazgo de Equipos"],
  beneficios:    ["Casino / Alimentación","Ruta de transporte","Prima extralegal"],
  estado:        "activa",
  postulaciones: 18,
  vistas:        142,
};

// ── Tipos ─────────────────────────────────────────────────────────────────────
type SaveState  = "idle" | "saving" | "saved";
type Status     = "activa" | "pausada" | "cerrada";

// ── Helpers de estilo ─────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl " +
  "h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary " +
  "focus:border-transparent transition-all placeholder:text-outline";
const selectCls =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl " +
  "h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary " +
  "focus:border-transparent transition-all appearance-none cursor-pointer";
const sectionCard = "bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] p-xl";

// ── Chip seleccionable ─────────────────────────────────────────────────────────
function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={`px-sm py-xs rounded-full text-body-sm border transition-all active:scale-95 ${
        selected
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
      }`}>
      {selected && <span className="material-symbols-outlined text-[13px] align-middle mr-[2px]">check</span>}
      {label}
    </button>
  );
}

// ── Sección del formulario ─────────────────────────────────────────────────────
function FormSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className={sectionCard}>
      <div className="flex items-center gap-md mb-xl">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        </div>
        <h2 className="text-headline-md text-on-surface">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function EditarVacantePage() {
  const router  = useRouter();
  const params  = useParams();

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [titulo,         setTitulo]         = useState(DEMO.titulo);
  const [categoria,      setCategoria]      = useState(DEMO.categoria);
  const [ciudad,         setCiudad]         = useState(DEMO.ciudad);
  const [descripcion,    setDescripcion]    = useState(DEMO.descripcion);
  const [educacion,      setEducacion]      = useState(DEMO.educacion);
  const [experiencia,    setExperiencia]    = useState(DEMO.experiencia);
  const [salarioMin,     setSalarioMin]     = useState(DEMO.salarioMin);
  const [salarioMax,     setSalarioMax]     = useState(DEMO.salarioMax);
  const [ocultarSalario, setOcultarSalario] = useState(DEMO.ocultarSalario);
  const [modalidad,      setModalidad]      = useState(DEMO.modalidad);
  const [contrato,       setContrato]       = useState(DEMO.contrato);
  const [jornada,        setJornada]        = useState(DEMO.jornada);
  const [skills,         setSkills]         = useState<string[]>(DEMO.skills);
  const [beneficios,     setBeneficios]     = useState<string[]>(DEMO.beneficios);
  const [estado,         setEstado]         = useState<Status>(DEMO.estado);
  const [customSkill,    setCustomSkill]    = useState("");

  // ── UI state ──────────────────────────────────────────────────────────────
  const [saveState,      setSaveState]      = useState<SaveState>("idle");
  const [showDelete,     setShowDelete]     = useState(false);
  const [deleteInput,    setDeleteInput]    = useState("");

  // ── Helpers ───────────────────────────────────────────────────────────────
  const toggleSkill = (s: string) =>
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const toggleBeneficio = (b: string) =>
    setBeneficios(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); }
    setCustomSkill("");
  };

  const canSave = !!titulo && !!categoria && !!ciudad && descripcion.length >= 20;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || saveState !== "idle") return;
    setSaveState("saving");
    // TODO: Firestore — update vacancy doc
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 3000);
    }, 1400);
  };

  const handleToggleEstado = () =>
    setEstado(prev => prev === "activa" ? "pausada" : "activa");

  // ── Badge de estado ───────────────────────────────────────────────────────
  const estadoBadge = {
    activa:  { label: "Activa",  color: "bg-brand-green/10 text-brand-green",   dot: "bg-brand-green"  },
    pausada: { label: "Pausada", color: "bg-[#FF9800]/10 text-[#FF9800]",       dot: "bg-[#FF9800]"    },
    cerrada: { label: "Cerrada", color: "bg-error/10 text-error",               dot: "bg-error"        },
  }[estado];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <TopAppBarForm rightAction="close" />

      <main className="pt-20 pb-24 px-margin-mobile md:px-margin-desktop max-w-[860px] mx-auto w-full">

        {/* ── Header de la página ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-md mb-xl">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-xs text-on-surface-variant text-label-sm mb-sm">
              <Link href="/vacantes" className="hover:text-primary transition-colors">Mis vacantes</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold truncate" style={{ maxWidth: 240 }}>{titulo}</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface-variant">Editar</span>
            </nav>
            <h1 className="text-headline-lg text-primary">Editar vacante</h1>
            <p className="text-body-sm text-on-surface-variant mt-xs">ID: #{params.id ?? "demo"}</p>
          </div>

          {/* Stats + estado */}
          <div className="flex items-center gap-md flex-shrink-0 flex-wrap">
            <div className="flex items-center gap-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span className="text-label-md">{DEMO.vistas} vistas</span>
            </div>
            <div className="flex items-center gap-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span className="text-label-md">{DEMO.postulaciones} postulaciones</span>
            </div>
            <span className={`flex items-center gap-xs px-sm py-xs rounded-full text-label-sm font-semibold ${estadoBadge.color}`}>
              <span className={`w-2 h-2 rounded-full ${estadoBadge.dot}`} />
              {estadoBadge.label}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-lg">

          {/* ── 1. Información general ───────────────────────────────────── */}
          <FormSection icon="edit_note" title="Información general">
            <div className="space-y-lg">
              {/* Título */}
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface">Título del cargo <span className="text-energy-orange">*</span></label>
                <input className={inputCls} value={titulo} onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej: Administrador de Tienda, Repostero..." />
                <p className="text-label-sm text-on-surface-variant">Un buen título recibe 3× más postulaciones.</p>
              </div>

              {/* Categoría + Ciudad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Categoría <span className="text-energy-orange">*</span></label>
                  <div className="relative">
                    <select className={selectCls} value={categoria} onChange={e => setCategoria(e.target.value)}>
                      <option value="">Selecciona una categoría</option>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Ciudad <span className="text-energy-orange">*</span></label>
                  <div className="relative">
                    <select className={selectCls} value={ciudad} onChange={e => setCiudad(e.target.value)}>
                      <option value="">Selecciona una ciudad</option>
                      {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface">Descripción del cargo <span className="text-energy-orange">*</span></label>
                <textarea
                  className={`${inputCls} h-auto py-sm resize-none`}
                  rows={5}
                  maxLength={600}
                  placeholder="Describe las responsabilidades, el ambiente de trabajo y lo que hace especial esta posición..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className={`text-label-sm ${descripcion.length >= 20 ? "text-brand-green" : "text-on-surface-variant"}`}>
                    {descripcion.length < 20
                      ? `Mínimo 20 caracteres (faltan ${20 - descripcion.length})`
                      : "Longitud correcta ✓"}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">{descripcion.length}/600</p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── 2. Requisitos ───────────────────────────────────────────── */}
          <FormSection icon="checklist" title="Requisitos">
            <div className="space-y-lg">
              {/* Educación + Experiencia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Nivel de educación</label>
                  <div className="relative">
                    <select className={selectCls} value={educacion} onChange={e => setEducacion(e.target.value)}>
                      <option value="">Selecciona...</option>
                      {EDUCATION.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Experiencia requerida</label>
                  <div className="relative">
                    <select className={selectCls} value={experiencia} onChange={e => setExperiencia(e.target.value)}>
                      <option value="">Selecciona...</option>
                      {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Salario */}
              <div className="space-y-sm">
                <label className="text-label-md text-on-surface">Rango salarial (COP)</label>
                <div className="flex items-center gap-md">
                  <div className="flex-1 relative">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-body-sm pointer-events-none">$</span>
                    <input
                      className={`${inputCls} pl-[28px]`}
                      type="number"
                      placeholder="Mínimo"
                      value={salarioMin}
                      onChange={e => setSalarioMin(e.target.value)}
                      disabled={ocultarSalario}
                    />
                  </div>
                  <span className="text-on-surface-variant text-body-sm flex-shrink-0">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-body-sm pointer-events-none">$</span>
                    <input
                      className={`${inputCls} pl-[28px]`}
                      type="number"
                      placeholder="Máximo"
                      value={salarioMax}
                      onChange={e => setSalarioMax(e.target.value)}
                      disabled={ocultarSalario}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-sm cursor-pointer">
                  <input type="checkbox" checked={ocultarSalario}
                    onChange={e => setOcultarSalario(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer" />
                  <span className="text-body-sm text-on-surface-variant">Ocultar salario (mostrar "A convenir")</span>
                </label>
              </div>

              {/* Habilidades */}
              <div className="space-y-sm">
                <label className="text-label-md text-on-surface">Habilidades requeridas</label>
                <div className="flex flex-wrap gap-sm">
                  {SKILLS_PREDEFINIDAS.map(s => (
                    <Chip key={s} label={s} selected={skills.includes(s)} onToggle={() => toggleSkill(s)} />
                  ))}
                </div>
                {/* Skills personalizadas */}
                {skills.filter(s => !SKILLS_PREDEFINIDAS.includes(s)).map(s => (
                  <Chip key={s} label={s} selected onToggle={() => toggleSkill(s)} />
                ))}
                {/* Input agregar custom */}
                <div className="flex gap-sm mt-sm">
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="Agregar habilidad personalizada..."
                    value={customSkill}
                    onChange={e => setCustomSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); }}}
                  />
                  <button type="button" onClick={addCustomSkill}
                    disabled={!customSkill.trim()}
                    className="px-md bg-surface-container-high border border-outline-variant rounded-xl text-label-md text-on-surface hover:bg-surface-container-highest disabled:opacity-40 transition-colors flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── 3. Condiciones laborales ─────────────────────────────────── */}
          <FormSection icon="work_history" title="Condiciones laborales">
            <div className="space-y-lg">
              {/* Modalidad */}
              <div className="space-y-sm">
                <label className="text-label-md text-on-surface">Modalidad</label>
                <div className="grid grid-cols-3 gap-sm">
                  {MODALIDADES.map(m => (
                    <button key={m} type="button" onClick={() => setModalidad(m)}
                      className={`py-md rounded-xl border-2 text-label-md transition-all active:scale-95 ${
                        modalidad === m
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                      }`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrato + Jornada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Tipo de contrato</label>
                  <div className="relative">
                    <select className={selectCls} value={contrato} onChange={e => setContrato(e.target.value)}>
                      {CONTRATOS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface">Jornada laboral</label>
                  <div className="relative">
                    <select className={selectCls} value={jornada} onChange={e => setJornada(e.target.value)}>
                      {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div className="space-y-sm">
                <label className="text-label-md text-on-surface">Beneficios</label>
                <p className="text-body-sm text-on-surface-variant">Las vacantes con beneficios reciben 2× más postulaciones.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                  {BENEFICIOS_PRED.map(({ icon, label }) => (
                    <button key={label} type="button" onClick={() => toggleBeneficio(label)}
                      className={`flex flex-col items-center gap-xs p-md rounded-xl border-2 transition-all text-center active:scale-95 ${
                        beneficios.includes(label)
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                      }`}>
                      <span className="material-symbols-outlined text-[22px]">{icon}</span>
                      <span className="text-label-sm leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FormSection>

          {/* ── 4. Estado de la vacante ──────────────────────────────────── */}
          <FormSection icon="toggle_on" title="Estado de la publicación">
            <div className="space-y-md">
              <p className="text-body-sm text-on-surface-variant">
                Controla si tu vacante es visible para los candidatos en este momento.
              </p>
              <div className="flex flex-col sm:flex-row gap-sm">
                {(["activa","pausada"] as Exclude<Status,"cerrada">[]).map(s => {
                  const CFG = {
                    activa:  { icon: "play_circle",  label: "Activa",  sub: "Visible para candidatos",  sel: "border-brand-green bg-brand-green/5 text-brand-green" },
                    pausada: { icon: "pause_circle", label: "Pausada", sub: "No recibe postulaciones",   sel: "border-[#FF9800] bg-[#FF9800]/5 text-[#FF9800]"       },
                  } as const;
                  const cfg = CFG[s];
                  return (
                    <button key={s} type="button" onClick={() => setEstado(s)}
                      className={`flex-1 flex items-center gap-md p-md rounded-xl border-2 transition-all text-left ${
                        estado === s ? cfg.sel : "border-outline-variant text-on-surface-variant hover:border-outline"
                      }`}>
                      <span className={`material-symbols-outlined text-[28px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                      <div>
                        <p className="text-label-md font-semibold">{cfg.label}</p>
                        <p className="text-body-sm">{cfg.sub}</p>
                      </div>
                      {estado === s && (
                        <span className="ml-auto material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </FormSection>

          {/* ── Botones de acción ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-md justify-between items-start pt-md">
            {/* Zona de peligro — eliminar */}
            <div>
              {!showDelete ? (
                <button type="button" onClick={() => setShowDelete(true)}
                  className="flex items-center gap-xs text-error text-label-sm hover:underline transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Eliminar vacante
                </button>
              ) : (
                <div className="bg-error/5 border border-error/30 rounded-xl p-md space-y-sm" style={{ maxWidth: 320 }}>
                  <p className="text-label-md text-error">¿Eliminar esta vacante?</p>
                  <p className="text-body-sm text-on-surface-variant">Esta acción es permanente. Se perderán las {DEMO.postulaciones} postulaciones registradas.</p>
                  <input
                    className={`${inputCls} border-error/40 focus:ring-error font-mono tracking-widest text-center`}
                    placeholder="Escribe ELIMINAR"
                    value={deleteInput}
                    onChange={e => setDeleteInput(e.target.value.toUpperCase())}
                  />
                  <div className="flex gap-sm">
                    <button type="button" onClick={() => { setShowDelete(false); setDeleteInput(""); }}
                      className="flex-1 border border-outline-variant text-on-surface-variant py-sm rounded-xl text-label-md hover:bg-surface-container transition-colors">
                      Cancelar
                    </button>
                    <button type="button" disabled={deleteInput !== "ELIMINAR"}
                      className="flex-1 bg-error text-white py-sm rounded-xl text-label-md font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all">
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Guardar */}
            <div className="flex gap-md sm:ml-auto">
              <Link href={`/vacantes/${params.id ?? "demo"}`}
                className="px-xl py-md border border-outline-variant text-on-surface-variant rounded-xl text-label-md font-bold hover:bg-surface-container transition-colors">
                Cancelar
              </Link>
              <button type="submit" disabled={!canSave || saveState !== "idle"}
                className="px-xl py-md bg-energy-orange text-white rounded-xl text-label-md font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm">
                {saveState === "saving" ? (
                  <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span>Guardando...</>
                ) : saveState === "saved" ? (
                  <><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>¡Cambios guardados!</>
                ) : (
                  <><span className="material-symbols-outlined text-[20px]">save</span>Guardar cambios</>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
