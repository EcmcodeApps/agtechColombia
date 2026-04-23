"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  getActiveCompanies, getCategoriasActivas,
  type CompanyRecord, type CategoriaRecord,
} from "@/lib/firebase/firestore";

/* ── helpers to normalize flat/step-based company data ──────────────────── */
const cNombre  = (c: CompanyRecord) => c.nombreComercial  || c.step1?.nombreComercial  || c.nombre         || "Sin nombre";
const cPitch   = (c: CompanyRecord) => c.pitchCorto       || c.step3?.pitchCorto       || c.descripcion    || "";
const cCats    = (c: CompanyRecord) => c.categorias       || c.step1?.categorias       || [];
const cDept    = (c: CompanyRecord) => c.departamento     || c.step1?.departamento     || "";
const cCiudad  = (c: CompanyRecord) => c.ciudad           || c.step1?.ciudad           || "";
const cLogo    = (c: CompanyRecord) => c.logoUrl          || c.step1?.logoUrl          || "";
const cPortada = (c: CompanyRecord) => c.portadaUrl       || c.step1?.portadaUrl       || "";
const cSize    = (c: CompanyRecord) => c.tamano           || c.step1?.tamano           || "";

/* ── Colombian departments ───────────────────────────────────────────────── */
const DEPARTAMENTOS = [
  "Antioquia","Atlántico","Bogotá D.C.","Bolívar","Boyacá","Caldas","Caquetá",
  "Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guajira","Huila","Magdalena",
  "Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda",
  "San Andrés","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada",
];

const SIZES = ["1-10","11-50","51+"] as const;

type SortMode = "recent" | "visits" | "alpha";

const PAGE_SIZE = 8;

/* ── Avatar initials ─────────────────────────────────────────────────────── */
function Initials({ name, size = 32, className = "" }: { name: string; size?: number; className?: string }) {
  const init = name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#ef4444"];
  const bg = COLORS[name.charCodeAt(0) % COLORS.length];
  return (
    <div className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
         style={{ width:size, height:size, background:bg, fontSize:size*0.38 }}>
      {init}
    </div>
  );
}

/* ── Star rating ─────────────────────────────────────────────────────────── */
function Stars({ val }: { val: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span className="text-xs font-semibold text-on-surface">{val.toFixed(1)}</span>
    </div>
  );
}

