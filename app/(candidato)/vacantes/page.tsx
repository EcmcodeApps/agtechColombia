"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { vacantesService, postulacionesService, where, orderBy } from "@/app/lib/firestore-service";
import type { Vacante } from "@/app/lib/types";

const CIUDADES = ["Todas", "Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena"];

const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  remoto:     "Remoto",
  hibrido:    "Híbrido",
};

export default function CandidatoVacantesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [vacantes,   setVacantes]   = useState<Vacante[]>([]);
  const [postuladas, setPostuladas] = useState<Set<string>>(new Set());
  const [search,     setSearch]     = useState("");
  const [ciudad,     setCiudad]     = useState("Todas");
  const [loading,    setLoading]    = useState(true);
  const [postulando, setPostulando] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      vacantesService.listar([where("estado", "==", "activa"), orderBy("createdAt", "desc")]),
      postulacionesService.porCandidato(user.uid),
    ]).then(([vs, posts]) => {
      setVacantes(vs);
      setPostuladas(new Set(posts.map(p => p.vacanteId)));
      setLoading(false);
    });
  }, [user]);

  const filtradas = vacantes.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search || v.titulo.toLowerCase().includes(q) || v.categoria.toLowerCase().includes(q) || v.empresaNombre.toLowerCase().includes(q);
    const matchCiudad = ciudad === "Todas" || v.ciudad === ciudad;
    return matchSearch && matchCiudad;
  });

  const handlePostular = async (v: Vacante) => {
    if (!user || postuladas.has(v.id) || postulando) return;
    setPostulando(v.id);
    try {
      await postulacionesService.create({
        vacanteId:        v.id,
        vacanteTitulo:    v.titulo,
        empresaId:        v.empresaId,
        empresaNombre:    v.empresaNombre,
        candidatoId:      user.uid,
        candidatoNombre:  user.displayName || "Candidato",
        candidatoAvatar:  user.photoURL ?? undefined,
        estado:           "nueva",
        matchScore:       0,
      });
      setPostuladas(prev => new Set(prev).add(v.id));
    } finally {
      setPostulando(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Header fijo con búsqueda */}
      <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant shadow-sm">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-md">
          <h1 className="text-headline-md font-bold text-primary mb-md">Empleos disponibles</h1>
          <div className="flex gap-md">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cargo, empresa o categoría..."
                className="w-full pl-10 pr-md py-sm rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md bg-white placeholder:text-outline" />
            </div>
            <select value={ciudad} onChange={e => setCiudad(e.target.value)}
              className="px-md py-sm rounded-xl border border-outline-variant text-body-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary text-on-surface">
              {CIUDADES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <p className="text-body-sm text-on-surface-variant mb-lg">
          {filtradas.length} vacante{filtradas.length !== 1 ? "s" : ""} encontrada{filtradas.length !== 1 ? "s" : ""}
        </p>

        <div className="space-y-md">
          {filtradas.map(v => {
            const yaPostulado = postuladas.has(v.id);
            const isPosting   = postulando === v.id;
            return (
              <div key={v.id} className="bg-white rounded-2xl p-lg border border-surface-container shadow-sm">
                <div className="flex items-start gap-md">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[24px]">business</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-label-md font-bold text-on-surface">{v.titulo}</h3>
                    <p className="text-body-sm text-on-surface-variant">{v.empresaNombre}</p>
                    <div className="flex flex-wrap gap-xs mt-sm">
                      <span className="inline-flex items-center gap-xs text-label-sm text-on-surface-variant bg-surface-container px-sm py-xs rounded-full">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {v.ciudad}
                      </span>
                      <span className="inline-flex items-center gap-xs text-label-sm text-on-surface-variant bg-surface-container px-sm py-xs rounded-full">
                        <span className="material-symbols-outlined text-[14px]">payments</span>
                        ${v.salarioMin.toLocaleString("es-CO")} – ${v.salarioMax.toLocaleString("es-CO")}
                      </span>
                      <span className="inline-flex items-center gap-xs text-label-sm text-on-surface-variant bg-surface-container px-sm py-xs rounded-full">
                        <span className="material-symbols-outlined text-[14px]">laptop_mac</span>
                        {MODALIDAD_LABEL[v.modalidad] ?? v.modalidad}
                      </span>
                    </div>
                  </div>
                </div>

                {v.descripcion && (
                  <p className="text-body-sm text-on-surface-variant mt-md line-clamp-2">{v.descripcion}</p>
                )}

                {v.habilidades?.length > 0 && (
                  <div className="flex flex-wrap gap-xs mt-md">
                    {v.habilidades.slice(0, 4).map(h => (
                      <span key={h} className="text-label-sm bg-primary/10 text-primary px-sm py-xs rounded-full">{h}</span>
                    ))}
                    {v.habilidades.length > 4 && (
                      <span className="text-label-sm text-outline px-xs">+{v.habilidades.length - 4} más</span>
                    )}
                  </div>
                )}

                <button onClick={() => handlePostular(v)} disabled={yaPostulado || !!postulando}
                  className={`w-full mt-lg py-sm rounded-xl text-label-md font-bold transition-all active:scale-[0.98] ${
                    yaPostulado
                      ? "bg-secondary-container text-on-secondary-container cursor-default"
                      : "bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/20"
                  }`}>
                  {isPosting ? (
                    <span className="flex items-center justify-center gap-sm">
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      Postulando...
                    </span>
                  ) : yaPostulado ? (
                    <span className="flex items-center justify-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Postulado
                    </span>
                  ) : "Postularme"}
                </button>
              </div>
            );
          })}

          {filtradas.length === 0 && (
            <div className="text-center py-2xl">
              <span className="material-symbols-outlined text-outline text-[56px]">search_off</span>
              <p className="text-body-md text-on-surface-variant mt-md">No hay vacantes que coincidan.</p>
              <button onClick={() => { setSearch(""); setCiudad("Todas"); }}
                className="mt-lg text-primary text-label-md hover:underline">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
