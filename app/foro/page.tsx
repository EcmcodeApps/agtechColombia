"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  getForoPosts, saveForoPost,
  ForoPost, ForoCategoria,
} from "@/lib/firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* ── category metadata ───────────────────────────────────────────────────── */
const CATS: { value: ForoCategoria | "todos"; label: string; color: string; emoji: string }[] = [
  { value: "todos",         label: "Todos",          color: "bg-surface-variant text-on-surface-variant",  emoji: "🌐" },
  { value: "tecnologia",    label: "Tecnología",     color: "bg-primary-container text-on-primary-container", emoji: "🤖" },
  { value: "cultivos",      label: "Cultivos",       color: "bg-[oklch(0.92_0.08_145)] text-[oklch(0.22_0.10_145)]", emoji: "🌱" },
  { value: "maquinaria",    label: "Maquinaria",     color: "bg-tertiary-container text-[oklch(0.25_0.12_75)]", emoji: "⚙️" },
  { value: "mercados",      label: "Mercados",       color: "bg-[oklch(0.92_0.08_220)] text-[oklch(0.22_0.10_220)]", emoji: "📈" },
  { value: "financiamiento",label: "Financiamiento", color: "bg-[oklch(0.93_0.07_27)] text-[oklch(0.30_0.12_27)]",  emoji: "💰" },
  { value: "general",       label: "General",        color: "bg-surface-container-high text-on-surface",   emoji: "💬" },
];

function relTime(ts: unknown): string {
  if (!ts) return "";
  const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)  return "Ahora";
  if (diff < 3600) return `Hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff/3600)} h`;
  if (diff < 604800) return `Hace ${Math.floor(diff/86400)} días`;
  return d.toLocaleDateString("es-CO", { day:"numeric", month:"short" });
}

function catMeta(v: string) { return CATS.find(c => c.value === v) ?? CATS[CATS.length-1]; }

