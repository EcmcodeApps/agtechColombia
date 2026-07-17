"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { conversacionesService } from "@/app/lib/firestore-service";
import type { Conversacion, Mensaje } from "@/app/lib/types";

type Filter = "Todos" | "No leídos" | "Archivados";
const FILTERS: Filter[] = ["Todos", "No leídos", "Archivados"];

export default function EmpresaMensajesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [convs,    setConvs]    = useState<Conversacion[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs,     setMsgs]     = useState<Mensaje[]>([]);
  const [input,    setInput]    = useState("");
  const [sending,  setSending]  = useState(false);
  const [filter,   setFilter]   = useState<Filter>("Todos");
  const [search,   setSearch]   = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Escuchar conversaciones en tiempo real
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "conversaciones"),
      where("participantes", "array-contains", user.uid),
      orderBy("lastMessageAt", "desc")
    );
    return onSnapshot(q, snap =>
      setConvs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Conversacion)))
    );
  }, [user]);

  // Escuchar mensajes del chat activo
  useEffect(() => {
    if (!activeId) { setMsgs([]); return; }
    const q = query(
      collection(db, `conversaciones/${activeId}/mensajes`),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, snap => {
      setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Mensaje)));
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
  }, [activeId]);

  const activeConv = convs.find(c => c.id === activeId);

  const visibles = convs.filter(c => {
    const matchFilter = filter === "Todos" || (filter === "No leídos" && c.unreadCount > 0);
    const matchSearch = !search || c.candidatoNombre.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const send = async () => {
    const text = input.trim();
    if (!text || !activeId || !user || sending) return;
    setSending(true);
    setInput("");
    try {
      await conversacionesService.enviarMensaje(activeId, user.uid, text);
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">

      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-base">
          <span className="material-symbols-outlined text-primary text-[32px]">hub</span>
          <span className="text-headline-md font-bold text-primary">TalentoYa</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">person</span>
        </div>
      </header>

      <main className="pt-16 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mt-lg grid grid-cols-1 md:grid-cols-12 gap-gutter" style={{ height: "calc(100vh - 100px)" }}>

          {/* Sidebar */}
          <div className={`md:col-span-4 lg:col-span-3 flex flex-col gap-md overflow-y-auto ${activeId ? "hidden md:flex" : "flex"}`}>
            <h1 className="text-headline-lg text-primary mt-base flex-shrink-0">Mensajes</h1>

            <div className="relative group flex-shrink-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar candidatos..."
                className="w-full pl-10 pr-md py-sm bg-surface-container-low border-none rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm placeholder:text-outline transition-all" />
            </div>

            <div className="flex gap-xs overflow-x-auto pb-xs flex-shrink-0">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`whitespace-nowrap px-md py-xs rounded-full text-label-md transition-all ${filter === f ? "bg-primary text-white shadow-sm" : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-xs overflow-y-auto min-h-0">
              {visibles.length === 0 ? (
                <div className="text-center py-xl">
                  <span className="material-symbols-outlined text-outline text-[40px]">chat</span>
                  <p className="text-body-sm text-on-surface-variant mt-md">Sin conversaciones aún.</p>
                </div>
              ) : visibles.map(c => (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className={`flex items-center gap-sm p-md rounded-2xl text-left transition-all hover:bg-primary/[0.04] flex-shrink-0 ${activeId === c.id ? "bg-white shadow-sm border border-primary/10" : ""}`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {c.candidatoAvatar ? (
                        <img src={c.candidatoAvatar} alt={c.candidatoNombre} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-label-md">{c.candidatoNombre.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-label-md truncate text-on-surface font-semibold">{c.candidatoNombre}</h3>
                      {c.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-primary text-white text-[11px] rounded-full flex items-center justify-center flex-shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-body-sm truncate text-on-surface-variant">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Panel de chat */}
          {activeId && activeConv ? (
            <div className="flex md:col-span-8 lg:col-span-9 bg-white rounded-3xl shadow-sm border border-surface-container flex-col overflow-hidden">
              <div className="p-lg flex items-center gap-md border-b border-surface-container flex-shrink-0">
                <button onClick={() => setActiveId(null)} className="md:hidden text-on-surface-variant">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {activeConv.candidatoAvatar ? (
                    <img src={activeConv.candidatoAvatar} alt={activeConv.candidatoNombre} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-label-md">{activeConv.candidatoNombre.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface leading-tight">{activeConv.candidatoNombre}</h2>
                  {activeConv.vacanteTitulo && (
                    <p className="text-label-sm text-on-surface-variant">{activeConv.vacanteTitulo}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 p-lg overflow-y-auto flex flex-col gap-lg bg-surface/30 min-h-0">
                {msgs.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <span className="material-symbols-outlined text-outline text-[40px]">chat_bubble</span>
                      <p className="text-body-sm text-on-surface-variant mt-sm">Inicia la conversación con {activeConv.candidatoNombre}</p>
                    </div>
                  </div>
                )}
                {msgs.map(m => {
                  const isMe = m.senderId === user?.uid;
                  return (
                    <div key={m.id} className={`flex items-end gap-md max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                      <div className={`p-md rounded-2xl shadow-sm ${isMe ? "bg-primary text-white rounded-br-none" : "bg-white border border-surface-container text-on-surface rounded-bl-none"}`}>
                        <p className="text-body-md">{m.texto}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              <div className="p-lg bg-white border-t border-surface-container flex-shrink-0">
                <div className="flex items-center gap-md bg-surface-container-low rounded-2xl px-md py-xs ring-1 ring-surface-container-high focus-within:ring-primary transition-all">
                  <input type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-body-md text-on-surface py-sm placeholder:text-outline" />
                  <button onClick={send} disabled={!input.trim() || sending}
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex md:col-span-8 lg:col-span-9 bg-white rounded-3xl shadow-sm border border-surface-container items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-outline text-[56px]">chat</span>
                <p className="text-body-md text-on-surface-variant mt-md">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
