"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllCompanies, type CompanyRecord } from "@/lib/firebase/firestore";

/* ── Helpers para leer campos legacy o planos ────────────────────────────── */
const g = (c: CompanyRecord) => ({
  nombreComercial : c.nombreComercial  || c.step1?.nombreComercial  || c.nombre          || "",
  razonSocial     : c.razonSocial      || c.step1?.razonSocial      || "",
  nit             : c.nit              || c.step1?.nit              || "",
  anioFundacion   : c.anioFundacion    || c.step1?.anioFundacion    || "",
  departamento    : c.departamento     || c.step1?.departamento     || "",
  ciudad          : c.ciudad          || c.step1?.ciudad           || "",
  tamano          : c.tamano           || c.step1?.tamano           || "",
  categorias      : (c.categorias      || c.step1?.categorias       || []).join(", "),
  cultivos        : (c.cultivos        || c.step3?.cultivos         || []).join(", "),
  zonas           : (c.zonas           || c.step3?.zonas            || []).join(", "),
  sitioWeb        : c.sitioWeb         || c.step1?.sitioWeb         || "",
  pitchCorto      : c.pitchCorto       || c.step3?.pitchCorto       || c.descripcion      || "",
  descripcion     : c.descripcionCompleta || c.step3?.descripcionCompleta || "",
  contactoNombre  : c.contacto?.nombre || c.step2?.nombre           || "",
  contactoCargo   : c.contacto?.cargo  || c.step2?.cargo            || "",
  contactoCorreo  : c.contacto?.correo || c.step2?.correo           || "",
  contactoWhatsapp: c.contacto?.whatsapp || c.step2?.whatsapp       || "",
  contactoLinkedin: c.contacto?.linkedin || c.step2?.linkedin       || "",
  redInstagram    : c.redes?.instagram || c.step3?.redes?.instagram || "",
  redFacebook     : c.redes?.facebook  || c.step3?.redes?.facebook  || "",
  plan            : c.plan             || "gratuito",
  activa          : c.activa ? "Sí" : "No",
  visitas         : c.visitas          || 0,
});

/* ── Definición de columnas disponibles ─────────────────────────────────── */
interface ColDef { key: string; label: string; group: string; }
const COLS: ColDef[] = [
  // Identificación
  { key:"nombreComercial",  label:"Nombre Comercial",     group:"Identificación" },
  { key:"razonSocial",      label:"Razón Social",         group:"Identificación" },
  { key:"nit",              label:"NIT",                  group:"Identificación" },
  { key:"anioFundacion",    label:"Año Fundación",        group:"Identificación" },
  // Ubicación
  { key:"departamento",     label:"Departamento",         group:"Ubicación"      },
  { key:"ciudad",           label:"Ciudad",               group:"Ubicación"      },
  // Clasificación
  { key:"categorias",       label:"Categorías",           group:"Clasificación"  },
  { key:"cultivos",         label:"Cultivos / Sectores",  group:"Clasificación"  },
  { key:"zonas",            label:"Zonas de operación",   group:"Clasificación"  },
  { key:"tamano",           label:"Tamaño empresa",       group:"Clasificación"  },
  // Descripción
  { key:"pitchCorto",       label:"Pitch corto",          group:"Descripción"    },
  { key:"descripcion",      label:"Descripción completa", group:"Descripción"    },
  // Contacto
  { key:"contactoNombre",   label:"Contacto – Nombre",    group:"Contacto"       },
  { key:"contactoCargo",    label:"Contacto – Cargo",     group:"Contacto"       },
  { key:"contactoCorreo",   label:"Contacto – Correo",    group:"Contacto"       },
  { key:"contactoWhatsapp", label:"Contacto – WhatsApp",  group:"Contacto"       },
  { key:"contactoLinkedin", label:"Contacto – LinkedIn",  group:"Contacto"       },
  { key:"sitioWeb",         label:"Sitio web",            group:"Contacto"       },
  // Redes sociales
  { key:"redInstagram",     label:"Instagram",            group:"Redes Sociales" },
  { key:"redFacebook",      label:"Facebook",             group:"Redes Sociales" },
  // Plataforma
  { key:"plan",             label:"Plan",                 group:"Plataforma"     },
  { key:"activa",           label:"Estado (activa)",      group:"Plataforma"     },
  { key:"visitas",          label:"Visitas al perfil",    group:"Plataforma"     },
];

