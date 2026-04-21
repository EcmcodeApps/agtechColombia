"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getGaleriaFotos as getFotos, saveGaleriaFoto, deleteGaleriaFoto,
  getGaleriaVideos as getVideos, saveGaleriaVideo, deleteGaleriaVideo,
  getUserPlan, PLAN_LIMITS,
  type GaleriaFotoRecord, type GaleriaVideoRecord,
} from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

type Tab = "fotos" | "videos";

export default function GaleriaPage() {
  const { user } = useAuth();
  const [tab, setTab]             = useState<Tab>("fotos");
  const [fotos, setFotos]         = useState<GaleriaFotoRecord[]>([]);
  const [videos, setVideos]       = useState<GaleriaVideoRecord[]>([]);
  const [plan, setPlan]           = useState("gratuito");
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const fotoRef  = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const limits    = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] ?? { fotos: 0, videos: 0 };
  const maxFotos  = limits.fotos  ?? 0;
  const maxVideos = limits.videos ?? 0;

  useEffect(() => {
    if (!user) return;
    getUserPlan(user.uid).then(p => setPlan(p ?? "gratuito"));
    Promise.all([getFotos(user.uid), getVideos(user.uid)]).then(([f, v]) => {
      setFotos(f); setVideos(v); setLoading(false);
    }).catch(e => { console.error(e); setLoading(false); });
  }, [user]);

  async function uploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (fotos.length >= maxFotos) { setError(`Tu plan permite máximo ${maxFotos} foto(s).`); return; }
    setUploading(true); setError("");
    try {
      const r = ref(storage, `galeria/${user.uid}/fotos/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      const id  = await saveGaleriaFoto({ uid: user.uid, url, titulo: "", esPrincipal: fotos.length === 0 });
      setFotos(prev => [...prev, { id, uid: user.uid, url, titulo: "", esPrincipal: fotos.length === 0, createdAt: null as never }]);
    } catch { setError("Error al subir la foto."); }
    finally { setUploading(false); if (fotoRef.current) fotoRef.current.value = ""; }
  }

  async function uploadVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (videos.length >= maxVideos) { setError(`Tu plan permite máximo ${maxVideos} video(s).`); return; }
    setUploading(true); setError("");
    try {
      const r = ref(storage, `galeria/${user.uid}/videos/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      const id  = await saveGaleriaVideo({ uid: user.uid, url, titulo: "" });
      setVideos(prev => [...prev, { id, uid: user.uid, url, titulo: "", createdAt: null as never }]);
    } catch { setError("Error al subir el video."); }
    finally { setUploading(false); if (videoRef.current) videoRef.current.value = ""; }
  }

  async function deleteFoto(f: GaleriaFotoRecord) {
    try { await deleteObject(ref(storage, f.url)); } catch { /* ok */ }
    await deleteGaleriaFoto(f.id!);
    setFotos(prev => prev.filter(x => x.id !== f.id));
  }

  async function deleteVideo(v: GaleriaVideoRecord) {
    try { await deleteObject(ref(storage, v.url)); } catch { /* ok */ }
    await deleteGaleriaVideo(v.id!);
    setVideos(prev => prev.filter(x => x.id !== v.id));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface font-headline">Galería</h1>
        <div className="flex gap-2">
          {tab === "fotos" && (
            <>
              <span className="text-sm text-on-surface-variant self-center">{fotos.length}/{maxFotos}</span>
              <button onClick={() => fotoRef.current?.click()} disabled={uploading || fotos.length >= maxFotos}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity">
                {uploading ? "Subiendo…" : "+ Foto"}
              </button>
              <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={uploadFoto} />
            </>
          )}
          {tab === "videos" && (
            <>
              <span className="text-sm text-on-surface-variant self-center">{videos.length}/{maxVideos}</span>
              <button onClick={() => videoRef.current?.click()} disabled={uploading || videos.length >= maxVideos}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity">
                {uploading ? "Subiendo…" : "+ Video"}
              </button>
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={uploadVideo} />
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-surface-container p-1 w-fit">
        {(["fotos", "videos"] as Tab[]).map(t => (
          <button key={t} onClick={() => { setTab(t); setError(""); }}
            className={`rounded-xl px-5 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-surface text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tab === "fotos" ? (
        fotos.length === 0
          ? <EmptyState icon="🖼️" msg="Sin fotos aún" />
          : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {fotos.map(f => (
                <div key={f.id} className="group relative rounded-2xl overflow-hidden border border-outline-variant aspect-square">
                  <img src={f.url} alt={f.titulo} className="w-full h-full object-cover" />
                  {f.esPrincipal && (
                    <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-on-primary">Principal</span>
                  )}
                  <button onClick={() => deleteFoto(f)}
                    className="absolute top-2 right-2 rounded-full bg-inverse-surface/70 p-1 text-inverse-on-surface text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
            </div>
      ) : (
        videos.length === 0
          ? <EmptyState icon="🎬" msg="Sin videos aún" />
          : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map(v => (
                <div key={v.id} className="group relative rounded-2xl overflow-hidden border border-outline-variant aspect-video bg-inverse-surface">
                  <video src={v.url} controls className="w-full h-full object-cover" />
                  <button onClick={() => deleteVideo(v)}
                    className="absolute top-2 right-2 rounded-full bg-inverse-surface/70 p-1 text-inverse-on-surface text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
            </div>
      )}
    </div>
  );
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-10 text-center">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-semibold text-on-surface">{msg}</p>
    </div>
  );
}
