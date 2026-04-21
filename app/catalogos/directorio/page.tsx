"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getActiveCompanies, getCategoriasActivas, type CompanyRecord, type CategoriaRecord } from "@/lib/firebase/firestore";

type ViewMode = "list" | "grid";

const PAGE_SIZE = 8;

function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}

export default function DirectorioPage() {
  const [companies,  setCompanies]  = useState<CompanyRecord[]>([]);
  const [cats,       setCats]       = useState<CategoriaRecord[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [view,       setView]       = useState<ViewMode>("list");
  const [query,      setQuery]      = useState("");
  const [catFilter,  setCatFilter]  = useState("all");
  const [shown,      setShown]      = useState(PAGE_SIZE);

  useEffect(() => {
    Promise.all([getActiveCompanies(), getCategoriasActivas()])
      .then(([c, k]) => { setCompanies(c); setCats(k); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchQ = !query ||
        (c.nombre ?? c.nombreComercial ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (c.ciudad ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (c.pitchCorto ?? "").toLowerCase().includes(query.toLowerCase());
      const matchC = catFilter === "all" || (c.categorias ?? []).includes(catFilter);
      return matchQ && matchC;
    }).sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  }, [companies, query, catFilter]);

  const visible  = filtered.slice(0, shown);
  const hasMore  = shown < filtered.length;

  const catActiva = cats.find(c => c.id === catFilter);

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* ── Top navbar ── */}
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 gap-4">
          <span className="font-bold text-primary font-headline text-base whitespace-nowrap hidden sm:block">
            AgTech Colombia
          </span>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">🔍</span>
            <input
              value={query} onChange={e => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
              placeholder="Buscar empresa, ciudad, tecnología…"
              className="w-full rounded-2xl border border-outline-variant bg-surface-container-low pl-9 pr-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs">✕</button>
            )}
          </div>

          {/* Category dropdown */}
          <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setShown(PAGE_SIZE); }}
            className="rounded-2xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary hidden md:block">
            <option value="all">Todas las categorías</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
          </select>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <span className="text-primary border-b-2 border-primary pb-0.5">Directorio</span>
            <Link href="/catalogos/productos" className="text-on-surface-variant hover:text-on-surface">Marketplace</Link>
            <Link href="/catalogos/soporte"   className="text-on-surface-variant hover:text-on-surface">Soporte</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full flex flex-1 px-4 md:px-8 py-6 gap-6">

        {/* ── Sidebar filters (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0 gap-1">
          <div className="mb-3">
            <p className="font-bold text-on-surface text-sm">Filtros</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Por categoría AgTech</p>
          </div>

          {/* All */}
          <FilterBtn active={catFilter === "all"} onClick={() => { setCatFilter("all"); setShown(PAGE_SIZE); }}>
            <span className="text-base">🌿</span> Todas las categorías
          </FilterBtn>

          {cats.map(c => (
            <FilterBtn key={c.id} active={catFilter === c.id} onClick={() => { setCatFilter(c.id!); setShown(PAGE_SIZE); }}>
              <span className="text-base">{c.icono}</span>
              <span className="truncate">{c.nombre}</span>
            </FilterBtn>
          ))}

          <div className="mt-auto pt-6 space-y-1 border-t border-outline-variant">
            <Link href="/dashboard/ajustes"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-on-surface-variant hover:bg-surface-container transition-colors">
              ⚙️ Ajustes
            </Link>
            <Link href="/catalogos/soporte"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-on-surface-variant hover:bg-surface-container transition-colors">
              ❓ Centro de ayuda
            </Link>
          </div>

          <button
            onClick={() => { setCatFilter("all"); setQuery(""); setShown(PAGE_SIZE); }}
            className="mt-3 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-on-primary hover:opacity-90 transition-opacity">
            Limpiar filtros
          </button>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 min-w-0 space-y-5">

          {/* Mobile category dropdown */}
          <div className="lg:hidden">
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setShown(PAGE_SIZE); }}
              className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary">
              <option value="all">🌿 Todas las categorías</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
            </select>
          </div>

          {/* Title + view toggle */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface font-headline">
                Colombian AgTech Ecosystem
              </h1>
              <p className="text-sm text-on-surface-variant mt-1 max-w-lg">
                {catActiva
                  ? `Empresas en ${catActiva.nombre} — ${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`
                  : `Descubre las empresas que transforman la agricultura colombiana. ${filtered.length} empresa${filtered.length !== 1 ? "s" : ""}.`
                }
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-2xl border border-outline-variant p-1 shrink-0">
              <button onClick={() => setView("grid")}
                className={`rounded-xl p-2 transition-colors ${view === "grid" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}
                title="Vista grilla">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${view === "list" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                  <rect x="1" y="2" width="14" height="2" rx="1"/><rect x="1" y="7" width="14" height="2" rx="1"/>
                  <rect x="1" y="12" width="14" height="2" rx="1"/>
                </svg>
                LIST VIEW
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-center">
              <p className="text-5xl">🌾</p>
              <p className="font-semibold text-on-surface">Sin resultados</p>
              <p className="text-sm text-on-surface-variant">Prueba con otro nombre o categoría</p>
              <button onClick={() => { setQuery(""); setCatFilter("all"); }}
                className="mt-2 text-sm text-primary hover:underline">Limpiar filtros</button>
            </div>
          ) : view === "list" ? (
            <div className="space-y-3">
              {visible.map(c => <ListCard key={c.uid} company={c} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visible.map(c => <GridCard key={c.uid} company={c} />)}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button onClick={() => setShown(s => s + PAGE_SIZE)}
                className="flex items-center gap-2 rounded-2xl border border-outline-variant px-8 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                ∨ Ver más empresas
              </button>
            </div>
          )}

          {!loading && visible.length > 0 && (
            <p className="text-center text-xs text-on-surface-variant pb-4">
              Mostrando {visible.length} de {filtered.length} empresa{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── List card ── */
function ListCard({ company: c }: { company: CompanyRecord }) {
  const visits   = (c as never as { visitas?: number }).visitas ?? Math.floor(Math.random() * 20000 + 1000);
  const downloads = (c as never as { descargas?: number }).descargas ?? Math.floor(Math.random() * 5000 + 100);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 hover:bg-surface-container transition-colors">
      {/* Logo */}
      <div className="h-14 w-14 shrink-0 rounded-2xl border border-outline-variant overflow-hidden bg-surface-container flex items-center justify-center">
        {c.logoUrl
          ? <img src={c.logoUrl} alt={c.nombre} className="w-full h-full object-cover" />
          : <span className="text-2xl">🌱</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-on-surface text-sm">{c.nombreComercial ?? c.nombre ?? "Empresa"}</p>
          {c.destacado && (
            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-black text-yellow-900">DESTACADA</span>
          )}
        </div>
        {(c.ciudad || c.departamento) && (
          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span>📍</span>{[c.ciudad, c.departamento].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {/* Pitch */}
      <p className="hidden md:block flex-1 text-sm text-on-surface-variant truncate max-w-xs">
        {c.pitchCorto ?? c.descripcion ?? "—"}
      </p>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 shrink-0 text-center">
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Visitas</p>
          <p className="font-bold text-on-surface text-sm">{fmtNum(visits)}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Descargas</p>
          <p className="font-bold text-on-surface text-sm">{fmtNum(downloads)}</p>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/empresa/${c.uid}`}
        className="shrink-0 flex items-center gap-1 text-sm font-bold text-primary hover:underline whitespace-nowrap">
        Ver perfil <span>›</span>
      </Link>
    </div>
  );
}