/* ── Perfiles predefinidos ───────────────────────────────────────────────── */
interface Perfil { id: string; label: string; icon: string; desc: string; cols: string[]; }
const PERFILES: Perfil[] = [
  {
    id:"completo", icon:"📋", label:"Completo",
    desc:"Toda la información disponible de cada empresa.",
    cols: COLS.map(c => c.key),
  },
  {
    id:"inversionistas", icon:"💼", label:"Para Inversionistas",
    desc:"Nombre, categoría, ubicación, tamaño, pitch y web.",
    cols: ["nombreComercial","categorias","departamento","ciudad","tamano","anioFundacion","pitchCorto","sitioWeb"],
  },
  {
    id:"directorio", icon:"📖", label:"Directorio Básico",
    desc:"Datos esenciales: nombre, NIT, ciudad, plan y estado.",
    cols: ["nombreComercial","razonSocial","nit","departamento","ciudad","plan","activa"],
  },
  {
    id:"contactos", icon:"📞", label:"Directorio de Contactos",
    desc:"Información de contacto para comunicaciones.",
    cols: ["nombreComercial","contactoNombre","contactoCargo","contactoCorreo","contactoWhatsapp","sitioWeb","redInstagram"],
  },
  {
    id:"estadistico", icon:"📊", label:"Análisis Estadístico",
    desc:"Para análisis de mercado y estadísticas del sector.",
    cols: ["nombreComercial","departamento","ciudad","categorias","tamano","anioFundacion","cultivos","zonas","plan","visitas"],
  },
];

/* ── Grupos únicos ───────────────────────────────────────────────────────── */
const GRUPOS = [...new Set(COLS.map(c => c.group))];

