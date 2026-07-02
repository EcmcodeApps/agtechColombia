"use client";

import { useState } from "react";
import TopAppBar from "@/app/_components/TopAppBar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCyDsYKpQpMxa_RWo9cmJ2oylOZ8EHhoj-0cC7dtB3IrZAc8NuWjtsaeqp6IGpzkg2_gbp_2QJoYWYKmts2MglWcgoLAVdBLOP-2YQsDS6HImwrergABAy5H9c4MnvB75L5RB3Kyx6Y5gq_RjHYw3LkllcueLC2t8H5We8hST9i8B7l_WTF2r1hDs-MO4QKTcE53maZS_uURnOAFg4jGoSDifnRtFDQDcV8CyTFDQufpIQ386jbJe9e3UnCoDuN0SZXsUzy9fA-ZQ";

// ── Periodos ──────────────────────────────────────────────────────────────────
type Period = "semana" | "mes" | "trimestre" | "año";

const PERIOD_LABELS: Record<Period, string> = {
  semana:     "Esta semana",
  mes:        "Este mes",
  trimestre:  "Este trimestre",
  año:        "Este año",
};

// ── Datos por periodo ─────────────────────────────────────────────────────────
const DATA: Record<Period, {
  postulaciones: number; vistas: number; matches: number; contratados: number;
  conversionPct: number; matchPromedio: number;
  tendencia: number[];        // 7 puntos (semana) o 12 puntos (mes) etc.
  tendenciaLabels: string[];
  vacantes: { title: string; postulaciones: number; vistas: number; match: number; estado: string }[];
  fuentes: { label: string; pct: number; color: string }[];
  ciudades: { ciudad: string; count: number }[];
  habilidades: { skill: string; demanda: number }[];
  funnel: { label: string; count: number; color: string }[];
}> = {
  semana: {
    postulaciones: 38, vistas: 312, matches: 14, contratados: 1,
    conversionPct: 2.6, matchPromedio: 84,
    tendencia: [4, 7, 5, 9, 6, 4, 3],
    tendenciaLabels: ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],
    vacantes: [
      { title: "Técnico Electromecánico",  postulaciones: 12, vistas: 98,  match: 88, estado: "activa"  },
      { title: "Asesor Comercial",          postulaciones: 9,  vistas: 74,  match: 76, estado: "activa"  },
      { title: "Auxiliar Contable",         postulaciones: 7,  vistas: 61,  match: 81, estado: "activa"  },
      { title: "Operario de Producción",    postulaciones: 6,  vistas: 54,  match: 73, estado: "pausada" },
      { title: "Coordinador de Logística",  postulaciones: 4,  vistas: 25,  match: 91, estado: "activa"  },
    ],
    fuentes: [
      { label: "Búsqueda orgánica", pct: 42, color: "#00355f" },
      { label: "Match de IA",       pct: 31, color: "#FF6200" },
      { label: "Enlace directo",    pct: 16, color: "#00A676" },
      { label: "Redes sociales",    pct: 11, color: "#6B7280" },
    ],
    ciudades: [
      { ciudad: "Medellín",      count: 14 },
      { ciudad: "Bogotá",        count: 10 },
      { ciudad: "Cali",          count: 7  },
      { ciudad: "Barranquilla",  count: 4  },
      { ciudad: "Bucaramanga",   count: 3  },
    ],
    habilidades: [
      { skill: "Atención al Cliente", demanda: 88 },
      { skill: "Excel",               demanda: 74 },
      { skill: "Liderazgo",           demanda: 68 },
      { skill: "PLC Siemens",         demanda: 61 },
      { skill: "Ventas B2C",          demanda: 55 },
    ],
    funnel: [
      { label: "Vistas",          count: 312, color: "bg-primary"       },
      { label: "Postulaciones",   count: 38,  color: "bg-energy-orange" },
      { label: "En entrevista",   count: 8,   color: "bg-[#9C27B0]"    },
      { label: "Contratados",     count: 1,   color: "bg-brand-green"   },
    ],
  },
  mes: {
    postulaciones: 187, vistas: 1420, matches: 63, contratados: 5,
    conversionPct: 2.7, matchPromedio: 82,
    tendencia: [18, 22, 15, 28, 24, 31, 19, 25, 12, 38, 21, 33],
    tendenciaLabels: ["1","5","8","11","14","16","18","20","22","24","26","28"],
    vacantes: [
      { title: "Técnico Electromecánico",  postulaciones: 52, vistas: 410, match: 88, estado: "activa"  },
      { title: "Asesor Comercial",          postulaciones: 41, vistas: 380, match: 76, estado: "activa"  },
      { title: "Auxiliar Contable",         postulaciones: 38, vistas: 290, match: 81, estado: "activa"  },
      { title: "Operario de Producción",    postulaciones: 30, vistas: 220, match: 73, estado: "pausada" },
      { title: "Coordinador de Logística",  postulaciones: 26, vistas: 120, match: 91, estado: "activa"  },
    ],
    fuentes: [
      { label: "Búsqueda orgánica", pct: 38, color: "#00355f" },
      { label: "Match de IA",       pct: 34, color: "#FF6200" },
      { label: "Enlace directo",    pct: 18, color: "#00A676" },
      { label: "Redes sociales",    pct: 10, color: "#6B7280" },
    ],
    ciudades: [
      { ciudad: "Medellín",      count: 68  },
      { ciudad: "Bogotá",        count: 54  },
      { ciudad: "Cali",          count: 35  },
      { ciudad: "Barranquilla",  count: 18  },
      { ciudad: "Bucaramanga",   count: 12  },
    ],
    habilidades: [
      { skill: "Atención al Cliente", demanda: 91 },
      { skill: "Excel",               demanda: 78 },
      { skill: "Liderazgo",           demanda: 72 },
      { skill: "PLC Siemens",         demanda: 65 },
      { skill: "Ventas B2C",          demanda: 58 },
    ],
    funnel: [
      { label: "Vistas",          count: 1420, color: "bg-primary"       },
      { label: "Postulaciones",   count: 187,  color: "bg-energy-orange" },
      { label: "En entrevista",   count: 34,   color: "bg-[#9C27B0]"    },
      { label: "Contratados",     count: 5,    color: "bg-brand-green"   },
    ],
  },
  trimestre: {
    postulaciones: 541, vistas: 4180, matches: 198, contratados: 14,
    conversionPct: 2.6, matchPromedio: 83,
    tendencia: [140, 162, 185, 210, 175, 195, 220, 180, 165, 190, 210, 230],
    tendenciaLabels: ["Ene","","","Feb","","","Mar","","","Abr","",""],
    vacantes: [
      { title: "Técnico Electromecánico",  postulaciones: 145, vistas: 1120, match: 88, estado: "activa"  },
      { title: "Asesor Comercial",          postulaciones: 132, vistas: 980,  match: 76, estado: "activa"  },
      { title: "Auxiliar Contable",         postulaciones: 98,  vistas: 820,  match: 81, estado: "activa"  },
      { title: "Operario de Producción",    postulaciones: 90,  vistas: 740,  match: 73, estado: "pausada" },
      { title: "Coordinador de Logística",  postulaciones: 76,  vistas: 520,  match: 91, estado: "activa"  },
    ],
    fuentes: [
      { label: "Búsqueda orgánica", pct: 40, color: "#00355f" },
      { label: "Match de IA",       pct: 32, color: "#FF6200" },
      { label: "Enlace directo",    pct: 17, color: "#00A676" },
      { label: "Redes sociales",    pct: 11, color: "#6B7280" },
    ],
    ciudades: [
      { ciudad: "Medellín",      count: 198 },
      { ciudad: "Bogotá",        count: 162 },
      { ciudad: "Cali",          count: 98  },
      { ciudad: "Barranquilla",  count: 52  },
      { ciudad: "Bucaramanga",   count: 31  },
    ],
    habilidades: [
      { skill: "Atención al Cliente", demanda: 93 },
      { skill: "Excel",               demanda: 82 },
      { skill: "Liderazgo",           demanda: 75 },
      { skill: "PLC Siemens",         demanda: 68 },
      { skill: "Ventas B2C",          demanda: 61 },
    ],
    funnel: [
      { label: "Vistas",          count: 4180, color: "bg-primary"       },
      { label: "Postulaciones",   count: 541,  color: "bg-energy-orange" },
      { label: "En entrevista",   count: 98,   color: "bg-[#9C27B0]"    },
      { label: "Contratados",     count: 14,   color: "bg-brand-green"   },
    ],
  },
  año: {
    postulaciones: 1840, vistas: 14200, matches: 712, contratados: 48,
    conversionPct: 2.6, matchPromedio: 85,
    tendencia: [120, 145, 160, 180, 195, 210, 190, 175, 200, 220, 195, 250],
    tendenciaLabels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
    vacantes: [
      { title: "Técnico Electromecánico",  postulaciones: 520, vistas: 3800, match: 88, estado: "activa"  },
      { title: "Asesor Comercial",          postulaciones: 440, vistas: 3400, match: 76, estado: "activa"  },
      { title: "Auxiliar Contable",         postulaciones: 380, vistas: 2900, match: 81, estado: "activa"  },
      { title: "Operario de Producción",    postulaciones: 290, vistas: 2300, match: 73, estado: "pausada" },
      { title: "Coordinador de Logística",  postulaciones: 210, vistas: 1800, match: 91, estado: "activa"  },
    ],
    fuentes: [
      { label: "Búsqueda orgánica", pct: 39, color: "#00355f" },
      { label: "Match de IA",       pct: 33, color: "#FF6200" },
      { label: "Enlace directo",    pct: 18, color: "#00A676" },
      { label: "Redes sociales",    pct: 10, color: "#6B7280" },
    ],
    ciudades: [
      { ciudad: "Medellín",      count: 680  },
      { ciudad: "Bogotá",        count: 540  },
      { ciudad: "Cali",          count: 320  },
      { ciudad: "Barranquilla",  count: 180  },
      { ciudad: "Bucaramanga",   count: 120  },
    ],
    habilidades: [
      { skill: "Atención al Cliente", demanda: 95 },
      { skill: "Excel",               demanda: 84 },
      { skill: "Liderazgo",           demanda: 78 },
      { skill: "PLC Siemens",         demanda: 71 },
      { skill: "Ventas B2C",          demanda: 64 },
    ],
    funnel: [
      { label: "Vistas",          count: 14200, color: "bg-primary"       },
      { label: "Postulaciones",   count: 1840,  color: "bg-energy-orange" },
      { label: "En entrevista",   count: 320,   color: "bg-[#9C27B0]"    },
      { label: "Contratados",     count: 48,    color: "bg-brand-green"   },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

// ── Gráfico de línea SVG ──────────────────────────────────────────────────────
function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 600, H = 140, PAD = 12;
  const max = Math.max(...values) || 1;
  const pts = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
    const y = H - PAD - (v / max) * (H - PAD * 2);
    return { x, y, v };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${H - PAD} L${pts[0].x.toFixed(1)},${H - PAD} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ minWidth: 280 }}>
        {/* Líneas guía horizontales */}
        {[0.25, 0.5, 0.75, 1].map(pct => {
          const y = H - PAD - pct * (H - PAD * 2);
          return (
            <line key={pct} x1={PAD} y1={y} x2={W - PAD} y2={y}
              stroke="#e0e3e5" strokeWidth="1" strokeDasharray="4 4" />
          );
        })}
        {/* Área */}
        <path d={areaD} fill="url(#areaGrad)" opacity="0.35" />
        {/* Línea */}
        <path d={pathD} fill="none" stroke="#00355f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Puntos */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#00355f" />
            <circle cx={p.x} cy={p.y} r="7" fill="#00355f" opacity="0" className="hover:opacity-20 transition-opacity cursor-pointer" />
          </g>
        ))}
        {/* Labels eje X */}
        {labels.map((l, i) => {
          if (!l) return null;
          const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
          return (
            <text key={i} x={x} y={H + 14} textAnchor="middle" fontSize="10" fill="#6B7280">{l}</text>
          );
        })}
        {/* Gradiente */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00355f" />
            <stop offset="100%" stopColor="#00355f" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ── Donut SVG ─────────────────────────────────────────────────────────────────
function DonutChart({ fuentes }: { fuentes: { label: string; pct: number; color: string }[] }) {
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  const segments = fuentes.map(f => {
    const dash = (f.pct / 100) * C;
    const gap  = C - dash;
    const seg  = { ...f, dash, gap, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-xl">
      <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
        <svg viewBox="0 0 140 140" width="140" height="140">
          {segments.map((s, i) => (
            <circle key={i} cx="70" cy="70" r={R}
              fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          ))}
          <text x="70" y="66" textAnchor="middle" fontSize="20" fontWeight="800" fill="#00355f">100%</text>
          <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#6B7280">tráfico</text>
        </svg>
      </div>
      <div className="space-y-sm flex-1 w-full">
        {fuentes.map((f) => (
          <div key={f.label} className="flex items-center gap-sm">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
            <span className="text-body-sm text-on-surface-variant flex-1">{f.label}</span>
            <span className="text-label-md font-bold text-on-surface">{f.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color, fill = false }: {
  icon: string; label: string; value: string; sub: string; color: string; fill?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] p-lg flex flex-col gap-sm ${fill ? color : "bg-white"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fill ? "bg-white/20" : color}`}>
        <span className={`material-symbols-outlined text-[20px] ${fill ? "text-white" : "text-white"}`}
          style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div>
        <p className={`text-display-xs font-black tracking-tight ${fill ? "text-white" : "text-on-surface"}`}>{value}</p>
        <p className={`text-label-md ${fill ? "text-white/80" : "text-on-surface"}`}>{label}</p>
      </div>
      <p className={`text-body-sm ${fill ? "text-white/70" : "text-on-surface-variant"}`}>{sub}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function ReportesPage() {
  const [period, setPeriod] = useState<Period>("mes");
  const d = DATA[period];

  const card = "bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

  return (
    <>
      <TopAppBar userName="Carlos G." userType="Empresa" avatarUrl={AVATAR} hasNotification />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-xl">
          <div>
            <h1 className="text-headline-lg text-primary font-black">Reportes</h1>
            <p className="text-body-sm text-on-surface-variant">Analytics de contratación · Inversiones Antioquia S.A.S</p>
          </div>
          {/* Selector de periodo */}
          <div className="flex gap-xs bg-surface-container-low rounded-xl p-xs border border-outline-variant/30">
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-md py-xs rounded-lg text-label-sm font-semibold transition-all ${
                  period === p
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}>
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPIs ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
          <KpiCard icon="group"      label="Postulaciones"   value={fmt(d.postulaciones)} sub="Total recibidas"           color="bg-primary"       fill />
          <KpiCard icon="visibility" label="Vistas"          value={fmt(d.vistas)}        sub="A todas las vacantes"      color="bg-surface-container-high" />
          <KpiCard icon="psychology" label="Matches IA"      value={fmt(d.matches)}       sub={`Score prom. ${d.matchPromedio}%`} color="bg-energy-orange/10" />
          <KpiCard icon="how_to_reg" label="Contratados"     value={String(d.contratados)} sub={`Conversión ${d.conversionPct}%`} color="bg-brand-green/10" />
        </div>

        {/* ── Fila 1: Tendencia + Fuentes ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-gutter">

          {/* Gráfico de tendencia */}
          <div className={`${card} p-xl lg:col-span-8`}>
            <div className="flex items-center justify-between mb-lg">
              <div>
                <h2 className="text-headline-sm text-on-surface font-bold">Postulaciones en el tiempo</h2>
                <p className="text-body-sm text-on-surface-variant">{PERIOD_LABELS[period]}</p>
              </div>
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-label-sm text-on-surface-variant">Postulaciones</span>
              </div>
            </div>
            <LineChart values={d.tendencia} labels={d.tendenciaLabels} />
          </div>

          {/* Fuentes de tráfico */}
          <div className={`${card} p-xl lg:col-span-4`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Fuentes de tráfico</h2>
            <p className="text-body-sm text-on-surface-variant mb-lg">¿Cómo nos encuentran los candidatos?</p>
            <DonutChart fuentes={d.fuentes} />
          </div>
        </div>

        {/* ── Fila 2: Funnel + Ciudades ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-gutter">

          {/* Funnel de contratación */}
          <div className={`${card} p-xl lg:col-span-5`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Embudo de contratación</h2>
            <p className="text-body-sm text-on-surface-variant mb-xl">De vista a contratación</p>
            <div className="space-y-sm">
              {d.funnel.map((f, idx) => {
                const pct = Math.round((f.count / d.funnel[0].count) * 100);
                return (
                  <div key={f.label}>
                    <div className="flex items-center justify-between mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className={`w-2.5 h-2.5 rounded-full ${f.color}`} />
                        <span className="text-label-md text-on-surface">{f.label}</span>
                      </div>
                      <div className="flex items-center gap-md">
                        <span className="text-label-md font-bold text-on-surface">{fmt(f.count)}</span>
                        <span className="text-label-sm text-on-surface-variant w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${f.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {idx < d.funnel.length - 1 && (
                      <div className="flex items-center gap-xs mt-xs ml-[18px]">
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_downward</span>
                        <span className="text-label-sm text-on-surface-variant">
                          {Math.round((d.funnel[idx + 1].count / f.count) * 100)}% pasan a la siguiente etapa
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ciudades */}
          <div className={`${card} p-xl lg:col-span-3`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Top ciudades</h2>
            <p className="text-body-sm text-on-surface-variant mb-xl">Origen de postulantes</p>
            <div className="space-y-md">
              {d.ciudades.map((c, i) => {
                const pct = Math.round((c.count / d.ciudades[0].count) * 100);
                return (
                  <div key={c.ciudad}>
                    <div className="flex items-center justify-between mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className="text-label-sm text-on-surface-variant w-4">{i + 1}</span>
                        <span className="text-label-md text-on-surface">{c.ciudad}</span>
                      </div>
                      <span className="text-label-md font-bold text-primary">{fmt(c.count)}</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habilidades más demandadas */}
          <div className={`${card} p-xl lg:col-span-4`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Habilidades más buscadas</h2>
            <p className="text-body-sm text-on-surface-variant mb-xl">Índice de demanda en tus vacantes</p>
            <div className="space-y-md">
              {d.habilidades.map((h, i) => (
                <div key={h.skill} className="flex items-center gap-md">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-label-sm font-bold flex-shrink-0 ${
                    i === 0 ? "bg-energy-orange/20 text-energy-orange" : "bg-surface-container-high text-on-surface-variant"
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-xs">
                      <span className="text-label-md text-on-surface truncate">{h.skill}</span>
                      <span className="text-label-sm text-on-surface-variant ml-sm flex-shrink-0">{h.demanda}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-energy-orange" : "bg-primary/50"}`}
                        style={{ width: `${h.demanda}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Fila 3: Rendimiento por vacante ─────────────────────────────── */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-xl pt-xl pb-lg border-b border-outline-variant/30 flex items-center justify-between">
            <div>
              <h2 className="text-headline-sm text-on-surface font-bold">Rendimiento por vacante</h2>
              <p className="text-body-sm text-on-surface-variant">{PERIOD_LABELS[period]}</p>
            </div>
            <button className="flex items-center gap-xs px-md py-sm border border-outline-variant text-on-surface-variant rounded-xl text-label-sm hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Exportar CSV
            </button>
          </div>

          {/* Cabecera tabla */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_120px_80px] gap-md px-xl py-sm bg-surface-container-low border-b border-outline-variant/20 text-label-sm text-on-surface-variant">
            <span>Vacante</span>
            <span className="text-right">Postulaciones</span>
            <span className="text-right">Vistas</span>
            <span className="text-center">Match IA prom.</span>
            <span className="text-center">Estado</span>
          </div>

          {d.vacantes.map((v, i) => (
            <div key={v.title} className={`border-b border-outline-variant/20 last:border-0 px-xl py-lg hover:bg-surface-container-low/40 transition-colors`}>
              {/* Mobile */}
              <div className="flex flex-col sm:hidden gap-xs">
                <div className="flex items-center justify-between">
                  <span className="text-label-md text-on-surface">{v.title}</span>
                  <span className={`px-sm py-xs rounded-full text-label-sm font-semibold ${
                    v.estado === "activa" ? "bg-brand-green/10 text-brand-green" : "bg-[#FF9800]/10 text-[#FF9800]"
                  }`}>{v.estado}</span>
                </div>
                <div className="flex gap-lg text-on-surface-variant text-body-sm">
                  <span>{v.postulaciones} postulaciones</span>
                  <span>{v.vistas} vistas</span>
                  <span className="text-primary font-bold">Match {v.match}%</span>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-[1fr_100px_80px_120px_80px] gap-md items-center">
                <div className="flex items-center gap-md">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-label-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-label-md text-on-surface">{v.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-label-md font-bold text-on-surface">{v.postulaciones}</span>
                </div>
                <div className="text-right">
                  <span className="text-label-md text-on-surface-variant">{v.vistas}</span>
                </div>
                {/* Match score ring */}
                <div className="flex items-center justify-center gap-sm">
                  <div className="relative w-9 h-9">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e0e3e5" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14" fill="none"
                        stroke={v.match >= 85 ? "#00A676" : v.match >= 70 ? "#FF6200" : "#6B7280"}
                        strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - v.match / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-on-surface">
                      {v.match}
                    </span>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">/ 100</span>
                </div>
                <div className="flex justify-center">
                  <span className={`px-sm py-xs rounded-full text-label-sm font-semibold ${
                    v.estado === "activa" ? "bg-brand-green/10 text-brand-green" : "bg-[#FF9800]/10 text-[#FF9800]"
                  }`}>{v.estado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Insight IA ──────────────────────────────────────────────────── */}
        <div className="mt-gutter bg-primary rounded-2xl p-xl text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-lg">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div className="flex-1">
              <p className="text-label-md font-bold opacity-80 mb-xs">Insight de IA · {PERIOD_LABELS[period]}</p>
              <p className="text-headline-sm font-bold">
                Tu vacante <strong className="text-[#FFD54F]">"Coordinador de Logística"</strong> tiene el mejor score de match ({d.vacantes[4]?.match}%) pero el menor volumen. Aumenta el presupuesto de visibilidad para atraer más candidatos compatibles.
              </p>
            </div>
            <button className="flex-shrink-0 px-lg py-sm bg-energy-orange text-white rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all">
              Ver recomendación
            </button>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">analytics</span>
          </div>
        </div>

      </main>
    </>
  );
}