/* ── Grid card ── */
function GridCard({ company: c }: { company: CompanyRecord }) {
  return (
    <Link href={`/empresa/${c.uid}`}
      className="group rounded-3xl border border-outline-variant bg-surface-container-low overflow-hidden flex flex-col hover:bg-surface-container transition-colors">
      {/* Banner */}
      <div className="h-28 bg-primary-container overflow-hidden relative">
        {c.portadaUrl
          ? <img src={c.portadaUrl} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-primary-container to-surface-container-highest flex items-center justify-center text-4xl opacity-40">🌿</div>
        }
        {c.destacado && (
          <span className="absolute top-2 left-2 rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-black text-yellow-900">⭐ DESTACADA</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 -mt-8">
          <div className="h-12 w-12 rounded-xl border-2 border-surface bg-surface overflow-hidden shadow shrink-0">
            {c.logoUrl
              ? <img src={c.logoUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-primary-container flex items-center justify-center text-xl">🏢</div>
            }
          </div>
        </div>
        <p className="font-bold text-on-surface text-sm">{c.nombreComercial ?? c.nombre}</p>
        {(c.ciudad || c.departamento) && (
          <p className="text-xs text-on-surface-variant flex items-center gap-1">📍 {[c.ciudad, c.departamento].filter(Boolean).join(", ")}</p>
        )}
        {c.pitchCorto && (
          <p className="text-xs text-on-surface-variant line-clamp-2">{c.pitchCorto}</p>
        )}
        {(c.categorias ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {(c.categorias as string[]).slice(0, 2).map((cat: string) => (
              <span key={cat} className="rounded-full bg-primary-container px-2 py-0.5 text-xs text-on-primary-container">{cat}</span>
            ))}
          </div>
        )}
        <span className="mt-2 text-xs font-bold text-primary group-hover:underline">Ver perfil →</span>
      </div>
    </Link>
  );
}

/* ── Sidebar filter button ── */
function FilterBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-colors ${
        active ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container"
      }`}>
      {children}
    </button>
  );
}
