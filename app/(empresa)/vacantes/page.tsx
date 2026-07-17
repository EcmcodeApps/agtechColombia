"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { vacantesService } from "@/app/lib/firestore-service";
import type { Vacante } from "@/app/lib/types";
import TopAppBar from "@/app/_components/TopAppBar";

// ── Helpers ───────────────────────────────────────────────────────────────────
const ESTADO_CFG = {
  activa:  { label: "Activa",  cls: "bg-brand-green/10 text-brand-green"   },
  pausada: { label: "Pausada", cls: "bg-[#FF9800]/10 text-[#FF9800]"       },
  cerrada: { label: "Cerrada", cls: "bg-outline/10 text-on-surface-variant" },
} as const;

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-lg animate-pulse space-y-md">
      <div className="h-5 w-3/4 bg-outline-variant/40 rounded-lg" />
      <div className="h-4 w-1/2 bg-outline-variant/30 rounded-lg" />
      <div className="flex gap-md mt-md">
        <div className="h-8 w-20 bg-outline-variant/30 rounded-lg" />
        <div className="h-8 w-20 bg-outline-variant/30 rounded-lg" />
      </div>
    </div>
  );
}

// ── Tarjeta de vacante ────────────────────────────────────────────────────────
function VacanteCard({ v }: { v: Vacante }) {
  const est = ESTADO_CFG[v.estado] ?? ESTADO_CFG.cerrada;
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_2px_12px_rgba(15,76,129,0.06)] hover:shadow-[0px_4px_20px_rgba(15,76,129,0.10)] transition-shadow p-lg group">
      <div className="flex items-start justify-between gap-md">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-sm flex-wrap mb-xs">
            <span className={`text-label-sm font-bold px-sm py-[2px] rounded-full ${est.cls}`}>{est.label}</span>
            <span className="text-label-sm text-on-surface-variant">{v.categoria}</span>
          </div>
          <h3 className="text-headline-sm text-on-surface font-bold truncate">{v.titulo}</h3>
          <div className="flex items-center gap-xs mt-xs text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>{v.ciudad}</span>
            <span className="text-outline-variant">·</span>
            <span className="capitalize">{v.modalidad}</span>
          </div>
        </div>
        <Link
          href={`/vacantes/${v.id}/editar`}
          className="flex-shrink-0 w-9 h-9 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Editar vacante"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-lg mt-md pt-md border-t border-outline-variant/40">
        <div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span><strong className="text-on-surface font-semibold">{fmt(v.vistas)}</strong> vistas</span>
        </div>
        <Link
          href="/postulaciones"
          className="flex items-center gap-xs text-body-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">person_search</span>
          <span><strong className="text-on-surface font-semibold">{fmt(v.totalPostulaciones)}</strong> postulaciones</span>
        </Link>
        <Link
          href={`/vacantes/${v.id}/editar`}
          className="ml-auto text-label-sm text-primary hover:underline"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-[80px] px-md">
      <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center shadow-xl mb-xl">
        <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>work_history</span>
      </div>
      <h2 className="text-headline-md text-primary mb-sm">Sin vacantes publicadas</h2>
      <p className="text-body-md text-on-surface-variant mb-xl leading-relaxed" style={{ maxWidth: 360 }}>
        Publica tu primera vacante y deja que nuestra IA encuentre los mejores candidatos para tu empresa.
      </p>
      <Link
        href="/vacantes/nueva"
        className="inline-flex items-center gap-sm bg-energy-orange text-white px-xl py-md rounded-2xl text-label-lg font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined">add_circle</span>
        Publicar primera vacante
      </Link>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function VacantesPage() {
  const { user, loading: authLoading } = useAuthGuard();
  const [vacantes, setVacantes]   = useState<Vacante[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [filtro,   setFiltro]     = useState<Vacante["estado"] | "todas">("todas");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    vacantesService.porEmpresa(user.uid)
      .then(setVacantes)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filtro === "todas"
    ? vacantes
    : vacantes.filter(v => v.estado === filtro);

  const counts = {
    activas:  vacantes.filter(v => v.estado === "activa").length,
    pausadas: vacantes.filter(v => v.estado === "pausada").length,
    cerradas: vacantes.filter(v => v.estado === "cerrada").length,
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-xl">
      <TopAppBar userName={user?.displayName ?? "Empresa"} userType="Empresa" hasNotification={false} />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg">

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
          <div>
            <h1 className="text-headline-lg text-on-surface">Mis Vacantes</h1>
            {!loading && vacantes.length > 0 && (
              <p className="text-body-sm text-on-surface-variant mt-xs">
                {counts.activas} activa{counts.activas !== 1 ? "s" : ""} · {counts.pausadas} pausada{counts.pausadas !== 1 ? "s" : ""} · {counts.cerradas} cerrada{counts.cerradas !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Link
            href="/vacantes/nueva"
            className="inline-flex items-center justify-center gap-sm bg-energy-orange text-white py-sm px-lg rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all text-label-md font-bold sm:flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva vacante
          </Link>
        </div>

        {/* Filtros (solo cuando hay vacantes) */}
        {!loading && vacantes.length > 0 && (
          <div className="flex gap-sm overflow-x-auto pb-xs mb-lg scrollbar-none">
            {(["todas", "activa", "pausada", "cerrada"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`flex-shrink-0 px-lg py-xs rounded-full text-label-sm font-semibold border transition-all ${
                  filtro === f
                    ? "bg-primary text-white border-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                }`}
              >
                {f === "todas" ? "Todas" : ESTADO_CFG[f].label}
                {f !== "todas" && (
                  <span className="ml-xs opacity-70">
                    ({f === "activa" ? counts.activas : f === "pausada" ? counts.pausadas : counts.cerradas})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="space-y-md">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : vacantes.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="text-center py-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-[40px] mb-md block">search_off</span>
            No hay vacantes con ese filtro.
          </div>
        ) : (
          <div className="space-y-md">
            {filtered.map(v => <VacanteCard key={v.id} v={v} />)}
          </div>
        )}
      </main>

      {/* FAB */}
      <Link
        href="/vacantes/nueva"
        className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-energy-orange text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform lg:hidden"
        aria-label="Nueva vacante"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>
    </div>
  );
}