/* ── Componente principal ────────────────────────────────────────────────── */
export default function AdminExportarPage() {
  const [companies,   setCompanies]   = useState<CompanyRecord[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [exporting,   setExporting]   = useState(false);

  // Filtros de filas
  const [filtroEstado,   setFiltroEstado]   = useState<"todos"|"activa"|"inactiva">("todos");
  const [filtroPlan,     setFiltroPlan]     = useState("todos");
  const [filtroDept,     setFiltroDept]     = useState("todos");
  const [filtroCat,      setFiltroCat]      = useState("todos");

  // Columnas seleccionadas
  const [colsSelec, setColsSelec] = useState<Set<string>>(new Set(PERFILES[0].cols));
  const [perfilActivo, setPerfilActivo] = useState("completo");

  useEffect(() => {
    getAllCompanies().then(c => { setCompanies(c); setLoading(false); });
  }, []);

  // Departamentos y categorías únicas para filtros
  const departamentos = useMemo(() => {
    const s = new Set(companies.map(c => c.departamento || c.step1?.departamento || "").filter(Boolean));
    return [...s].sort();
  }, [companies]);

  const categoriasDisp = useMemo(() => {
    const s = new Set<string>();
    companies.forEach(c => {
      (c.categorias || c.step1?.categorias || []).forEach(cat => s.add(cat));
    });
    return [...s].sort();
  }, [companies]);

  const planesDisp = useMemo(() => {
    const s = new Set(companies.map(c => c.plan || "gratuito").filter(Boolean));
    return [...s].sort();
  }, [companies]);

  // Empresas filtradas
  const filtradas = useMemo(() => {
    return companies.filter(c => {
      const dept = c.departamento || c.step1?.departamento || "";
      const plan = c.plan || "gratuito";
      const cats = c.categorias || c.step1?.categorias || [];

      if (filtroEstado === "activa"   && !c.activa)  return false;
      if (filtroEstado === "inactiva" &&  c.activa)  return false;
      if (filtroPlan !== "todos"  && plan !== filtroPlan)          return false;
      if (filtroDept !== "todos"  && dept !== filtroDept)          return false;
      if (filtroCat  !== "todos"  && !cats.includes(filtroCat))    return false;
      return true;
    });
  }, [companies, filtroEstado, filtroPlan, filtroDept, filtroCat]);

  // Toggle columna
  function toggleCol(key: string) {
    setColsSelec(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    setPerfilActivo("personalizado");
  }

  // Toggle grupo entero
  function toggleGrupo(grupo: string) {
    const colsGrupo = COLS.filter(c => c.group === grupo).map(c => c.key);
    const todasActivas = colsGrupo.every(k => colsSelec.has(k));
    setColsSelec(prev => {
      const next = new Set(prev);
      colsGrupo.forEach(k => todasActivas ? next.delete(k) : next.add(k));
      return next;
    });
    setPerfilActivo("personalizado");
  }

  // Aplicar perfil
  function aplicarPerfil(p: Perfil) {
    setColsSelec(new Set(p.cols));
    setPerfilActivo(p.id);
  }

  // Exportar Excel
  async function exportarExcel() {
    if (filtradas.length === 0) return;
    setExporting(true);
    try {
      const XLSX = await import("xlsx");

      const colsOrdenadas = COLS.filter(c => colsSelec.has(c.key));
      const headers = colsOrdenadas.map(c => c.label);

      const rows = filtradas.map(c => {
        const d = g(c);
        return colsOrdenadas.map(col => (d as Record<string,unknown>)[col.key] ?? "");
      });

      const wsData = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Anchos de columna automáticos
      ws["!cols"] = headers.map((h, i) => {
        const maxLen = Math.max(
          h.length,
          ...rows.map(r => String(r[i] ?? "").length).slice(0, 50)
        );
        return { wch: Math.min(Math.max(maxLen + 2, 12), 50) };
      });

      // Estilo encabezados (negrita)
      headers.forEach((_, i) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: i });
        if (ws[cell]) ws[cell].s = { font: { bold: true }, fill: { fgColor: { rgb: "1B5E20" } } };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Empresas AgTech");

      // Hoja de resumen
      const resumenData = [
        ["REPORTE DE EXPORTACIÓN – AgTech Colombia"],
        [],
        ["Fecha de exportación", new Date().toLocaleString("es-CO")],
        ["Total empresas exportadas", filtradas.length],
        ["Filtro estado", filtroEstado],
        ["Filtro plan", filtroPlan],
        ["Filtro departamento", filtroDept],
        ["Filtro categoría", filtroCat],
        ["Columnas incluidas", headers.join(", ")],
      ];
      const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
      wsResumen["!cols"] = [{ wch: 30 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

      const fecha = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `AgTech_Colombia_Empresas_${fecha}.xlsx`);
    } finally {
      setExporting(false);
    }
  }

  // Exportar CSV
  async function exportarCSV() {
    if (filtradas.length === 0) return;
    setExporting(true);
    try {
      const colsOrdenadas = COLS.filter(c => colsSelec.has(c.key));
      const headers = colsOrdenadas.map(c => `"${c.label}"`).join(",");
      const rows = filtradas.map(c => {
        const d = g(c);
        return colsOrdenadas
          .map(col => `"${String((d as Record<string,unknown>)[col.key] ?? "").replace(/"/g, '""')}"`)
          .join(",");
      });
      const csv = [headers, ...rows].join("\r\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      const fecha = new Date().toISOString().slice(0, 10);
      a.href     = url;
      a.download = `AgTech_Colombia_Empresas_${fecha}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  const colsActivas = colsSelec.size;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">
          📤 Exportar Empresas
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Selecciona filtros y columnas para exportar la base de datos de empresas AgTech Colombia.
        </p>
      </div>

      {/* ── Resumen rápido ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:"Total en BD",       value: companies.length,  color:"bg-blue-50 border-blue-200 text-blue-700"   },
          { label:"A exportar",        value: filtradas.length,  color:"bg-green-50 border-green-200 text-green-700"},
          { label:"Columnas activas",  value: colsActivas,       color:"bg-purple-50 border-purple-200 text-purple-700"},
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border-2 ${s.color} p-3 sm:p-4 text-center`}>
            <p className="text-2xl sm:text-3xl font-extrabold">{s.value}</p>
            <p className="text-xs mt-0.5 font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Panel izquierdo: filtros de filas ── */}
        <div className="space-y-4">
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wide flex items-center gap-2">
            🔽 Filtrar registros
          </h2>

          <div className="bg-white rounded-2xl border border-outline-variant/40 p-4 sm:p-5 space-y-4 shadow-sm">

            {/* Estado */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">Estado</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { v:"todos",    l:"Todas" },
                  { v:"activa",   l:"✓ Activas" },
                  { v:"inactiva", l:"Inactivas" },
                ].map(o => (
                  <button key={o.v} onClick={() => setFiltroEstado(o.v as typeof filtroEstado)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      filtroEstado === o.v
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">Plan</label>
              <select value={filtroPlan} onChange={e => setFiltroPlan(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2.5
                           text-sm outline-none focus:border-primary">
                <option value="todos">Todos los planes</option>
                {planesDisp.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Departamento */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">Departamento</label>
              <select value={filtroDept} onChange={e => setFiltroDept(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2.5
                           text-sm outline-none focus:border-primary">
                <option value="todos">Todos los departamentos</option>
                {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">Categoría</label>
              <select value={filtroCat} onChange={e => setFiltroCat(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-3 py-2.5
                           text-sm outline-none focus:border-primary">
                <option value="todos">Todas las categorías</option>
                {categoriasDisp.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Reset filtros */}
            <button
              onClick={() => { setFiltroEstado("todos"); setFiltroPlan("todos"); setFiltroDept("todos"); setFiltroCat("todos"); }}
              className="text-xs text-primary hover:underline font-medium">
              Restablecer filtros
            </button>
          </div>

          {/* ── Perfiles rápidos ── */}
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wide mt-2 flex items-center gap-2">
            ⚡ Perfiles rápidos
          </h2>
          <div className="space-y-2">
            {PERFILES.map(p => (
              <button key={p.id} onClick={() => aplicarPerfil(p)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
                  perfilActivo === p.id
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant bg-white hover:border-primary/40 hover:bg-surface-container/40"
                }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <span className={`text-sm font-semibold ${perfilActivo === p.id ? "text-primary" : "text-on-surface"}`}>
                    {p.label}
                  </span>
                  {perfilActivo === p.id && (
                    <span className="ml-auto text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">
                      ACTIVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5 ml-7">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Panel derecho: columnas ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-on-surface text-sm uppercase tracking-wide flex items-center gap-2">
              📑 Columnas a incluir
            </h2>
            <div className="flex gap-2">
              <button onClick={() => { setColsSelec(new Set(COLS.map(c => c.key))); setPerfilActivo("personalizado"); }}
                className="text-xs text-primary hover:underline font-medium">Todas</button>
              <span className="text-on-surface-variant">·</span>
              <button onClick={() => { setColsSelec(new Set()); setPerfilActivo("personalizado"); }}
                className="text-xs text-primary hover:underline font-medium">Ninguna</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
            {GRUPOS.map((grupo, gi) => {
              const colsGrupo = COLS.filter(c => c.group === grupo);
              const todasActivas = colsGrupo.every(c => colsSelec.has(c.key));
              const algunaActiva = colsGrupo.some(c => colsSelec.has(c.key));
              return (
                <div key={grupo} className={gi > 0 ? "border-t border-outline-variant/30" : ""}>
                  {/* Cabecera grupo */}
                  <button onClick={() => toggleGrupo(grupo)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-surface-container/50
                               hover:bg-surface-container transition-colors text-left">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                      todasActivas
                        ? "bg-primary border-primary"
                        : algunaActiva
                        ? "border-primary bg-primary/20"
                        : "border-outline-variant"
                    }`}>
                      {todasActivas && <span className="text-white text-[10px]">✓</span>}
                      {!todasActivas && algunaActiva && <span className="text-primary text-[10px]">–</span>}
                    </div>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wide">{grupo}</span>
                    <span className="ml-auto text-[10px] text-on-surface-variant">
                      {colsGrupo.filter(c => colsSelec.has(c.key)).length}/{colsGrupo.length}
                    </span>
                  </button>

                  {/* Checkboxes columnas */}
                  <div className="px-4 py-2 grid grid-cols-1 gap-1">
                    {colsGrupo.map(col => (
                      <label key={col.key}
                        className="flex items-center gap-2.5 cursor-pointer py-1 rounded-lg
                                   hover:bg-surface-container/50 px-1 transition-colors">
                        <div onClick={() => toggleCol(col.key)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                            colsSelec.has(col.key)
                              ? "bg-primary border-primary"
                              : "border-outline-variant"
                          }`}>
                          {colsSelec.has(col.key) && <span className="text-white text-[10px]">✓</span>}
                        </div>
                        <span onClick={() => toggleCol(col.key)}
                          className="text-xs text-on-surface select-none">{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Botones de exportación ── */}
      <div className="bg-white rounded-2xl border border-outline-variant/40 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-on-surface">
              Listo para exportar: <span className="text-primary">{filtradas.length} empresas</span> · <span className="text-primary">{colsActivas} columnas</span>
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {filtradas.length === 0
                ? "⚠️ No hay empresas con los filtros seleccionados."
                : "El archivo incluirá una hoja de datos y una hoja de resumen."}
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={exportarCSV}
              disabled={exporting || filtradas.length === 0 || colsActivas === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl
                         border-2 border-primary text-primary font-bold px-5 py-3 text-sm
                         hover:bg-primary/5 disabled:opacity-50 transition-all active:scale-[0.99]">
              {exporting ? "…" : "📄 CSV"}
            </button>
            <button
              onClick={exportarExcel}
              disabled={exporting || filtradas.length === 0 || colsActivas === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl
                         bg-[#1D6F42] text-white font-bold px-5 py-3 text-sm
                         hover:bg-[#155735] disabled:opacity-50 transition-all
                         shadow-md active:scale-[0.99]">
              {exporting
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg> Generando…</>
                : <>📊 Excel (.xlsx)</>
              }
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
