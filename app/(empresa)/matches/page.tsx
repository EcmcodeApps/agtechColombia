"use client";

import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useMemo, useRef, useState } from "react";
import TopAppBarBrand from "@/app/_components/TopAppBarBrand";
import { auth } from "@/app/lib/firebase";
import { buildMatches } from "@/app/lib/matching-engine";
import { candidatosService, matchesService, vacantesService } from "@/app/lib/firestore-service";
import type { Candidato, Match, Vacante } from "@/app/lib/types";

type StageId = "pendiente" | "revisado" | "contactado" | "descartado";
type SortKey = "score" | "reciente";

const STAGES: { id: StageId; label: string }[] = [
  { id: "pendiente", label: "Nuevos" },
  { id: "revisado", label: "En revisión" },
  { id: "contactado", label: "Contactados" },
  { id: "descartado", label: "Descartados" },
];

const RR = 20;
const RC = 2 * Math.PI * RR;

function ScoreRing({ score }: { score: number }) {
  const [offset, setOffset] = useState(RC);
  const ref = useRef<SVGSVGElement>(null);
  const color = score >= 90 ? "#006c4b" : score >= 80 ? "#FF6200" : "#00355f";

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setOffset(RC * (1 - score / 100));
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [score]);

  return (
    <div className="relative w-[52px] h-[52px] flex-shrink-0">
      <svg ref={ref} width={52} height={52} className="-rotate-90" viewBox="0 0 44 44">
        <circle cx={22} cy={22} r={RR} fill="none" stroke="#e0e3e5" strokeWidth={3.5} />
        <circle cx={22} cy={22} r={RR} fill="none" stroke={color} strokeWidth={3.5}
          strokeDasharray={RC} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] font-bold leading-none" style={{ color }}>{score}%</span>
        <span className="text-[7px] text-on-surface-variant leading-none mt-[1px]">Match</span>
      </div>
    </div>
  );
}

function Bar({ label, val }: { label: string; val: number }) {
  const color = val >= 90 ? "bg-secondary" : val >= 80 ? "bg-energy-orange" : "bg-primary";
  return (
    <div className="flex items-center gap-sm">
      <span className="text-label-sm text-on-surface-variant w-[7rem] flex-shrink-0 leading-tight">{label}</span>
      <div className="flex-1 h-[6px] bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-label-sm text-on-surface w-7 text-right">{val}%</span>
    </div>
  );
}

