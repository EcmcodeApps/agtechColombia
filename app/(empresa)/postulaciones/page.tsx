"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/app/_components/TopAppBar";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import {
  postulacionesService,
  conversacionesService,
  usuariosService,
  empresasService,
} from "@/app/lib/firestore-service";
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

const ESTADO_CFG: Record<Postulacion["estado"], { bg: string; text: string; label: string; icon: string }> = {
  nueva:      { bg: "bg-blue-50   border-blue-200",     text: "text-blue-700",    label: "Nueva",       icon: "fiber_new"       },
  revision:   { bg: "bg-amber-50  border-amber-200",    text: "text-amber-700",   label: "En revisión", icon: "hourglass_empty" },
  entrevista: { bg: "bg-purple-50 border-purple-200",   text: "text-purple-700",  label: "Entrevista",  icon: "groups"          },
  oferta:     { bg: "bg-green-50  border-green-200",    text: "text-green-700",   label: "Oferta",      icon: "local_offer"     },
  contratado: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Contratado",  icon: "handshake"       },
  rechazado:  { bg: "bg-red-50    border-red-200",      text: "text-red-600",     label: "Rechazado",   icon: "cancel"          },
};

const ESTADOS_OPCIONES: Postulacion["estado"][] = [
  "nueva", "revision", "entrevista", "oferta", "contratado", "rechazado",
];

export default function EmpresaPostulacionesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const router = useRouter();
  const [postulaciones,  setPostulaciones]  = useState<Postulacion[]>([]);
  const [filtro,         setFiltro]         = useState<Filtro>("todas");
  const [loading,        setLoading]        = useState(true);
  const [cambiando,      setCambiando]      = useState<string | null>(null);
  const [contactando,    setContactando]    = useState<string | null>(null);
  const [empresaNombre,  setEmpresaNombre]  = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      postulacionesService.porEmpresa(user.uid),
      usuariosService.get(user.uid),
    ]).then(([posts, usuario]) => {
      setPostulaciones(posts);
      setEmpresaNombre(usuario?.empresaNombre ?? user.displayName ?? "Empresa");
      setLoading(false);
    });
  }, [user]);

  const filtradas = filtro === "todas"
    ? postulaciones
    : postulaciones.filter(p => p.estado === filtro);

  const handleEstado = async (id: string, estado: Postulacion["estado"]) => {
    setCambiando(id);
    try {
      await postulacionesService.cambiarEstado(id, estado);
      setPostulaciones(prev =>
        prev.map(p => p.id === id ? { ...p, estado } : p)
      );
    } finally {
      setCambiando(null);
    }
  };

  const handleContactar = async (p: Postulacion) => {
    if (!user || contactando) return;
    setContactando(p.id);
    try {
      await conversacionesService.findOrCreate(
        user.uid,
        empresaNombre,
        p.candidatoId,
        p.candidatoNombre,
        p.candidatoAvatar,
        p.vacanteId,
        p.vacanteTitulo,
      );
      router.push("/mensajes");
    } finally {
      setContactando(null);
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
    <>
      <TopAppBar
        userName={user?.displayName?.split(" ")[0] ?? "Empresa"}
        userType="Empresa"
        hasNotification={postulaciones.some(p => p.estado === "nueva")}
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto w-full pt-lg pb-28 lg:pb-xl">

        {/* Encabezado */}
        <div className="mb-lg">
          <h1 className="text-headline-lg font-bold text-on-surface">Postulaciones</h1>
          <p className="text-body-md text-on-surface-variant mt-xs">
            {postulaciones.length} candidato{postulaciones.length !== 1 ? "s" : ""} han aplicado a tus vacantes
          </p>
        </div>

        {/* Resumen rápido */}
        {postulaciones.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-md mb-xl">
            {ESTADOS_OPCIONES.map(e => {
              const count = postulaciones.filter(p => p.estado === e).length;
              const cfg   = ESTADO_CFG[e];
              return (
                <button key={e} onClick={() => setFiltro(filtro === e ? "todas" : e)}
                  className={`rounded-2xl p-md text-center border transition-all ${
                    filtro === e ? `${cfg.bg} ${cfg.text} border-current scale-105 shadow-sm` : "bg-white border-surface-container hover:border-primary/30"
                  }`}>
                  <p className="text-headline-md font-bold">{count}</p>
                  <p className="text-label-sm text-on-surface-variant mt-xs leading-tight">{cfg.label}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Filtros en tab */}
        <div className="flex gap-xs overflow-x-auto pb-xs mb-lg">
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

        {/* Lista */}
        {filtradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-container p-2xl text-center">
            <span className="material-symbols-outlined text-outline text-[56px]">description</span>
            <p className="text-body-md text-on-surface-variant mt-md">
              {filtro === "todas"
                ? "Aún no has recibido postulaciones. Publica vacantes para empezar."
                : `No hay postulaciones con estado "${FILTROS.find(f => f.key === filtro)?.label}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-md">
            {filtradas.map(p => {
              const cfg = ESTADO_CFG[p.estado];
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-surface-container shadow-sm p-lg">
                  <div className="flex items-start gap-md">

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.candidatoAvatar ? (
                        <img src={p.candidatoAvatar} alt={p.candidatoNombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-label-md">
                          {p.candidatoNombre.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-sm flex-wrap">
                        <div className="min-w-0">
                          <h3 className="text-label-md font-bold text-on-surface truncate">{p.candidatoNombre}</h3>
                          <p className="text-body-sm text-on-surface-variant truncate">
                            Aplicó a <span className="font-medium text-on-surface">{p.vacanteTitulo}</span>
                          </p>
                        </div>
                        {p.matchScore > 0 && (
                          <div className="flex items-center gap-xs bg-primary/10 text-primary px-sm py-xs rounded-full flex-shrink-0">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            <span className="text-label-sm font-bold">{p.matchScore}%</span>
                          </div>
                        )}
                      </div>

                      {/* Estado badge */}
                      <div className="flex items-center gap-sm mt-sm flex-wrap">
                        <span className={`text-label-sm px-sm py-xs rounded-full border flex items-center gap-xs ${cfg.bg} ${cfg.text}`}>
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="mt-lg flex flex-col sm:flex-row gap-md">

                    {/* Cambiar estado */}
                    <div className="relative flex-1">
                      <select
                        value={p.estado}
                        disabled={cambiando === p.id}
                        onChange={e => handleEstado(p.id, e.target.value as Postulacion["estado"])}
                        className="w-full appearance-none pl-md pr-10 py-sm rounded-xl border border-outline-variant text-body-sm text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-60"
                      >
                        {ESTADOS_OPCIONES.map(e => (
                          <option key={e} value={e}>{ESTADO_CFG[e].label}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
                        {cambiando === p.id ? "sync" : "expand_more"}
                      </span>
                    </div>

                    {/* Contactar */}
                    <button
                      onClick={() => handleContactar(p)}
                      disabled={!!contactando}
                      className="flex items-center justify-center gap-sm px-lg py-sm rounded-xl bg-primary text-white text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex-shrink-0"
                    >
                      {contactando === p.id ? (
                        <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      )}
                      Contactar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
