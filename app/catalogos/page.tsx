"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCatalogos, saveCatalogo, updateCatalogo, deleteCatalogo,
  getUserPlan, PLAN_LIMITS, type CatalogoRecord,
} from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function CatalogosPage() {
  const { user }        = useAuth();
  const [catalogos, setCatalogos] = useState<CatalogoRecord[]>([]);
  const [plan, setPlan]           = useState<string>("gratuito");
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const fileRef                   = useRef<HTMLInputElement>(null);

  const MAX = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]?.catalogos ?? 1;

  useEffect(() => {
    if (!user) return;
    getUserPlan(user.uid).then(p => setPlan(p ?? "gratuito"));
    getCatalogos(user.uid).then(c => { setCatalogos(c); setLoading(false); });
  }, [user]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (catalogos.length >= MAX) { setError(`Tu plan permite máximo ${MAX} catálogo(s).`); return; }
    setUploading(true); setError("");
    try {
      const r = ref(storage, `catalogos/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      const id  = await saveCatalogo(user.uid, { nombre: file.name.replace(/\.[^.]+$/, ""), url, descargas: 0 });
      setCatalogos(prev => [...prev, { id, uid: user.uid, nombre: file.name.replace(/\.[^.]+$/, ""), url, descargas: 0, createdAt: null as never }]);
    } catch { setError("Error al subir el catálogo."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  async function handleDelete(cat: CatalogoRecord) {
    if (!user) return;
    try { await deleteObject(ref(storage, cat.url)); } catch { /* already deleted */ }
    await deleteCatalogo(cat.id!);
    setCatalogos(prev => prev.filter(c => c.id !== cat.id));
  }

  async function handleRename(cat: CatalogoRecord, nombre: string) {
    await updateCatalogo(cat.id!, { nombre });
    setCatalogos(prev => prev.map(c => c.id === cat.id ? { ...c, nombre } : c));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface font-headline">Mis catálogos</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant">{catalogos.length}/{MAX}</span>
          <button onClick={() => fileRef.current?.click()} disabled={uploading || catalogos.length >= MAX}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity">
            {uploading ? "Subiendo…" : "+ Subir PDF"}
          </button>
          <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : catalogos.length === 0 ? (
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-10 text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-semibold text-on-surface">Sin catálogos</p>
          <p className="text-sm text-on-surface-variant mt-1">Sube tu primer catálogo PDF o imagen</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogos.map(cat => (
            <div key={cat.id} className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📄</span>
                <div className="flex-1 min-w-0">
                  <input
                    defaultValue={cat.nombre}
                    onBlur={e => { if (e.target.value !== cat.nombre) handleRename(cat, e.target.value); }}
                    className="w-full text-sm font-semibold text-on-surface bg-transparent border-b border-transparent focus:border-outline-variant outline-none"
                  />
                  <p className="text-xs text-on-surface-variant mt-0.5">{cat.descargas} descargas</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={cat.url} target="_blank" rel="noreferrer"
                  className="flex-1 rounded-xl border border-outline-variant py-2 text-center text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  Ver
                </a>
                <button onClick={() => handleDelete(cat)}
                  className="flex-1 rounded-xl border border-error py-2 text-xs font-medium text-error hover:bg-error-container transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
