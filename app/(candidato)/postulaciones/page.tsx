"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { postulacionesService } from "@/app/lib/firestore-service";
import type { Postulacion } from "@/app/lib/types";

type Filtro = Postulacion["estado"] | "todas";

const FILTROS: Array<{ key: Filtro; label: string }> = [
  { key: "todas",      label: "Todas"       },
  { key: "nueva",      label: "Nuevas"      },
  { key: "revision",   label: "En revisión" },
  { key: "entrevista", label: "Entrevista"  },
  { key: "oferta",     label: "Oferta"      },
  { key: "contratado", label: "Contratado"  },
  { key: "rechazado",  label: "Rechazado"   },
];

const CFG: Record<Postulacion["estado"], { bg: string; text: string; icon: string; label: string }> = {
  nueva:      { bg: "bg-blue-50   border-blue-200",     text: "text-blue-700",    icon: "fiber_new",       label: "Nueva"       },
  revision:   { bg: "bg-amber-50  border-amber-200",    text: "text-amber-700",   icon: "hourglass_empty", label: "En revisión" },
  entrevista: { bg: "bg-purple-50 border-purple-200",   text: "text-purple-700",  icon: "groups",          label: "Entrevista"  },
  oferta:     { bg: "bg-green-50  border-green-200",    text: "text-green-700",   icon: "local_offer",     label: "Oferta"      },
  contratado: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: "handshake",       label: "Contratado"  },
  rechazado:  { bg: "bg-red-50    border-red-200",      text: "text-red-600",     icon: "cancel",          label: "Rechazado"   },
};

const PIPELINE: Postulacion["estado"][] = ["nueva", "revision", "entrevista", "oferta", "contratado"];

export default function MisPostulacionesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    postulacionesService.porCandidato(user.uid).then(ps => {
      setPostulaciones(ps);
      setLoading(false);
    });
  }, [user]);

  const filtradas = filtro === "todas" ? postulaciones : postulaciones.filter(p => p.estado === filtro);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">

      <header className="sticky top-0 z-50 bg-surface border-b border-outline-variant shadow-sm">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-md">
          <h1 className="text-headline-md font-bold text-primary mb-md">Mis postulaciones</h1>
          <div className="flex gap-xs overflow-x-auto pb-xs">
            {FILTROS.map(({ key, label }) => (
              <button key={key} onClick={() => setFiltro(key)}
                className={`whitespace-nowrap px-md py-xs rounded-full text-label-sm transition-all flex-shrink-0 ${
                  filtro === key
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"
                }`}>
                {label}
                {key !== "todas" && (
                  <span className="ml-xs opacity-70">({postulaciones.filter(p => p.estado === key).length})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-md">
        {filtradas.length === 0 ? (
          <div className="text-center py-2xl">
            <span className="material-symbols-outlined text-outline text-[56px]">description</span>
            <p className="text-body-md text-on-surface-variant mt-md">
              {filtro === "todas"
                ? "Aún no te has postulado a ninguna vacante."
                : `No hay postulaciones con estado "${FILTROS.find(f => f.key === filtro)?.label}".`}
            </p>
          </div>
        ) : filtradas.map(p => {
          const cfg  = CFG[p.estado];
          const step = PIPELINE.indexOf(p.estado);
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-surface-container shadow-sm overflow-hidden">
              <div className="p-lg">
                <div className="flex items-start justify-between gap-md mb-md">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-label-md font-bold text-on-surface">{p.vacanteTitulo}</h3>
                    <p className="text-body-sm text-on-surface-variant">{p.empresaNombre}</p>
                  </div>
                  <span className={`text-label-sm px-sm py-xs rounded-full border flex items-center gap-xs flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                    {cfg.label}
                  </span>
                </div>

                {/* Pipeline visual */}
                {p.estado !== "rechazado" ? (
                  <div className="flex items-center mt-md">
                    {PIPELINE.map((s, i) => {
                      const done    = step >= i;
                      const current = step === i;
                      return (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${done ? "bg-primary" : "bg-surface-container"}`}>
                            {done ? (
                              <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {current ? "radio_button_checked" : "check"}
                              </span>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-outline-variant" />
                            )}
                          </div>
                          {i < PIPELINE.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-0.5 ${step > i ? "bg-primary" : "bg-surface-container"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-body-sm text-error/70 mt-sm">Esta postulación fue rechazada.</p>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
