"use client";

import { useEffect, useState, useMemo } from "react";
import TopAppBar from "@/app/_components/TopAppBar";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { vacantesService, postulacionesService, usuariosService } from "@/app/lib/firestore-service";
import type { Vacante, Postulacion } from "@/app/lib/types";

// ── Periodos ──────────────────────────────────────────────────────────────────
type Period = "semana" | "mes" | "trimestre" | "año";

const PERIOD_LABELS: Record<Period, string> = {
  semana:    "Esta semana",
  mes:       "Este mes",
  trimestre: "Este trimestre",
  año:       "Este año",
};

const PERIOD_DAYS: Record<Period, number> = {
  semana: 7, mes: 30, trimestre: 90, año: 365,
};

const FUENTES_STATIC = [
  { label: "Postulación directa", pct: 45, color: "#00355f" },
  { label: "Match de IA",         pct: 32, color: "#FF6200" },
  { label: "Enlace compartido",   pct: 13, color: "#00A676" },
  { label: "Otras fuentes",       pct: 10, color: "#6B7280" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

function periodCutoff(period: Period): Date {
  const d = new Date();
  d.setDate(d.getDate() - PERIOD_DAYS[period]);
  return d;
}

function toDate(ts: { toDate?: () => Date } | null | undefined): Date | null {
  return ts?.toDate ? ts.toDate() : null;
}

function computeTendencia(posts: Postulacion[], period: Period) {
  const now = new Date();
  const WEEK_DAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const MONTHS    = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  if (period === "semana") {
    const counts = Array(7).fill(0);
    const labels = Array(7).fill(0).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return WEEK_DAYS[d.getDay()];
    });
    posts.forEach(p => {
      const d = toDate(p.createdAt);
      if (!d) return;
      const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (daysAgo < 7) counts[6 - daysAgo]++;
    });
    return { values: counts, labels };
  }

  if (period === "mes") {
    const counts = Array(6).fill(0);
    const labels = Array(6).fill(0).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (30 - i * 5));
      return `${d.getDate()}`;
    });
    posts.forEach(p => {
      const d = toDate(p.createdAt);
      if (!d) return;
      const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (daysAgo < 30) {
        const bucket = Math.floor((29 - daysAgo) / 5);
        if (bucket >= 0 && bucket < 6) counts[bucket]++;
      }
    });
    return { values: counts, labels };
  }

  if (period === "trimestre") {
    const counts = Array(13).fill(0);
    const labels = Array(13).fill(0).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (90 - i * 7));
      return i % 4 === 0 ? `S${Math.ceil((d.getDate()) / 7)}` : "";
    });
    posts.forEach(p => {
      const d = toDate(p.createdAt);
      if (!d) return;
      const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (daysAgo < 90) {
        const bucket = Math.floor((89 - daysAgo) / 7);
        if (bucket >= 0 && bucket < 13) counts[bucket]++;
      }
    });
    return { values: counts, labels };
  }

  // año — por mes
  const counts = Array(12).fill(0);
  const labels = Array(12).fill(0).map((_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (11 - i));
    return MONTHS[d.getMonth()];
  });
  posts.forEach(p => {
    const d = toDate(p.createdAt);
    if (!d) return;
    const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (monthsAgo >= 0 && monthsAgo < 12) counts[11 - monthsAgo]++;
  });
  return { values: counts, labels };
}

function computeHabilidades(vacantes: Vacante[]) {
  const counts: Record<string, number> = {};
  vacantes.forEach(v => (v.habilidades ?? []).forEach(h => { counts[h] = (counts[h] ?? 0) + 1; }));
  const total = Math.max(vacantes.length, 1);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({ skill, demanda: Math.min(99, Math.round((count / total) * 100)) || 10 }));
}

// ── LineChart ─────────────────────────────────────────────────────────────────
function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 600, H = 140, PAD = 12;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => ({
    x: PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2),
    y: H - PAD - (v / max) * (H - PAD * 2),
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${H - PAD} L${pts[0].x.toFixed(1)},${H - PAD} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ minWidth: 280 }}>
        {[0.25, 0.5, 0.75, 1].map(pct => {
          const y = H - PAD - pct * (H - PAD * 2);
          return <line key={pct} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#e0e3e5" strokeWidth="1" strokeDasharray="4 4" />;
        })}
        <path d={areaD} fill="url(#areaGrad)" opacity="0.35" />
        <path d={pathD} fill="none" stroke="#00355f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#00355f" />
        ))}
        {labels.map((l, i) => {
          if (!l) return null;
          const x = PAD + (i / Math.max(values.length - 1, 1)) * (W - PAD * 2);
          return <text key={i} x={x} y={H + 14} textAnchor="middle" fontSize="10" fill="#6B7280">{l}</text>;
        })}
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

