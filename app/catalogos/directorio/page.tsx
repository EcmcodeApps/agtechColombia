"use client";

import { useEffect, useState } from "react";
import { getActiveCompanies, type CompanyRecord } from "@/lib/firebase/firestore";

export default function DirectorioPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [query, setQuery]         = useState("");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getActiveCompanies().then(c => { setCompanies(c); setLoading(false); });
  }, []);

  const filtered = companies.filter(c =>
    c.nombre?.toLowerCase().includes(query.toLowerCase()) ||
    c.ciudad?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Directorio de empresas</h1>

      <input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Buscar empresa o ciudad…"
        className="w-full max-w-md rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-10 text-center">
          <p className="text-4xl mb-3">🏢</p>
          <p className="font-semibold text-on-surface">Sin resultados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.uid} className="rounded-3xl bg-surface-container-low border border-outline-variant p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {c.logoUrl
                  ? <img src={c.logoUrl} alt={c.nombre} className="h-12 w-12 rounded-xl object-cover border border-outline-variant" />
                  : <div className="h-12 w-12 rounded-xl bg-primary-container flex items-center justify-center text-xl">🌱</div>
                }
                <div className="min-w-0">
                  <p className="font-semibold text-on-surface text-sm truncate">{c.nombre}</p>
                  <p className="text-xs text-on-surface-variant">{c.ciudad}</p>
                </div>
              </div>
              {c.descripcion && <p className="text-xs text-on-surface-variant line-clamp-2">{c.descripcion}</p>}
              <div className="flex gap-2 flex-wrap">
                {c.categorias?.map((cat: string) => (
                  <span key={cat} className="rounded-full bg-primary-container px-3 py-1 text-xs text-on-primary-container">{cat}</span>
                ))}
              </div>
              {c.sitioWeb && (
                <a href={c.sitioWeb} target="_blank" rel="noreferrer"
                  className="text-xs text-primary hover:underline truncate">{c.sitioWeb}</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