function MatchCard({ m }: { m: Match }) {
  const [open, setOpen] = useState(false);
  const initials = m.candidatoNombre.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
  const tags = m.habilidadesCoincidentes?.length ? m.habilidadesCoincidentes : ["Perfil compatible"];

  return (
    <article className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,76,129,0.06)] border border-outline-variant/40 hover:shadow-[0px_8px_28px_rgba(15,76,129,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between gap-sm p-lg pb-md">
        <div className="flex items-center gap-md min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center text-primary font-bold text-label-md flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-label-md text-on-surface font-semibold truncate">{m.candidatoNombre}</h3>
            <p className="text-body-sm text-on-surface-variant truncate">{m.candidatoTitulo}</p>
          </div>
        </div>
        <ScoreRing score={m.score} />
      </div>

      <div className="flex flex-wrap gap-xs px-lg pb-md">
        {tags.slice(0, 4).map(tag => (
          <span key={tag} className="bg-primary-fixed text-primary text-[10px] font-semibold px-sm py-[2px] rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="px-lg pb-md space-y-xs">
        <div className="flex items-center gap-sm text-on-surface-variant text-body-sm">
          <span className="material-symbols-outlined text-[16px]">work</span>
          <span>{m.vacanteTitulo}</span>
        </div>
        <div className="flex items-center gap-sm text-on-surface-variant text-body-sm">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span>{m.candidatoCiudad}</span>
        </div>
      </div>

      <div className="mx-lg mb-md flex items-start gap-sm bg-primary-container/20 border border-primary/10 rounded-xl px-md py-sm">
        <span className="material-symbols-outlined text-primary text-[16px] flex-shrink-0 mt-[1px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        <p className="text-[11px] text-on-surface leading-snug">
          {m.razones?.[0] ?? "La IA detectó señales positivas de compatibilidad para esta vacante."}
        </p>
      </div>

      <button onClick={() => setOpen(v => !v)}
        className="mx-lg mb-sm flex items-center gap-xs text-primary text-label-sm hover:underline self-start">
        <span className="material-symbols-outlined text-[14px]">{open ? "expand_less" : "expand_more"}</span>
        {open ? "Ocultar desglose IA" : "Ver desglose IA"}
      </button>

      {open && (
        <div className="px-lg pb-md space-y-sm border-t border-outline-variant pt-md mx-lg">
          {m.breakdown.map(b => <Bar key={b.categoria} label={b.categoria} val={b.score} />)}
          {!!m.riesgos?.length && (
            <div className="bg-error-container text-on-error-container rounded-xl p-sm text-[11px] leading-snug">
              <strong>Validar:</strong> {m.riesgos.join(" ")}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-sm p-lg pt-sm mt-auto border-t border-outline-variant">
        <Link href={`/matches/${m.id}`} className="flex-1 border border-primary text-primary text-label-sm py-sm rounded-xl hover:bg-surface-container transition-colors active:scale-95 text-center">
          Ver perfil
        </Link>
        <Link href={`/entrevista/${m.candidatoId}`} className="flex-1 bg-primary text-white text-label-sm py-sm rounded-xl hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-xs">
          <span className="material-symbols-outlined text-[14px]">event</span>
          Agendar
        </Link>
        <Link href="/mensajes" className="w-10 h-10 flex items-center justify-center bg-energy-orange text-white rounded-xl active:scale-90 transition-transform hover:brightness-110 flex-shrink-0" aria-label="Chat">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        </Link>
      </div>
    </article>
  );
}

export default function MatchesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stage, setStage] = useState<StageId>("pendiente");
  const [position, setPosition] = useState("todas");
  const [sort, setSort] = useState<SortKey>("score");
  const [minScore, setMinScore] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState("");

  async function load(uid: string) {
    setLoading(true);
    try {
      const [ms, vs] = await Promise.all([
        matchesService.porEmpresa(uid),
        vacantesService.porEmpresa(uid),
      ]);
      setMatches(ms.filter(m => !("schemaDoc" in (m as unknown as Record<string, unknown>))));
      setVacantes(vs);
    } catch {
      setMsg("No pudimos cargar los matches. Revisa tu sesión o permisos de Firestore.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => onAuthStateChanged(auth, u => {
    setUser(u);
    if (u) void load(u.uid);
    else setLoading(false);
  }), []);

  async function generate() {
    if (!user) return;
    setGenerating(true);
    setMsg("");
    try {
      const [vs, cs] = await Promise.all([
        vacantesService.porEmpresa(user.uid, "activa"),
        candidatosService.listar(),
      ]);
      const generated = buildMatches(vs, cs as Candidato[], 60);
      await Promise.all(generated.map(m => matchesService.upsert(m)));
      setMsg(`Generamos ${generated.length} matches reales con el motor Fase 1.`);
      await load(user.uid);
    } catch {
      setMsg("No se pudieron generar matches. Confirma que existan vacantes activas, candidatos y permisos de empresa.");
    } finally {
      setGenerating(false);
    }
  }

  const positions = useMemo(() => [
    { id: "todas", label: "Todas las vacantes" },
    ...vacantes.map(v => ({ id: v.id, label: v.titulo })),
  ], [vacantes]);

  const list = matches
    .filter(m => m.estado === stage)
    .filter(m => position === "todas" || m.vacanteId === position)
    .filter(m => m.score >= minScore)
    .sort((a, b) => sort === "score" ? b.score - a.score : 0);
  const top = matches[0];

  return (
    <>
      <TopAppBarBrand />
      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pb-28 lg:pb-xl space-y-lg">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <p className="text-label-sm text-on-surface-variant mb-xs">Motor IA Fase 1</p>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary font-bold">Matches inteligentes</h1>
            <p className="text-body-sm text-on-surface-variant max-w-2xl">
              Calcula compatibilidad por habilidades, experiencia, ubicación, salario, formación y disponibilidad.
            </p>
          </div>
          <button onClick={generate} disabled={!user || generating}
            className="bg-energy-orange disabled:opacity-50 text-white rounded-xl px-lg py-md text-label-md shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-sm">
            <span className={`material-symbols-outlined text-[20px] ${generating ? "animate-spin" : ""}`}>{generating ? "sync" : "auto_awesome"}</span>
            {generating ? "Generando..." : "Generar matches"}
          </button>
        </section>

        {msg && <div className="bg-primary-fixed text-primary rounded-xl px-md py-sm text-body-sm">{msg}</div>}

        <section>
          <label className="block text-label-sm text-on-surface-variant mb-xs">Vacante activa</label>
          <div className="relative inline-block w-full md:w-auto md:min-w-[280px]">
            <select value={position} onChange={e => setPosition(e.target.value)}
              className="appearance-none w-full bg-white border border-outline-variant rounded-xl px-lg py-md pr-xl text-label-md text-primary focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer">
              {positions.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
        </section>

        <nav className="flex overflow-x-auto gap-sm hide-scrollbar pb-xs">
          {STAGES.map(({ id, label }) => {
            const count = matches.filter(m => m.estado === id).length;
            return (
              <button key={id} onClick={() => setStage(id)}
                className={`flex-shrink-0 px-lg py-sm rounded-full text-label-md transition-all active:scale-95 ${
                  stage === id ? "bg-primary text-white shadow-md" : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}>
                {label} ({count})
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-md">
          <div className="flex items-center gap-sm bg-white border border-outline-variant rounded-xl px-md py-sm">
            <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-label-sm text-on-surface-variant">Mín. match:</span>
            <select value={minScore} onChange={e => setMinScore(+e.target.value)}
              className="bg-transparent text-label-sm text-primary focus:outline-none cursor-pointer">
              {[0, 70, 80, 85, 90].map(v => <option key={v} value={v}>{v === 0 ? "Todos" : `≥ ${v}%`}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-sm bg-white border border-outline-variant rounded-xl px-md py-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">sort</span>
            <span className="text-label-sm text-on-surface-variant">Ordenar:</span>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
              className="bg-transparent text-label-sm text-primary focus:outline-none cursor-pointer">
              <option value="score">Mayor match</option>
              <option value="reciente">Más reciente</option>
            </select>
          </div>
          <span className="text-label-sm text-on-surface-variant ml-auto">
            {list.length} candidato{list.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-outline-variant p-xl text-center text-on-surface-variant">Cargando matches...</div>
        ) : !user ? (
          <div className="bg-white rounded-2xl border border-outline-variant p-xl text-center">
            <h2 className="text-headline-md text-primary mb-sm">Inicia sesión para ver tus matches</h2>
            <Link href="/login" className="inline-flex bg-primary text-white rounded-xl px-lg py-md text-label-md">Ir al login</Link>
          </div>
        ) : list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {list.map(m => <MatchCard key={m.id} m={m} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-outline-variant py-xl text-center gap-md">
            <span className="material-symbols-outlined text-outline-variant text-[48px]">psychology</span>
            <div>
              <h2 className="text-headline-md text-primary mb-xs">Aún no hay matches en esta vista</h2>
              <p className="text-body-md text-on-surface-variant max-w-xl">
                Crea una vacante activa y candidatos; luego pulsa “Generar matches” para poblar esta sección con resultados reales.
              </p>
            </div>
          </div>
        )}

        {top && (
          <section className="bg-primary rounded-2xl overflow-hidden shadow-lg p-lg text-white">
            <div className="flex items-center justify-between flex-wrap gap-md mb-md">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <h2 className="text-label-md font-bold">Sugerencia de la IA</h2>
                  <p className="text-[11px] text-white/60">Mejor candidato calculado con el motor Fase 1</p>
                </div>
              </div>
              <span className="bg-secondary text-white text-label-sm font-bold px-md py-xs rounded-full flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                {top.score}% Match
              </span>
            </div>
            <p className="text-body-sm text-white/90 leading-relaxed">
              <strong>{top.candidatoNombre}</strong> es la recomendación principal para <strong>{top.vacanteTitulo}</strong>.
              {top.razones?.length ? ` ${top.razones.join(" ")}` : ""}
            </p>
            <div className="flex flex-wrap gap-md mt-md">
              <Link href={`/entrevista/${top.candidatoId}`} className="bg-secondary text-white text-label-sm px-lg py-sm rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-sm">
                <span className="material-symbols-outlined text-[16px]">event</span>
                Programar entrevista
              </Link>
              <Link href={`/matches/${top.id}`} className="bg-white text-primary text-label-sm font-bold px-lg py-sm rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-sm">
                <span className="material-symbols-outlined text-[16px]">person</span>
                Ver detalle
              </Link>
            </div>
          </section>
        )}
      </main>
      <Link href="/vacantes/nueva" className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40" aria-label="Publicar nueva vacante">
        <span className="material-symbols-outlined">add</span>
      </Link>
    </>
  );
}