// ── DonutChart ────────────────────────────────────────────────────────────────
function DonutChart({ fuentes }: { fuentes: { label: string; pct: number; color: string }[] }) {
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  const segments = fuentes.map(f => {
    const dash = (f.pct / 100) * C;
    const seg  = { ...f, dash, gap: C - dash, offset };
    offset += dash;
    return seg;
  });
  return (
    <div className="flex flex-col sm:flex-row items-center gap-xl">
      <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
        <svg viewBox="0 0 140 140" width="140" height="140">
          {segments.map((s, i) => (
            <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset}
              transform="rotate(-90 70 70)" />
          ))}
          <text x="70" y="66" textAnchor="middle" fontSize="20" fontWeight="800" fill="#00355f">100%</text>
          <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#6B7280">tráfico</text>
        </svg>
      </div>
      <div className="space-y-sm flex-1 w-full">
        {fuentes.map(f => (
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

// ── KpiCard ───────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color, fill = false }: {
  icon: string; label: string; value: string; sub: string; color: string; fill?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)] p-lg flex flex-col gap-sm ${fill ? color : "bg-white"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fill ? "bg-white/20" : color}`}>
        <span className="material-symbols-outlined text-[20px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
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
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [period,         setPeriod]       = useState<Period>("mes");
  const [vacantes,       setVacantes]     = useState<Vacante[]>([]);
  const [postulaciones,  setPostulaciones] = useState<Postulacion[]>([]);
  const [userName,       setUserName]     = useState("Empresa");
  const [loading,        setLoading]      = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      vacantesService.porEmpresa(user.uid),
      postulacionesService.porEmpresa(user.uid),
      usuariosService.get(user.uid),
    ]).then(([vs, ps, usuario]) => {
      setVacantes(vs);
      setPostulaciones(ps);
      setUserName(usuario?.empresaNombre ?? user.displayName ?? "Empresa");
      setLoading(false);
    });
  }, [user]);

  // Filtrar postulaciones por periodo
  const filteredPosts = useMemo(() => {
    const cutoff = periodCutoff(period);
    return postulaciones.filter(p => {
      const d = toDate(p.createdAt);
      return d ? d >= cutoff : true;
    });
  }, [postulaciones, period]);

  // KPIs
  const totalVistas    = useMemo(() => vacantes.reduce((s, v) => s + (v.vistas ?? 0), 0), [vacantes]);
  const totalPosts     = filteredPosts.length;
  const contratados    = filteredPosts.filter(p => p.estado === "contratado").length;
  const entrevistando  = filteredPosts.filter(p => p.estado === "entrevista" || p.estado === "oferta").length;
  const scoreList      = filteredPosts.filter(p => p.matchScore > 0).map(p => p.matchScore);
  const matchPromedio  = scoreList.length ? Math.round(scoreList.reduce((s, n) => s + n, 0) / scoreList.length) : 0;
  const matches        = scoreList.length;
  const conversionPct  = totalPosts > 0 ? ((contratados / totalPosts) * 100).toFixed(1) : "0.0";

  const funnel = [
    { label: "Vistas",          count: totalVistas,   color: "bg-primary"       },
    { label: "Postulaciones",   count: totalPosts,    color: "bg-energy-orange" },
    { label: "En entrevista",   count: entrevistando, color: "bg-[#9C27B0]"    },
    { label: "Contratados",     count: contratados,   color: "bg-brand-green"   },
  ];

  const vacantesTable = vacantes.map(v => ({
    title:         v.titulo,
    postulaciones: v.totalPostulaciones,
    vistas:        v.vistas,
    match:         0,
    estado:        v.estado,
  }));

  const tendencia    = computeTendencia(filteredPosts, period);
  const habilidades  = computeHabilidades(vacantes);

  const card = "bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <>
      <TopAppBar userName={user?.displayName?.split(" ")[0] ?? "Empresa"} userType="Empresa" hasNotification={false} />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-xl">
          <div>
            <h1 className="text-headline-lg text-primary font-black">Reportes</h1>
            <p className="text-body-sm text-on-surface-variant">Analytics de contratación · {userName}</p>
          </div>
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

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
          <KpiCard icon="group"      label="Postulaciones" value={fmt(totalPosts)}   sub="Total recibidas"               color="bg-primary"       fill />
          <KpiCard icon="visibility" label="Vistas"        value={fmt(totalVistas)}  sub="Acumulado en tus vacantes"     color="bg-surface-container-high" />
          <KpiCard icon="psychology" label="Matches IA"    value={fmt(matches)}      sub={`Score prom. ${matchPromedio}%`} color="bg-energy-orange/10" />
          <KpiCard icon="how_to_reg" label="Contratados"   value={String(contratados)} sub={`Conversión ${conversionPct}%`} color="bg-brand-green/10" />
        </div>

        {/* Fila 1: Tendencia + Fuentes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-gutter">
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
            {totalPosts === 0 ? (
              <div className="h-36 flex items-center justify-center text-on-surface-variant">
                <p className="text-body-sm">Sin postulaciones en este periodo.</p>
              </div>
            ) : (
              <LineChart values={tendencia.values} labels={tendencia.labels} />
            )}
          </div>

          <div className={`${card} p-xl lg:col-span-4`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Fuentes de tráfico</h2>
            <p className="text-body-sm text-on-surface-variant mb-lg">¿Cómo nos encuentran los candidatos?</p>
            <DonutChart fuentes={FUENTES_STATIC} />
          </div>
        </div>

        {/* Fila 2: Funnel + Habilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-gutter">

          {/* Funnel */}
          <div className={`${card} p-xl lg:col-span-6`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Embudo de contratación</h2>
            <p className="text-body-sm text-on-surface-variant mb-xl">De vista a contratación</p>
            <div className="space-y-sm">
              {funnel.map((f, idx) => {
                const pct = f.count > 0 && funnel[0].count > 0
                  ? Math.round((f.count / funnel[0].count) * 100)
                  : 0;
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
                    {idx < funnel.length - 1 && funnel[idx + 1].count > 0 && (
                      <div className="flex items-center gap-xs mt-xs ml-[18px]">
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">arrow_downward</span>
                        <span className="text-label-sm text-on-surface-variant">
                          {Math.round((funnel[idx + 1].count / Math.max(f.count, 1)) * 100)}% pasan a la siguiente etapa
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habilidades más buscadas */}
          <div className={`${card} p-xl lg:col-span-6`}>
            <h2 className="text-headline-sm text-on-surface font-bold mb-xs">Habilidades más buscadas</h2>
            <p className="text-body-sm text-on-surface-variant mb-xl">Extraídas de tus vacantes publicadas</p>
            {habilidades.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant text-center py-xl">
                Publica vacantes con requisitos de habilidades para ver este análisis.
              </p>
            ) : (
              <div className="space-y-md">
                {habilidades.map((h, i) => (
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
            )}
          </div>
        </div>

        {/* Fila 3: Rendimiento por vacante */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-xl pt-xl pb-lg border-b border-outline-variant/30 flex items-center justify-between">
            <div>
              <h2 className="text-headline-sm text-on-surface font-bold">Rendimiento por vacante</h2>
              <p className="text-body-sm text-on-surface-variant">{PERIOD_LABELS[period]}</p>
            </div>
          </div>

          {vacantesTable.length === 0 ? (
            <div className="px-xl py-2xl text-center">
              <span className="material-symbols-outlined text-outline text-[48px] block mb-md">work</span>
              <p className="text-body-md text-on-surface-variant">Publica vacantes para ver su rendimiento aquí.</p>
            </div>
          ) : (
            <>
              <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px] gap-md px-xl py-sm bg-surface-container-low border-b border-outline-variant/20 text-label-sm text-on-surface-variant">
                <span>Vacante</span>
                <span className="text-right">Postulaciones</span>
                <span className="text-right">Vistas</span>
                <span className="text-center">Estado</span>
              </div>

              {vacantesTable.map((v, i) => (
                <div key={i} className="border-b border-outline-variant/20 last:border-0 px-xl py-lg hover:bg-surface-container-low/40 transition-colors">
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
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px] gap-md items-center">
                    <div className="flex items-center gap-md">
                      <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-label-sm font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-label-md text-on-surface truncate">{v.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-label-md font-bold text-on-surface">{v.postulaciones}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-label-md text-on-surface-variant">{v.vistas}</span>
                    </div>
                    <div className="flex justify-center">
                      <span className={`px-sm py-xs rounded-full text-label-sm font-semibold ${
                        v.estado === "activa" ? "bg-brand-green/10 text-brand-green" : "bg-[#FF9800]/10 text-[#FF9800]"
                      }`}>{v.estado}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Insight IA */}
        <div className="mt-gutter bg-primary rounded-2xl p-xl text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-lg">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div className="flex-1">
              <p className="text-label-md font-bold opacity-80 mb-xs">Insight de IA · {PERIOD_LABELS[period]}</p>
              {contratados > 0 ? (
                <p className="text-headline-sm font-bold">
                  ¡Felicitaciones! Tienes <strong className="text-[#FFD54F]">{contratados} contratación{contratados > 1 ? "es" : ""}</strong> este periodo con una tasa de conversión del {conversionPct}%.
                  {matchPromedio > 0 && ` El score promedio de tus candidatos es ${matchPromedio}%.`}
                </p>
              ) : totalPosts > 0 ? (
                <p className="text-headline-sm font-bold">
                  Tienes <strong className="text-[#FFD54F]">{totalPosts} postulación{totalPosts > 1 ? "es" : ""}</strong> este periodo.
                  Avanza los mejores candidatos a entrevista para acelerar tus contrataciones.
                </p>
              ) : (
                <p className="text-headline-sm font-bold">
                  Publica vacantes y activa el <strong className="text-[#FFD54F]">Match de IA</strong> para que TalentoYa encuentre los candidatos más compatibles con tu empresa.
                </p>
              )}
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">analytics</span>
          </div>
        </div>

      </main>
    </>
  );
}
