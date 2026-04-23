"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  getForoPost, getForoComentarios, saveForoComentario, deleteForoComentario,
  toggleLikePost,
  ForoPost, ForoComentario,
} from "@/lib/firebase/firestore";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function relTime(ts: unknown): string {
  if (!ts) return "";
  const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)    return "Ahora";
  if (diff < 3600)  return `Hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff/3600)} h`;
  if (diff < 172800) return "Ayer";
  return d.toLocaleDateString("es-CO", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });
}

function Stars({ val }: { val: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(val) ? "text-[oklch(0.65_0.18_75)]" : "text-outline-variant"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-xs text-on-surface-variant ml-1">{val.toFixed(1)}</span>
    </div>
  );
}

function Avatar({ name, url, size = 36 }: { name: string; url?: string; size?: number }) {
  const initials = name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
  const colors = ["bg-primary","bg-tertiary","bg-secondary","bg-[oklch(0.55_0.14_270)]","bg-[oklch(0.55_0.14_200)]"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  if (url) return <img src={url} alt={name} className="rounded-full object-cover flex-shrink-0" style={{width:size,height:size}} />;
  return (
    <div className={`${bg} text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
         style={{width:size,height:size,fontSize:size*0.38}}>
      {initials}
    </div>
  );
}

const CAT_LABELS: Record<string, string> = {
  tecnologia:"Tecnología",cultivos:"Cultivos",maquinaria:"Maquinaria",
  mercados:"Mercados",financiamiento:"Financiamiento",general:"General",
};
const CAT_EMOJI: Record<string, string> = {
  tecnologia:"🤖",cultivos:"🌱",maquinaria:"⚙️",
  mercados:"📈",financiamiento:"💰",general:"💬",
};

/* ── Comment Card ────────────────────────────────────────────────────────── */
function CommentCard({ c, currentUid, onDelete }: {
  c: ForoComentario; currentUid?: string; onDelete: () => void;
}) {
  return (
    <div className="flex gap-3 py-4 border-b border-outline-variant/40 last:border-0">
      <Avatar name={c.autorNombre} url={c.autorFotoUrl} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-on-surface">{c.autorNombre}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">{relTime(c.createdAt)}</span>
            {currentUid === c.uid && (
              <button onClick={onDelete} className="text-xs text-error hover:underline">Eliminar</button>
            )}
          </div>
        </div>
        <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{c.texto}</p>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const [user, setUser]         = useState<User|null>(null);
  const [post, setPost]         = useState<ForoPost|null>(null);
  const [comments, setComments] = useState<ForoComentario[]>([]);
  const [loading, setLoading]   = useState(true);
  const [liked, setLiked]       = useState(false);
  const [likesCount, setLikes]  = useState(0);
  const [comentario, setComentario] = useState("");
  const [sending, setSending]   = useState(false);
  const [showShare, setShowShare] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getForoPost(postId), getForoComentarios(postId)]);
      if (!p) { router.replace("/foro"); return; }
      setPost(p);
      setLikes(p.likes || 0);
      setComments(c);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [postId]);

  useEffect(() => {
    if (user && post) setLiked((post.likedBy ?? []).includes(user.uid));
  }, [user, post]);

  async function handleLike() {
    if (!user || !post?.id) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => prev + (newLiked ? 1 : -1));
    await toggleLikePost(post.id, user.uid, newLiked);
  }

  async function handleComment() {
    if (!user || !comentario.trim()) return;
    setSending(true);
    try {
      await saveForoComentario({
        postId, uid: user.uid,
        autorNombre: user.displayName || "Usuario",
        autorFotoUrl: user.photoURL || undefined,
        texto: comentario.trim(),
        likes: 0, likedBy: [],
      });
      setComentario("");
      await load();
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  }

  async function handleDeleteComment(c: ForoComentario) {
    if (!c.id) return;
    await deleteForoComentario(c.id, postId);
    await load();
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post?.titulo, url });
    } else {
      navigator.clipboard.writeText(url);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  }

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-surface-container-low h-14 flex items-center px-4 gap-3 border-b border-outline-variant">
        <div className="w-6 h-6 bg-surface-container-high rounded animate-pulse" />
        <div className="w-32 h-4 bg-surface-container-high rounded animate-pulse" />
      </div>
      <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
        <div className="w-full h-52 bg-surface-container rounded-2xl animate-pulse" />
        <div className="h-6 w-3/4 bg-surface-container rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
          <div className="h-4 w-24 bg-surface-container rounded animate-pulse mt-2" />
        </div>
        {[1,2,3].map(i => <div key={i} className="h-4 bg-surface-container rounded animate-pulse" style={{width:`${100-i*10}%`}} />)}
      </div>
    </div>
  );

  if (!post) return null;

  const catEmoji = CAT_EMOJI[post.categoria] ?? "💬";
  const catLabel = CAT_LABELS[post.categoria] ?? post.categoria;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/foro")}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-xl leading-none">←</button>
            <span className="text-sm font-semibold text-on-surface truncate max-w-[200px]">
              Detalle de Tema - Foro
            </span>
          </div>
          <button onClick={() => router.push("/foro")}
            className="text-xs font-semibold text-primary hover:underline">AgForo</button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full">
        {/* ── Hero image ── */}
        {post.imagenUrl && (
          <div className="w-full h-56 md:h-72 overflow-hidden relative">
            <img src={post.imagenUrl} alt={post.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Category tag */}
          <span className="inline-flex items-center gap-1 self-start text-xs font-semibold bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
            {catEmoji} {catLabel}
          </span>

          {/* Title */}
          <h1 className="text-xl font-bold text-on-surface leading-snug">{post.titulo}</h1>

          {/* Author row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar name={post.autorNombre} url={post.autorFotoUrl} size={36} />
              <div>
                <p className="text-sm font-semibold text-on-surface">{post.autorNombre}</p>
                <p className="text-xs text-on-surface-variant">{relTime(post.createdAt)}</p>
              </div>
            </div>
            {post.calificacion > 0 && <Stars val={post.calificacion} />}
          </div>

          {/* Body */}
          <div className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
            {post.cuerpo}
          </div>

          {/* Likes + share */}
          <div className="flex items-center gap-4 py-2 border-t border-b border-outline-variant/40">
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? "text-error" : "text-on-surface-variant hover:text-error"}`}>
              <span className="text-lg">{liked ? "❤️" : "♡"}</span> {likesCount}
            </button>
            <div className="relative">
              <button onClick={handleShare}
                className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors">
                <span className="text-lg">🔗</span> Compartido
              </button>
              {showShare && (
                <span className="absolute -top-8 left-0 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                  ¡Enlace copiado!
                </span>
              )}
            </div>
            <span className="ml-auto flex items-center gap-1 text-xs text-on-surface-variant">
              <span>💬</span> {post.comentariosCount} comentarios
            </span>
          </div>

          {/* ── Comments section ── */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Opiniones de la comunidad</h2>
            {user && (
              <button onClick={() => textareaRef.current?.focus()}
                className="text-xs font-semibold text-primary border border-primary px-3 py-1 rounded-full hover:bg-primary-container transition-colors">
                Escribir opinión
              </button>
            )}
          </div>

          {/* Comment list */}
          {comments.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant text-sm">
              <span className="text-3xl block mb-2">💬</span>
              Sé el primero en opinar
            </div>
          ) : (
            <div className="flex flex-col">
              {comments.map(c => (
                <CommentCard key={c.id} c={c} currentUid={user?.uid}
                  onDelete={() => handleDeleteComment(c)} />
              ))}
            </div>
          )}

          {/* ── Add comment ── */}
          {user ? (
            <div className="flex gap-3 items-end pt-2 pb-6">
              <Avatar name={user.displayName||"U"} url={user.photoURL||undefined} size={36} />
              <div className="flex-1 flex flex-col gap-2">
                <textarea ref={textareaRef} value={comentario} onChange={e => setComentario(e.target.value)}
                  rows={3} placeholder="Escribe tu opinión..."
                  className="w-full bg-surface-container rounded-2xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-on-surface-variant"
                  onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleComment(); }} />
                <button onClick={handleComment} disabled={sending || !comentario.trim()}
                  className="self-end bg-primary text-on-primary text-xs font-semibold px-5 py-2 rounded-full disabled:opacity-50 hover:bg-[oklch(0.38_0.14_145)] transition-colors">
                  {sending ? "Enviando…" : "Publicar"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container rounded-2xl p-4 text-center text-sm text-on-surface-variant pb-6">
              <button onClick={() => router.push("/auth/login")} className="text-primary font-semibold hover:underline">
                Inicia sesión
              </button>{" "}para participar en el debate
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
