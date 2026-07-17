"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopAppBar from "@/app/_components/TopAppBar";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import {
  postulacionesService,
  conversacionesService,
  usuariosService,
} from "@/app/lib/firestore-service";
import type { Postulacion, Conversacion } from "@/app/lib/types";

function timeAgo(ts: { toDate?: () => Date } | null | undefined): string {
  if (!ts?.toDate) return "";
  const diff = (Date.now() - ts.toDate().getTime()) / 1000;
  if (diff < 60)   return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? "Ayer" : `${days}d`;
}

export default function EmpresaNotificacionesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const router  = useRouter();
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [convs,         setConvs]         = useState<Conversacion[]>([]);
  const [userName,      setUserName]      = useState("");
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      postulacionesService.porEmpresa(user.uid),
      conversacionesService.porUsuario(user.uid),
      usuariosService.get(user.uid),
    ]).then(([posts, cs, usuario]) => {
      setPostulaciones(posts);
      setConvs(cs);
      setUserName(usuario?.empresaNombre ?? user.displayName ?? "Empresa");
      setLoading(false);
    });
  }, [user]);

  const nuevas       = postulaciones.filter(p => p.estado === "nueva");
  const unreadConvs  = convs.filter(c => c.unreadCount > 0);
  const totalUnread  = nuevas.length + unreadConvs.length;

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
        hasNotification={totalUnread > 0}
      />

      <main className="mt-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pt-lg pb-28 lg:pb-xl space-y-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <h1 className="text-headline-lg font-bold text-on-surface">Notificaciones</h1>
            {totalUnread > 0 && (
              <span className="w-6 h-6 bg-energy-orange text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </div>
        </div>

        {/* Estado vacío */}
        {totalUnread === 0 && postulaciones.length === 0 && (
          <div className="bg-white rounded-2xl border border-surface-container p-2xl text-center">
            <span className="material-symbols-outlined text-outline text-[56px] block mb-md">notifications_none</span>
            <h2 className="text-headline-sm text-on-surface mb-sm">Todo al día</h2>
            <p className="text-body-md text-on-surface-variant mb-xl">
              Cuando recibas postulaciones o mensajes aparecerán aquí.
            </p>
            <Link
              href="/vacantes"
              className="inline-flex items-center gap-sm px-xl py-md rounded-xl bg-primary text-white font-bold text-label-md hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">work</span>
              Ver vacantes
            </Link>
          </div>
        )}

        {/* Mensajes no leídos */}
        {unreadConvs.length > 0 && (
          <section>
            <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide mb-md">
              Mensajes nuevos
            </h2>
            <div className="space-y-sm">
              {unreadConvs.map(c => (
                <button
                  key={c.id}
                  onClick={() => router.push("/mensajes")}
                  className="w-full bg-white rounded-2xl border border-surface-container p-md flex items-center gap-md text-left hover:shadow-sm hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                    {c.candidatoAvatar ? (
                      <img src={c.candidatoAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-on-secondary-container font-bold text-label-md">
                        {c.candidatoNombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-sm">
                      <p className="text-label-md font-bold text-on-surface truncate">{c.candidatoNombre}</p>
                      <div className="flex items-center gap-xs flex-shrink-0">
                        <span className="w-5 h-5 bg-primary text-white text-[11px] rounded-full flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                        <span className="text-label-sm text-on-surface-variant">{timeAgo(c.lastMessageAt)}</span>
                      </div>
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate mt-xs">{c.lastMessage}</p>
                    {c.vacanteTitulo && (
                      <p className="text-label-sm text-outline mt-xs">Re: {c.vacanteTitulo}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Nuevas postulaciones */}
        {nuevas.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-md">
              <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide">
                Candidatos nuevos
              </h2>
              <Link href="/postulaciones" className="text-label-sm text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-sm">
              {nuevas.map(p => (
                <div
                  key={p.id}
                  onClick={() => router.push("/postulaciones")}
                  className="bg-white rounded-2xl border-l-4 border-l-primary border border-surface-container p-md flex items-center gap-md cursor-pointer hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.candidatoAvatar ? (
                      <img src={p.candidatoAvatar} alt={p.candidatoNombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary font-bold text-label-md">
                        {p.candidatoNombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-label-md font-bold text-on-surface truncate">{p.candidatoNombre}</p>
                    <p className="text-body-sm text-on-surface-variant truncate mt-xs">
                      Aplicó a <span className="font-semibold text-on-surface">{p.vacanteTitulo}</span>
                    </p>
                    {p.matchScore > 0 && (
                      <div className="flex items-center gap-xs mt-xs">
                        <span className="material-symbols-outlined text-energy-orange text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        <span className="text-label-sm text-energy-orange font-bold">{p.matchScore}% match</span>
                      </div>
                    )}
                  </div>
                  <span className="text-label-sm text-on-surface-variant flex-shrink-0">
                    {timeAgo(p.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Historial (resto de postulaciones en proceso) */}
        {postulaciones.filter(p => p.estado !== "nueva").length > 0 && (
          <section>
            <h2 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide mb-md">
              En proceso
            </h2>
            <div className="space-y-sm">
              {postulaciones
                .filter(p => p.estado !== "nueva")
                .slice(0, 5)
                .map(p => (
                  <div
                    key={p.id}
                    onClick={() => router.push("/postulaciones")}
                    className="bg-white rounded-2xl border border-outline-variant/30 p-md flex items-center gap-md opacity-80 cursor-pointer hover:opacity-100 hover:border-primary/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                      <span className="text-on-surface-variant font-bold text-label-sm">
                        {p.candidatoNombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-sm font-semibold text-on-surface truncate">{p.candidatoNombre}</p>
                      <p className="text-body-sm text-on-surface-variant truncate">{p.vacanteTitulo}</p>
                    </div>
                    <span className="text-label-sm px-sm py-xs rounded-full bg-surface-container text-on-surface-variant capitalize flex-shrink-0">
                      {p.estado}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
