"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Filter = "Todos" | "Pendientes" | "Entrevistas" | "Archivados";
interface Conv { id: string; name: string; role: string; av: string; last: string; time: string; unread: boolean; online: boolean; }
interface Msg  { id: string; from: "me" | "them"; text: string; time: string; }

const CONVS: Conv[] = [
  { id: "mateo", name: "Mateo Rivera",  role: "Desarrollador Full-stack", av: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVIVBmehhrFmWDbCJ64VopHgG7so2xurrmcauE1icNj56YZSIYNkxS_8SGlcJOZkVFUedzDc_gEAyYXVqIZz1ZJNCxMSkartF_bVUG_MJOKZNhabFl_5z664QmHPQ2LO4wh4yU7MrPvs7iK6TYF85xcPoA6jupo6_O_J7aZi5MP_qzq_PsVtw3PcotH9P8qQa1Ltb2Mi3eLpEnwtwbMp3zGqr6bRjpMcBY9M1rFxbOnZZlbjvFk3AbmwvH9Kn32j8w_Uqkc0UWGw", last: "Me encantaría agendar la entrevista para el próximo lunes...", time: "10:45 AM", unread: true,  online: true  },
  { id: "sofia", name: "Sofía Castro",  role: "Desarrolladora",           av: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd2YW1xIyR3HZq8wNc36lp9YAYLDPWwNOD77bnZuv7wiTg2yUmbe6yzdOps-MFwQoYyWKtO2Z4OgOcrU3eFi999jnfbYw2sDOqGW1AiYHQIpj9ge0rFYnAKLbIcTTgwIhgt-QCsr4wf95E3OixPRlj0zPpI6nj9a6UHFzuIfakBEB6pLcig-Fd8u4ggdp3dJHV1aBLgqggvV5Gh1xv6lbFhOz0AHXW_i4LsKVF-gLhqiWSPPTTEpk5Qur3BujsI-cwOF_AkXs2uw", last: "Gracias por la información sobre el puesto de Desarrollador.", time: "Ayer",     unread: false, online: false },
  { id: "lucas", name: "Lucas Herrera", role: "Diseñador",                av: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdlYqVZ3WAAMrYhsqSqT_HcyJM9ZgXpM9l0RUQyciXn4stGlg8iWZ3LkM4CqeKmET7h4eBFJrn7cMnw2CYN0a1kMUQL4l3RDwHQ9LUqPAjy6Ie2oz2G2XGKEZ2YkID7yZrjm1_EO-0V3TyH5aZGSUwDubukXN6zv6IRuBbU6WTPvnuQl_wBxL3_IbqdavsCtIOD4LW0s8eS7awjj2qSQouKeydkkexFcZBDoWQCD2pYRti9zl78Q5FdCgr1t5yxM3Utyqa_qS4Q", last: "Adjunto mi portafolio actualizado para su revisión.",         time: "2 oct",    unread: false, online: false },
  { id: "elena", name: "Elena Vargas",  role: "Diseñadora UX",            av: "https://lh3.googleusercontent.com/aida-public/AB6AXuDixlz0bI90F8kSwsIXB5qfu9SWEW5YVJlW_H51A2d3TWWvVA4TtxFYDgVsBipuH_Ph7hRUJKJbTJWZIiDVSgnzphBRBFHG7bQ7Ndq7KxSQxiw8JDt6jHhs5FT4HRlYDis-n1hyyYHO-7iMAGQVfnZJNNHw3wk_HCC84GxI-xLUsLcT97jGwyiAlkSi3TL_RIjOIMEJzk71wJHZP8GYqE7JoKqR9ZRboso2YZBZrJT3pVmfHTjwz8f6MDnlQASNo_e0UplXJ77ETw", last: "¿Cuándo podríamos tener la llamada técnica?",                time: "1 oct",    unread: true,  online: true  },
];

const INIT_MSGS: Msg[] = [
  { id: "1", from: "them", text: "Hola, he revisado la propuesta técnica y me parece muy interesante. Tengo disponibilidad el lunes a las 10:00 AM para la entrevista.", time: "10:42 AM" },
  { id: "2", from: "me",   text: "¡Excelente, Mateo! El lunes a las 10:00 AM funciona perfecto. Te enviaré la invitación de Google Calendar en breve.", time: "10:44 AM" },
  { id: "3", from: "them", text: "Me encantaría agendar la entrevista para el próximo lunes. Quedo atento a la invitación. ¡Muchas gracias!", time: "10:45 AM" },
];

const FILTERS: Filter[] = ["Todos", "Pendientes", "Entrevistas", "Archivados"];

const RECRUITER_AV = "https://lh3.googleusercontent.com/aida-public/AB6AXuBqxH8khS4pvtcfGQu2TgDCwVR9sQCXiBJpqaYI75lFDJTZgMU95SOK0hGC0nwVPmOZBhUzNBGTPsctJ91PgCFdWAIzg399gT0HOvjvPs6jkaP3RlYrGWzBNx3eThd1HiSnteb6nfPEQ0ZN259o9RYRR31jAe_RgtavOotwmOYcjaZIBRWDNPFHi6CY4L7iKzFWgudeGAcoKtD4BGaqBW-ZXCVqh8MDfK3pE32lbXRahHh8WSFcxW--VUH7gaX6b9vH5cfsp9YoxA";

export default function MensajesPage() {
  const [active, setActive] = useState("mateo");
  const [filter, setFilter] = useState<Filter>("Todos");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(INIT_MSGS);
  const endRef = useRef<HTMLDivElement>(null);

  const conv = CONVS.find(c => c.id === active)!;

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    setMsgs(p => [...p, { id: Date.now().toString(), from: "me", text, time }]);
    setInput("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop bg-surface/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-base">
          <span className="material-symbols-outlined text-primary text-[32px]">hub</span>
          <span className="text-headline-md font-bold text-primary">TalentoYa</span>
        </div>
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity" aria-label="Notificaciones">notifications</button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
            <Image src={RECRUITER_AV} alt="Perfil" width={40} height={40} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="pt-16 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mt-lg grid grid-cols-1 md:grid-cols-12 gap-gutter min-h-[calc(100vh-120px)]">

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-md">
            <h1 className="text-headline-lg text-primary mt-base">Mensajes</h1>

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
              <input type="text" placeholder="Buscar candidatos..."
                className="w-full pl-10 pr-md py-sm bg-surface-container-low border-none rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm placeholder:text-outline transition-all" />
            </div>

            <div className="flex gap-xs overflow-x-auto pb-xs">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`whitespace-nowrap px-md py-xs rounded-full text-label-md transition-all ${filter === f ? "bg-primary text-white shadow-sm" : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-xs">
              {CONVS.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)}
                  className={`flex items-center gap-sm p-md rounded-2xl text-left transition-all hover:bg-primary/[0.04] ${active === c.id ? "bg-white shadow-sm border border-primary/10" : ""}`}>
                  <div className="relative flex-shrink-0">
                    <Image src={c.av} alt={c.name} width={48} height={48}
                      className={`w-12 h-12 rounded-full object-cover ${!c.online ? "opacity-80" : ""}`} />
                    {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className={`text-label-md truncate ${c.unread ? "text-on-surface" : "text-on-surface-variant"}`}>{c.name}</h3>
                      <span className={`text-label-sm flex-shrink-0 ${c.unread ? "text-primary" : "text-outline"}`}>{c.time}</span>
                    </div>
                    <p className={`text-body-sm truncate ${c.unread ? "text-on-surface-variant font-semibold" : "text-outline"}`}>{c.last}</p>
                  </div>
                  {c.unread && <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* ── Chat panel (desktop) ─────────────────────────────────── */}
          <div className="hidden md:flex md:col-span-8 lg:col-span-9 bg-white rounded-3xl shadow-sm border border-surface-container flex-col overflow-hidden">

            {/* Chat header */}
            <div className="p-lg flex justify-between items-center border-b border-surface-container">
              <div className="flex items-center gap-md">
                <Image src={conv.av} alt={conv.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h2 className="text-headline-md text-on-surface leading-tight">{conv.name}</h2>
                  <p className="text-label-sm text-secondary flex items-center gap-xs">
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                    En línea · {conv.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-md">
                {(["call", "videocam"] as const).map(icon => (
                  <button key={icon} className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-primary hover:bg-primary/5 transition-all">
                    <span className="material-symbols-outlined">{icon}</span>
                  </button>
                ))}
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-all shadow-md">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-lg overflow-y-auto flex flex-col gap-lg bg-surface/30">
              <div className="flex items-center gap-md py-md">
                <div className="flex-1 h-px bg-surface-container" />
                <span className="text-label-sm text-outline uppercase tracking-wider">Hoy</span>
                <div className="flex-1 h-px bg-surface-container" />
              </div>
              {msgs.map(m => (
                <div key={m.id} className={`flex items-end gap-md max-w-[80%] ${m.from === "me" ? "ml-auto flex-row-reverse" : ""}`}>
                  {m.from === "them" && (
                    <Image src={conv.av} alt={conv.name} width={32} height={32} className="w-8 h-8 rounded-full mb-2 flex-shrink-0" />
                  )}
                  <div className={`p-md rounded-2xl shadow-sm ${m.from === "me" ? "bg-primary text-white rounded-br-none" : "bg-white border border-surface-container text-on-surface rounded-bl-none"}`}>
                    <p className="text-body-md">{m.text}</p>
                    <span className={`block mt-xs text-label-sm text-right ${m.from === "me" ? "text-white/70" : "text-outline"}`}>{m.time}</span>
                  </div>
                  {m.from === "me" && (
                    <span className="material-symbols-outlined text-primary mb-2 text-sm flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-lg bg-white border-t border-surface-container">
              <div className="flex items-center gap-md bg-surface-container-low rounded-2xl px-md py-xs ring-1 ring-surface-container-high focus-within:ring-primary transition-all">
                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors" aria-label="Adjuntar">attach_file</button>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-body-md text-on-surface py-sm placeholder:text-outline" />
                <button onClick={send} disabled={!input.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 flex-shrink-0">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* WhatsApp FAB */}
      <button className="fixed right-6 bottom-24 md:bottom-8 bg-[#25D366] text-white p-md rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all z-40 group" aria-label="Soporte WhatsApp">
        <div className="flex items-center gap-xs">
          <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.197 1.441 4.934 1.442 5.333 0 9.673-4.34 9.676-9.672.002-2.584-1.005-5.013-2.835-6.845-1.83-1.832-4.258-2.84-6.845-2.842-5.335 0-9.674 4.34-9.677 9.674-.001 2.105.672 4.108 1.948 5.795l-1.03 3.764 3.829-.966zm10.373-7.141c-.276-.138-1.636-.808-1.89-.9-.252-.092-.436-.138-.62.138-.184.277-.712.9-.873 1.084-.161.185-.322.208-.598.07-.276-.138-1.169-.43-2.227-1.374-.824-.735-1.38-1.644-1.541-1.921-.161-.277-.017-.427.121-.565.124-.124.276-.322.414-.484.138-.162.184-.277.276-.462.092-.185.046-.347-.023-.485-.069-.138-.62-1.493-.849-2.047-.223-.538-.468-.465-.64-.474l-.547-.01c-.19 0-.498.071-.758.347-.26.277-.992.97-.992 2.368s1.015 2.748 1.157 2.933c.142.185 1.996 3.048 4.834 4.27.675.291 1.202.464 1.611.594.678.214 1.295.184 1.782.112.544-.08 1.636-.669 1.866-1.315.23-.646.23-1.2.161-1.315-.069-.115-.253-.184-.529-.322z"/>
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-[10rem] transition-all duration-500 text-label-md whitespace-nowrap">Hablar con Soporte</span>
        </div>
      </button>
    </div>
  );
}