function Avatar({ name, url, size = 36 }: { name: string; url?: string; size?: number }) {
  const initials = name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const colors = ["bg-primary","bg-tertiary","bg-secondary","bg-[oklch(0.55_0.14_270)]","bg-[oklch(0.55_0.14_200)]"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  if (url) return <img src={url} alt={name} className="rounded-full object-cover" style={{width:size,height:size}} />;
  return (
    <div className={`${bg} text-white rounded-full flex items-center justify-center font-semibold`}
         style={{width:size,height:size,fontSize:size*0.38}}>
      {initials}
    </div>
  );
}

/* ── New Post Modal ──────────────────────────────────────────────────────── */
function NewPostModal({ user, onClose, onCreated }: {
  user: User; onClose: () => void; onCreated: () => void;
}) {
  const [titulo, setTitulo]     = useState("");
  const [cuerpo, setCuerpo]     = useState("");
  const [categoria, setCat]     = useState<ForoCategoria>("general");
  const [imgFile, setImgFile]   = useState<File|null>(null);
  const [preview, setPreview]   = useState("");
  const [loading, setLoading]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit() {
    if (!titulo.trim() || !cuerpo.trim()) return;
    setLoading(true);
    try {
      let imagenUrl = "";
      if (imgFile) {
        const storage = getStorage();
        const sRef = ref(storage, `foro/${user.uid}/${Date.now()}_${imgFile.name}`);
        await uploadBytes(sRef, imgFile);
        imagenUrl = await getDownloadURL(sRef);
      }
      await saveForoPost({
        uid: user.uid,
        autorNombre: user.displayName || "Usuario",
        autorFotoUrl: user.photoURL || undefined,
        titulo, cuerpo, imagenUrl: imagenUrl || undefined,
        categoria, likes: 0, likedBy: [],
        comentariosCount: 0, calificacion: 0,
        estado: "publicado",
      });
      onCreated();
      onClose();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-scrim/40 p-4">
      <div className="bg-surface rounded-3xl w-full max-w-lg shadow-xl flex flex-col gap-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface">Nuevo debate</h2>
          <button onClick={onClose} className="text-on-surface-variant text-2xl leading-none">×</button>
        </div>

        {/* Image upload */}
        <div onClick={() => fileRef.current?.click()}
             className="relative w-full h-40 rounded-2xl bg-surface-container-high overflow-hidden cursor-pointer flex items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary transition-colors">
          {preview
            ? <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="" />
            : <div className="flex flex-col items-center gap-1 text-on-surface-variant">
                <span className="text-3xl">📷</span>
                <span className="text-sm">Añadir imagen (opcional)</span>
              </div>
          }
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Category */}
        <div className="flex flex-wrap gap-2">
          {CATS.slice(1).map(c => (
            <button key={c.value} onClick={() => setCat(c.value as ForoCategoria)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border-2 ${categoria === c.value ? "border-primary ring-2 ring-primary/20" : "border-transparent"} ${c.color}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título del debate..."
          className="w-full bg-surface-container rounded-2xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant" />

        {/* Body */}
        <textarea value={cuerpo} onChange={e => setCuerpo(e.target.value)} rows={5}
          placeholder="¿Qué quieres compartir con la comunidad AgTech?"
          className="w-full bg-surface-container rounded-2xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-on-surface-variant" />

        <button onClick={handleSubmit} disabled={loading || !titulo.trim() || !cuerpo.trim()}
          className="w-full bg-primary text-on-primary rounded-2xl py-3 font-semibold text-sm disabled:opacity-50 hover:bg-[oklch(0.38_0.14_145)] transition-colors">
          {loading ? "Publicando…" : "Publicar debate"}
        </button>
      </div>
    </div>
  );
}

/* ── Post Card ───────────────────────────────────────────────────────────── */
function PostCard({ post, onClick }: { post: ForoPost; onClick: () => void }) {
  const cat = catMeta(post.categoria);
  return (
    <article onClick={onClick}
      className="bg-surface rounded-2xl shadow-sm border border-outline-variant/50 overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]">
      {post.imagenUrl && (
        <div className="w-full h-44 overflow-hidden">
          <img src={post.imagenUrl} alt={post.titulo} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        {/* Category + featured */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
            {cat.emoji} {cat.label}
          </span>
          {post.destacado && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-tertiary-container text-[oklch(0.25_0.12_75)]">⭐ Destacado</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-on-surface leading-snug line-clamp-2">{post.titulo}</h3>

        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{post.cuerpo}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar name={post.autorNombre} url={post.autorFotoUrl} size={24} />
            <span className="text-xs text-on-surface-variant">{post.autorNombre}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span>♡ {post.likes}</span>
            <span>💬 {post.comentariosCount}</span>
            <span>{relTime(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function ForoPage() {
  const router = useRouter();
  const [user, setUser]           = useState<User|null>(null);
  const [posts, setPosts]         = useState<ForoPost[]>([]);
  const [catFil, setCatFil]       = useState<ForoCategoria|"todos">("todos");
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await getForoPosts(catFil === "todos" ? undefined : catFil);
      setPosts(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadPosts(); }, [catFil]);

  const filtered = search.trim()
    ? posts.filter(p => p.titulo.toLowerCase().includes(search.toLowerCase()) || p.cuerpo.toLowerCase().includes(search.toLowerCase()))
    : posts;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-primary text-on-primary shadow-md">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-on-primary/80 hover:text-on-primary text-xl leading-none">←</button>
            <span className="text-lg font-bold font-headline">AgForo</span>
          </div>
          {user
            ? <Avatar name={user.displayName||"U"} url={user.photoURL||undefined} size={32} />
            : <button onClick={() => router.push("/auth/login")}
                className="text-xs bg-on-primary/20 text-on-primary px-3 py-1 rounded-full">Ingresar</button>
          }
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar debates..."
            className="w-full bg-surface-container rounded-2xl pl-9 pr-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCatFil(c.value as ForoCategoria|"todos")}
              className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                catFil === c.value
                  ? "bg-primary text-on-primary shadow-sm"
                  : `${c.color} hover:opacity-80`
              }`}>
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Post count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">{filtered.length} {filtered.length === 1 ? "debate" : "debates"}</p>
          {user && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-full hover:bg-[oklch(0.38_0.14_145)] transition-colors">
              ✏️ Nuevo debate
            </button>
          )}
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-52 bg-surface-container animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
            <span className="text-5xl">💬</span>
            <p className="font-semibold">No hay debates aún</p>
            {user && <p className="text-sm">¡Sé el primero en iniciar una conversación!</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(p => (
              <PostCard key={p.id} post={p} onClick={() => router.push(`/foro/${p.id}`)} />
            ))}
          </div>
        )}
      </main>

      {/* FAB – only mobile, only logged in */}
      {user && (
        <button onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-primary text-on-primary rounded-full text-2xl shadow-xl flex items-center justify-center hover:bg-[oklch(0.38_0.14_145)] transition-all active:scale-95 z-30">
          +
        </button>
      )}

      {/* New post modal */}
      {showModal && user && (
        <NewPostModal user={user} onClose={() => setShowModal(false)} onCreated={loadPosts} />
      )}
    </div>
  );
}
