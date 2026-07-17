"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuthGuard } from "@/app/lib/hooks/useAuthGuard";
import { conversacionesService } from "@/app/lib/firestore-service";
import type { Conversacion, Mensaje } from "@/app/lib/types";

export default function CandidatoMensajesPage() {
  const { user, loading: authLoading } = useAuthGuard("/login");
  const [convs,    setConvs]    = useState<Conversacion[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs,     setMsgs]     = useState<Mensaje[]>([]);
  const [input,    setInput]    = useState("");
  const [sending,  setSending]  = useState(false);
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

  // Escuchar mensajes del chat activo en tiempo real
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
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[40px]">sync</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-50 h-16 flex items-center px-margin-mobile md:px-margin-desktop bg-surface border-b border-outline-variant shadow-sm">
        <h1 className="text-headline-md font-bold text-primary">Mensajes</h1>
      </header>

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-md" style={{ height: "calc(100vh - 128px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-full">

          {/* Lista de conversaciones */}
          <div className={`md:col-span-4 lg:col-span-3 flex flex-col gap-xs overflow-y-auto ${activeId ? "hidden md:flex" : "flex"}`}>
            {convs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-xl">
                <span className="material-symbols-outlined text-outline text-[48px]">chat</span>
                <p className="text-body-md text-on-surface-variant mt-md">Sin conversaciones aún.</p>
                <p className="text-body-sm text-on-surface-variant mt-xs">Las empresas te contactarán aquí cuando muestren interés.</p>
              </div>
            ) : convs.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`flex items-center gap-sm p-md rounded-2xl text-left transition-all hover:bg-primary/[0.04] ${activeId === c.id ? "bg-white shadow-sm border border-primary/10" : ""}`}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">business</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-label-md font-semibold text-on-surface truncate">{c.empresaNombre}</h3>
                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-primary text-white text-[11px] rounded-full flex items-center justify-center flex-shrink-0 ml-xs">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-on-surface-variant truncate">{c.lastMessage}</p>
                  {c.vacanteTitulo && (
                    <p className="text-label-sm text-outline truncate">{c.vacanteTitulo}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Panel de chat */}
          {activeId && activeConv ? (
            <div className={`md:col-span-8 lg:col-span-9 bg-white rounded-2xl border border-surface-container flex flex-col overflow-hidden ${activeId ? "flex" : "hidden md:flex"}`}>
              {/* Chat header */}
              <div className="p-md flex items-center gap-md border-b border-surface-container flex-shrink-0">
                <button onClick={() => setActiveId(null)} className="md:hidden text-on-surface-variant">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">business</span>
                </div>
                <div>
                  <h2 className="text-label-md font-bold text-on-surface">{activeConv.empresaNombre}</h2>
                  {activeConv.vacanteTitulo && (
                    <p className="text-body-sm text-on-surface-variant">{activeConv.vacanteTitulo}</p>
                  )}
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-lg overflow-y-auto flex flex-col gap-md bg-surface/30 min-h-0">
                {msgs.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <span className="material-symbols-outlined text-outline text-[40px]">chat_bubble</span>
                      <p className="text-body-sm text-on-surface-variant mt-sm">Inicia la conversación</p>
                    </div>
                  </div>
                )}
                {msgs.map(m => {
                  const isMe = m.senderId === user?.uid;
                  return (
                    <div key={m.id} className={`flex items-end gap-sm max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                      <div className={`p-md rounded-2xl shadow-sm ${isMe ? "bg-primary text-white rounded-br-none" : "bg-white border border-surface-container text-on-surface rounded-bl-none"}`}>
                        <p className="text-body-sm">{m.texto}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="p-md border-t border-surface-container flex-shrink-0">
                <div className="flex items-center gap-md bg-surface-container-low rounded-2xl px-md py-xs ring-1 ring-surface-container-high focus-within:ring-primary transition-all">
                  <input type="text" value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-body-md text-on-surface py-sm placeholder:text-outline" />
                  <button onClick={send} disabled={!input.trim() || sending}
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex md:col-span-8 lg:col-span-9 bg-white rounded-2xl border border-surface-container items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-outline text-[56px]">chat</span>
                <p className="text-body-md text-on-surface-variant mt-md">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