/* ── Company Card ────────────────────────────────────────────────────────── */
function CompanyCard({ company, view }: { company: CompanyRecord; view: "grid"|"list" }) {
  const nombre  = cNombre(company);
  const pitch   = cPitch(company);
  const logo    = cLogo(company);
  const portada = cPortada(company);
  const dept    = cDept(company);
  const cats    = cCats(company);
  const isDestacada = (company.plan === "empresa" || company.plan === "profesional");

  if (view === "list") return (
    <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-4 flex gap-4 items-start hover:shadow-md transition-shadow group">
      {/* Logo */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/30">
        {logo
          ? <img src={logo} alt={nombre} className="w-full h-full object-contain p-1" />
          : <Initials name={nombre} size={56} className="w-full h-full rounded-xl" />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-on-surface">{nombre}</span>
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Verificada" />
            {isDestacada && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">DESTACADA</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {company.calificacion ? <Stars val={company.calificacion} /> : null}
            <Link href={`/empresa/${company.uid}`}
              className="text-xs font-semibold text-primary hover:underline whitespace-nowrap group-hover:text-primary/80">
              Ver perfil ›
            </Link>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{pitch}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {cats.slice(0,3).map(cat => (
            <span key={cat} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">{cat}</span>
          ))}
          {dept && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{dept}</span>
          )}
        </div>
      </div>
    </div>
  );

  /* ── Grid card ── */
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      {/* Portada */}
      <div className="relative h-28 bg-surface-container-high overflow-hidden">
        {portada
          ? <img src={portada} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-primary-container to-surface-container" />
        }
        {isDestacada && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">DESTACADA</span>
        )}
        {/* Floating logo */}
        <div className="absolute -bottom-5 left-3 w-12 h-12 rounded-xl overflow-hidden bg-white border-2 border-white shadow-md">
          {logo
            ? <img src={logo} alt={nombre} className="w-full h-full object-contain p-0.5" />
            : <Initials name={nombre} size={48} className="w-full h-full rounded-xl" />
          }
        </div>
      </div>

      <div className="pt-7 px-3 pb-3 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm text-on-surface leading-tight">{nombre}</span>
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Verificada" />
        </div>
        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{pitch}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {cats.slice(0,2).map(cat => (
            <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-medium">{cat}</span>
          ))}
          {dept && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">{dept}</span>}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/30">
          {company.calificacion ? <Stars val={company.calificacion} /> : <span />}
          <Link href={`/empresa/${company.uid}`}
            className="text-xs font-semibold text-primary hover:underline group-hover:text-primary/80">
            View Profile ›
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar Filters ─────────────────────────────────────────────────────── */
function SidebarFilters({
  depts, setDepts, size, setSize, verified, setVerified, onApply, onClear,
}: {
  depts: string[]; setDepts: (d: string[]) => void;
  size: string; setSize: (s: string) => void;
  verified: boolean; setVerified: (v: boolean) => void;
  onApply: () => void; onClear: () => void;
}) {
  function toggleDept(d: string) {
    setDepts(depts.includes(d) ? depts.filter(x=>x!==d) : [...depts, d]);
  }
  const topDepts = ["Antioquia","Cundinamarca","Valle del Cauca","Santander","Boyacá"];
  return (
    <aside className="flex flex-col gap-5">
      <div>
        <p className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase mb-3">
          Refine by Colombian Region
        </p>

        <div className="mb-4">
          <p className="text-xs font-bold text-on-surface mb-2">Departments</p>
          <div className="flex flex-col gap-1.5">
            {topDepts.map(d => (
              <label key={d} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={depts.includes(d)} onChange={() => toggleDept(d)}
                  className="rounded accent-primary w-3.5 h-3.5" />
                <span className="text-xs text-on-surface">{d}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-bold text-on-surface mb-2">Size</p>
          <select value={size} onChange={e => setSize(e.target.value)}
            className="w-full bg-surface-container rounded-xl px-3 py-2 text-xs text-on-surface outline-none border border-outline-variant focus:ring-2 focus:ring-primary/30">
            <option value="">All Sizes</option>
            {SIZES.map(s => <option key={s} value={s}>{s} empleados</option>)}
          </select>
        </div>

        <div className="mb-4">
          <p className="text-xs font-bold text-on-surface mb-2">Verified status</p>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-on-surface">Verified only</span>
            <button onClick={() => setVerified(!verified)} role="switch" aria-checked={verified}
              className={`relative w-10 h-5 rounded-full transition-colors ${verified ? "bg-primary" : "bg-outline-variant"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${verified ? "left-5" : "left-0.5"}`} />
            </button>
          </label>
        </div>
      </div>

      <button onClick={onApply}
        className="w-full bg-primary text-on-primary font-semibold text-sm rounded-2xl py-2.5 hover:bg-[oklch(0.38_0.14_145)] transition-colors">
        Apply Filters
      </button>
      <button onClick={onClear} className="text-xs text-on-surface-variant hover:text-primary text-center underline">
        Limpiar filtros
      </button>

      <div className="border-t border-outline-variant pt-4 flex flex-col gap-2">
        <Link href="/dashboard/ajustes" className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface">
          ⚙️ Settings
        </Link>
        <Link href="/foro" className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface">
          ❓ Help Center
        </Link>
      </div>
    </aside>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function DirectorioPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser]             = useState<User|null>(null);
  const [companies, setCompanies]   = useState<CompanyRecord[]>([]);
  const [cats, setCats]             = useState<CategoriaRecord[]>([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState<"grid"|"list">("grid");
  const [sort, setSort]             = useState<SortMode>("recent");
  const [search, setSearch]         = useState("");
  const [selectedCat, setSelectedCat] = useState<string>(searchParams.get("cat") ?? "");
  const [page, setPage]             = useState(1);
  // filter state (staged until Apply is clicked)
  const [stagedDepts, setStagedDepts]     = useState<string[]>([]);
  const [stagedSize, setStagedSize]       = useState("");
  const [stagedVerified, setStagedVerified] = useState(false);
  // applied filters
  const [depts, setDepts]       = useState<string[]>([]);
  const [size, setSize]         = useState("");
  const [verified, setVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  useEffect(() => {
    Promise.all([getActiveCompanies(), getCategoriasActivas()]).then(([c, k]) => {
      setCompanies(c);
      setCats(k);
      setLoading(false);
    });
  }, []);

  const activeCat = useMemo(() => cats.find(c => c.slug === selectedCat || c.nombre === selectedCat), [cats, selectedCat]);

  const filtered = useMemo(() => {
    let res = [...companies];
    // Category filter
    if (selectedCat) {
      res = res.filter(c => {
        const cc = cCats(c);
        return cc.some(cat => cat === selectedCat || cat === activeCat?.nombre || cat === activeCat?.slug);
      });
    }
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(c => cNombre(c).toLowerCase().includes(q) || cPitch(c).toLowerCase().includes(q));
    }
    // Department filter
    if (depts.length > 0) res = res.filter(c => depts.includes(cDept(c)));
    // Size filter
    if (size) res = res.filter(c => cSize(c) === size);
    // Verified filter
    if (verified) res = res.filter(c => c.activa);
    // Sort
    if (sort === "alpha") res.sort((a,b) => cNombre(a).localeCompare(cNombre(b)));
    else if (sort === "visits") res.sort((a,b) => (b.visitas??0)-(a.visitas??0));
    else res.sort((a,b) => {
      const ta = (a.createdAt as {seconds?:number})?.seconds ?? 0;
      const tb = (b.createdAt as {seconds?:number})?.seconds ?? 0;
      return tb - ta;
    });
    // Destacadas primero
    res.sort((a,b) => {
      const aD = a.plan === "empresa" || a.plan === "profesional" ? 1 : 0;
      const bD = b.plan === "empresa" || b.plan === "profesional" ? 1 : 0;
      return bD - aD;
    });
    return res;
  }, [companies, selectedCat, search, depts, size, verified, sort, activeCat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  function handleCatSelect(slug: string) {
    setSelectedCat(slug);
    setPage(1);
    router.push(slug ? `/directorio?cat=${slug}` : "/directorio", { scroll: false });
  }

  function applyFilters() {
    setDepts(stagedDepts);
    setSize(stagedSize);
    setVerified(stagedVerified);
    setPage(1);
    setSidebarOpen(false);
  }

  function clearFilters() {
    setStagedDepts([]); setStagedSize(""); setStagedVerified(false);
    setDepts([]); setSize(""); setVerified(false);
    setPage(1);
  }

  /* ── Pagination numbers ── */
  function pageNums() {
    if (totalPages <= 7) return Array.from({length:totalPages},(_,i)=>i+1);
    if (page <= 4) return [1,2,3,4,5,'…',totalPages];
    if (page >= totalPages-3) return [1,'…',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
    return [1,'…',page-1,page,page+1,'…',totalPages];
  }

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_145)] flex flex-col">

      {/* ── Top navigation ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-outline-variant shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-bold text-primary font-headline whitespace-nowrap">
            AgTech Colombia
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href:"/directorio", label:"Directorio" },
              { href:"/catalogos/productos", label:"Marketplace" },
              { href:"/foro", label:"AgForo" },
              { href:"/dashboard", label:"Dashboard" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-on-surface text-xl">🔔</button>
            {user
              ? <Link href="/dashboard">
                  {user.photoURL
                    ? <img src={user.photoURL} className="w-8 h-8 rounded-full object-cover" alt="perfil" />
                    : <Initials name={user.displayName||"U"} size={32} />
                  }
                </Link>
              : <Link href="/auth/login"
                  className="text-xs font-semibold bg-primary text-on-primary px-4 py-1.5 rounded-full hover:bg-[oklch(0.38_0.14_145)] transition-colors">
                  Ingresar
                </Link>
            }
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">

        {/* ── Sidebar (desktop) ── */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-5">
            <h2 className="text-sm font-bold text-on-surface mb-1">Filters</h2>
            <SidebarFilters
              depts={stagedDepts} setDepts={setStagedDepts}
              size={stagedSize} setSize={setStagedSize}
              verified={stagedVerified} setVerified={setStagedVerified}
              onApply={applyFilters} onClear={clearFilters}
            />
          </div>
        </div>

        {/* ── Mobile filter drawer ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-scrim/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 bg-white h-full overflow-y-auto p-5 shadow-xl ml-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-on-surface">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-2xl leading-none text-on-surface-variant">×</button>
              </div>
              <SidebarFilters
                depts={stagedDepts} setDepts={setStagedDepts}
                size={stagedSize} setSize={setStagedSize}
                verified={stagedVerified} setVerified={setStagedVerified}
                onApply={applyFilters} onClear={clearFilters}
              />
            </div>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <span>›</span>
            <Link href="/directorio" className="hover:text-primary">Directorio</Link>
            {activeCat && <>
              <span>›</span>
              <span className="text-on-surface font-medium">{activeCat.nombre}</span>
            </>}
          </nav>

          {/* Category header card */}
          {activeCat ? (
            <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                   style={{ background: activeCat.color+"20" }}>
                {activeCat.icono}
              </div>
              <div>
                <h1 className="text-lg font-bold text-on-surface">{activeCat.nombre}</h1>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {filtered.length} empresas • {activeCat.descripcion}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant/40 shadow-sm px-5 py-4">
              <h1 className="text-lg font-bold text-on-surface">Colombian AgTech Ecosystem</h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {companies.length} empresas innovando la agricultura en Colombia
              </p>
            </div>
          )}

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <button onClick={() => handleCatSelect("")}
              className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all border ${
                !selectedCat ? "bg-primary text-on-primary border-primary shadow-sm" : "bg-white text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
              }`}>
              Todos
            </button>
            {cats.map(cat => (
              <button key={cat.id} onClick={() => handleCatSelect(cat.slug)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all border ${
                  selectedCat === cat.slug || selectedCat === cat.nombre
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-white text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
                }`}>
                <span>{cat.icono}</span> {cat.nombre}
              </button>
            ))}
          </div>

          {/* Search + toggles */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile filter button */}
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-white border border-outline-variant rounded-xl px-3 py-2 text-xs font-medium text-on-surface-variant hover:border-primary">
              ⚙️ Filtros {(depts.length + (size ? 1 : 0) + (verified ? 1 : 0)) > 0 && <span className="bg-primary text-on-primary rounded-full w-4 h-4 text-[10px] flex items-center justify-center">{depts.length + (size ? 1 : 0) + (verified ? 1 : 0)}</span>}
            </button>

            <div className="flex-1 relative min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">🔍</span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search companies..."
                className="w-full bg-white border border-outline-variant rounded-xl pl-9 pr-4 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>

            {/* Grid/List toggle */}
            <div className="flex bg-white border border-outline-variant rounded-xl overflow-hidden">
              <button onClick={() => setView("grid")}
                className={`px-3 py-2 text-sm transition-colors ${view==="grid" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>
                ⊞
              </button>
              <button onClick={() => setView("list")}
                className={`px-3 py-2 text-sm transition-colors ${view==="list" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"}`}>
                ☰
              </button>
            </div>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value as SortMode)}
              className="bg-white border border-outline-variant rounded-xl px-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/30">
              <option value="recent">Sort by: Most Recent</option>
              <option value="visits">Sort by: Most Visited</option>
              <option value="alpha">Sort by: A–Z</option>
            </select>
          </div>

          {/* Company grid/list */}
          {loading ? (
            <div className={view==="grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
              {Array.from({length:6}).map((_,i) => (
                <div key={i} className={`bg-white rounded-2xl animate-pulse border border-outline-variant/30 ${view==="grid" ? "h-52" : "h-20"}`} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
              <span className="text-5xl">🔍</span>
              <p className="font-semibold text-on-surface">No se encontraron empresas</p>
              <button onClick={clearFilters} className="text-sm text-primary hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <div className={view==="grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
              : "flex flex-col gap-3"
            }>
              {paginated.map(c => (
                <CompanyCard key={c.uid} company={c} view={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-on-surface-variant hover:bg-white disabled:opacity-30 border border-transparent hover:border-outline-variant">
                ‹
              </button>
              {pageNums().map((n, i) =>
                n === '…'
                  ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-on-surface-variant">…</span>
                  : <button key={n} onClick={() => setPage(n as number)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === n
                          ? "bg-primary text-on-primary shadow-sm"
                          : "text-on-surface-variant hover:bg-white border border-transparent hover:border-outline-variant"
                      }`}>{n}</button>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-on-surface-variant hover:bg-white disabled:opacity-30 border border-transparent hover:border-outline-variant">
                ›
              </button>
            </div>
          )}

          {/* CTA Banner */}
          <div className="rounded-2xl bg-primary text-on-primary p-6 flex items-center justify-between gap-4 flex-wrap mt-2">
            <div>
              <p className="font-bold text-base">¿No encuentras tu empresa?</p>
              <p className="text-sm text-on-primary/80 mt-1">
                Únete al directorio AgTech más grande de Colombia y conecta con inversionistas y aliados clave.
              </p>
            </div>
            <Link href="/onboarding"
              className="flex-shrink-0 bg-white text-primary font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-on-primary/10 transition-colors">
              Add your company
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
