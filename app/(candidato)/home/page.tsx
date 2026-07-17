"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { postulacionesService, usuariosService } from "@/app/lib/firestore-service";
import type { Postulacion } from "@/app/lib/types";

const ESTADO_COLOR: Record<Postulacion["estado"], string> = {
  nueva:      "bg-blue-50 text-blue-700",
  revision:   "bg-amber-50 text-amber-700",
  entrevista: "bg-purple-50 text-purple-700",
  oferta:     "bg-green-50 text-green-700",
  contratado: "bg-emerald-50 text-emerald-700",
  rechazado:  "bg-red-50 text-red-600",
};

const ESTADO_LABEL: Record<Postulacion["estado"], string> = {
  nueva:      "Nueva",
  revision:   "En revisión",
  entrevista: "Entrevista",
  oferta:     "Oferta",
  contratado: "Contratado",
  rechazado:  "Rechazado",
};

export default function CandidatoHomePage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      postulacionesService.porCandidato(user.uid),
      usuariosService.get(user.uid),
    ]).then(([posts, usuario]) => {
      setPostulaciones(posts);
      setNombre(usuario?.nombre || user.displayName || "Candidato");
      setLoading(false);
    });
  }, [user]);

  const activas     = postulaciones.filter(p => !["rechazado", "contratado"].includes(p.estado));
  const contratados = postulaciones.filter(p => p.estado === "contratado").length;
  const recientes   = postulaciones.slice(0, 5);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Header azul con stats */}
      <header className="bg-primary text-white px-margin-mobile md:px-margin-desktop pb-xl">
        <div className="max-w-max-width mx-auto">
          <div className="flex justify-between items-center pt-md pb-xl">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-white/80" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="text-label-md font-bold">TalentoYa</span>
            </div>
            <Link href="/candidato/mensajes" aria-label="Mensajes">
              <span className="material-symbols-outlined text-white">notifications</span>
            </Link>
          </div>

          <p className="text-label-md text-white/70 mb-xs">Bienvenido,</p>
          <h1 className="text-headline-lg font-bold mb-xl">{nombre.split(" ")[0]} 👋</h1>

          <div className="grid grid-cols-3 gap-md">
            {[
              { label: "Postulaciones", value: postulaciones.length, icon: "description" },
              { label: "En proceso",    value: activas.length,       icon: "pending"     },
              { label: "Contrataciones",value: contratados,          icon: "handshake"   },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-md text-center">
                <span className="material-symbols-outlined text-white/70 text-[20px]">{s.icon}</span>
                <p className="text-headline-md font-bold mt-xs">{s.value}</p>
                <p className="text-label-sm text-white/70 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl space-y-xl">

        {/* Acción rápida */}
        <Link href="/candidato/vacantes"
          className="flex items-center gap-md bg-white border border-primary/20 rounded-2xl p-lg shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[24px]">search</span>
          </div>
          <div className="flex-1">
            <h3 className="text-label-md font-semibold text-on-surface">Explorar empleos</h3>
            <p className="text-body-sm text-on-surface-variant">Encuentra tu próxima oportunidad</p>
          </div>
          <span className="material-symbols-outlined text-outline">arrow_forward_ios</span>
        </Link>

        {/* Postulaciones recientes */}
        <div>
          <div className="flex justify-between items-center mb-md">
            <h2 className="text-headline-md font-semibold text-on-surface">Mis postulaciones</h2>
            <Link href="/candidato/postulaciones" className="text-label-sm text-primary hover:underline">
              Ver todas
            </Link>
          </div>

          {recientes.length === 0 ? (
            <div className="bg-white rounded-2xl p-2xl text-center border border-surface-container">
              <span className="material-symbols-outlined text-outline text-[48px]">work_history</span>
              <p className="text-body-md text-on-surface-variant mt-md">Aún no te has postulado a ninguna vacante.</p>
              <Link href="/candidato/vacantes"
                className="inline-block mt-lg bg-primary text-white px-xl py-sm rounded-xl text-label-md font-bold">
                Ver empleos disponibles
              </Link>
            </div>
          ) : (
            <div className="space-y-md">
              {recientes.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-md border border-surface-container flex items-center gap-md">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">business</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-semibold text-on-surface truncate">{p.vacanteTitulo}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">{p.empresaNombre}</p>
                  </div>
                  <span className={`text-label-sm px-sm py-xs rounded-full flex-shrink-0 ${ESTADO_COLOR[p.estado]}`}>
                    {ESTADO_LABEL[p.estado]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
