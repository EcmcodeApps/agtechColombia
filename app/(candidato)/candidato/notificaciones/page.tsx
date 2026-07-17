"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import {
  postulacionesService,
  conversacionesService,
} from "@/app/lib/firestore-service";
import type { Postulacion, Conversacion } from "@/app/lib/types";

const ESTADO_LABEL: Record<Postulacion["estado"], string> = {
  nueva:      "Nueva",
  revision:   "En revisión",
  entrevista: "Entrevista agendada",
  oferta:     "Oferta enviada",
  contratado: "¡Contratado!",
  rechazado:  "No seleccionado",
};

const ESTADO_ICON: Record<Postulacion["estado"], string> = {
  nueva:      "fiber_new",
  revision:   "hourglass_empty",
  entrevista: "groups",
  oferta:     "local_offer",
  contratado: "handshake",
  rechazado:  "cancel",
};

const ESTADO_COLOR: Record<Postulacion["estado"], string> = {
  nueva:      "bg-blue-100 text-blue-600",
  revision:   "bg-amber-100 text-amber-600",
  entrevista: "bg-purple-100 text-purple-600",
  oferta:     "bg-green-100 text-green-600",
  contratado: "bg-emerald-100 text-emerald-700",
  rechazado:  "bg-red-100 text-red-600",
};

function timeAgo(ts: { toDate?: () => Date } | null | undefined): string {
  if (!ts?.toDate) return "";
  const diff = (Date.now() - ts.toDate().getTime()) / 1000;
  if (diff < 60)  return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function CandidatoNotificacionesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const router = useRouter();
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [convs,         setConvs]         = useState<Conversacion[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      postulacionesService.porCandidato(user.uid),
      conversacionesService.porUsuario(user.uid),
    ]).then(([posts, cs]) => {
      setPostulaciones(posts);
      setConvs(cs);
      setLoading(false);
    });
  }, [user]);

  const updates = postulaciones.filter(p => p.estado !== "nueva");
  const unreadConvs = convs.filter(c => c.unreadCount > 0);
  const totalUnread = updates.length + unreadConvs.length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant/30 shadow-sm">
        <div className="h-16 flex items-center justify-between px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <div className="flex items-center gap-sm">
            <h1 className="text-headline-md font-bold text-primary">Notificaciones</h1>
            {totalUnread > 0 && (
              <span className="w-5 h-5 bg-energy-orange text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pt-lg space-y-xl">

        {/* Mensajes no leídos */}
        {unreadConvs.length > 0 && (
          <section>
            <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide mb-md">
              Mensajes sin leer
            </h2>
            <div className="space-y-sm">
              {unreadConvs.map(c => (
                <button
                  key={c.id}
                  onClick={() => router.push("/candidato/mensajes")}
                  className="w-full bg-white rounded-2xl border border-surface-container p-md flex items-center gap-md text-left hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                    {c.candidatoAvatar ? (
                      <img src={c.candidatoAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-sm">
                      <p className="text-label-md font-bold text-on-surface truncate">{c.empresaNombre}</p>
                      <div className="flex items-center gap-xs flex-shrink-0">
                        <span className="w-5 h-5 bg-primary text-white text-[11px] rounded-full flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                        <span className="text-label-sm text-on-surface-variant">{timeAgo(c.lastMessageAt)}</span>
                      </div>
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate mt-xs">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Actualizaciones de postulaciones */}
        <section>
          <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide mb-md">
            Actualizaciones de postulaciones
          </h2>

          {updates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-container p-2xl text-center">
              <span className="material-symbols-outlined text-outline text-[48px] block mb-md">notifications_none</span>
              <p className="text-body-md text-on-surface-variant">Sin actualizaciones aún.</p>
              <p className="text-body-sm text-on-surface-variant mt-xs">
                Te avisaremos cuando una empresa avance tu postulación.
              </p>
            </div>
          ) : (
            <div className="space-y-sm">
              {updates.map(p => {
                const icon  = ESTADO_ICON[p.estado];
                const color = ESTADO_COLOR[p.estado];
                return (
                  <div
                    key={p.id}
                    onClick={() => router.push("/candidato/postulaciones")}
                    className="bg-white rounded-2xl border border-surface-container p-md flex items-center gap-md cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-md font-bold text-on-surface truncate">{ESTADO_LABEL[p.estado]}</p>
                      <p className="text-body-sm text-on-surface-variant truncate mt-xs">
                        Tu postulación a <span className="font-semibold text-on-surface">{p.vacanteTitulo}</span>
                        {" "}en <span className="text-on-surface">{p.empresaNombre}</span>
                      </p>
                    </div>
                    <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                      {timeAgo(p.updatedAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Postulaciones en estado nueva (sin novedad) */}
        {postulaciones.filter(p => p.estado === "nueva").length > 0 && (
          <section>
            <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide mb-md">
              En espera de revisión
            </h2>
            <div className="space-y-sm">
              {postulaciones.filter(p => p.estado === "nueva").map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-outline-variant/30 p-md flex items-center gap-md opacity-70"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-400 text-[18px]">schedule</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-sm font-semibold text-on-surface truncate">{p.vacanteTitulo}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">{p.empresaNombre}</p>
                  </div>
                  <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                    {timeAgo(p.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
