"use client";

import { useEffect, useState, useRef } from "react";
import {
  getNoticias, saveNoticia, updateNoticia, deleteNoticia,
  type NoticiaRecord,
} from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";

const BLANK: Omit<NoticiaRecord, "id" | "createdAt"> = {
  titulo: "", resumen: "", contenido: "", imagenUrl: "", fecha: Timestamp.now(), estado: "borrador", tipo: "noticia",
};

const TIPO_OPTS  = ["noticia", "evento", "convocatoria"] as const;
const ESTADO_OPTS = ["borrador", "publicado", "archivado"] as const;

export default function AdminNoticiasPage() {
  const [items, setItems]     = useState<NoticiaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ ...BLANK });
  const [editId, setEditId]   = useState<string | null>(null);
  const [show, setShow]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [filter, setFilter]   = useState("todos");
  const imgRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getNoticias().then(n => { setItems(n); setLoading(false); });
  }, []);

  function openNew() {
    setForm({ ...BLANK }); setEditId(null); setImgFile(null); setPreview(""); setShow(true);
  }

  function openEdit(n: NoticiaRecord) {
    setForm({ titulo: n.titulo, resumen: n.resumen, contenido: n.contenido, imagenUrl: n.imagenUrl ?? "", fecha: n.fecha, estado: n.estado, tipo: n.tipo });
    setEditId(n.id!); setImgFile(null); setPreview(n.imagenUrl ?? ""); setShow(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      let imagenUrl = form.imagenUrl;
      if (imgFile) {
        const r = ref(storage, `noticias/${Date.now()}_${imgFile.name}`);
        await uploadBytes(r, imgFile);
        imagenUrl = await getDownloadURL(r);
      }
      const data = { ...form, imagenUrl };
      if (editId) {
        await updateNoticia(editId, data);
        setItems(prev => prev.map(n => n.id === editId ? { ...n, ...data } : n));
      } else {
        const id = await saveNoticia(data as NoticiaRecord);
        setItems(prev => [{ ...data, id, createdAt: Timestamp.now() }, ...prev]);
      }
      setShow(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    await deleteNoticia(id);
    setItems(prev => prev.filter(n => n.id !== id));
  }

  const filtered = filter === "todos" ? items : items.filter(n => n.estado === filter || n.tipo === filter);

  const ESTADO_COLOR: Record<string, string> = {
    borrador:   "bg-surface-container text-on-surface-variant",
    publicado:  "bg-green-100 text-green-800",
    archivado:  "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface font-headline">Noticias y Eventos</h1>
        <button onClick={openNew}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity">
          + Nueva
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["todos", "publicado", "borrador", "noticia", "evento", "convocatoria"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-10 text-center">
          <p className="text-4xl mb-3">📰</p>
          <p className="font-semibold text-on-surface">Sin noticias</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 flex gap-4">
              {n.imagenUrl && (
                <img src={n.imagenUrl} alt={n.titulo} className="h-16 w-16 rounded-xl object-cover shrink-0 border border-outline-variant" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_COLOR[n.estado] ?? ""}`}>{n.estado}</span>
                  <span className="rounded-full bg-primary-container px-2 py-0.5 text-xs text-on-primary-container capitalize">{n.tipo}</span>
                </div>
                <p className="font-semibold text-on-surface text-sm truncate">{n.titulo}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{n.resumen}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {n.fecha?.toDate?.().toLocaleDateString("es-CO") ?? "—"}
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => openEdit(n)}
                  className="rounded-xl border border-outline-variant px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(n.id!)}
                  className="rounded-xl border border-error px-3 py-1.5 text-xs font-medium text-error hover:bg-error-container transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-xl space-y-4">
            <h2 className="font-bold text-on-surface font-headline">{editId ? "Editar" : "Nueva"} noticia/evento</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Tipo</label>
                <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as typeof form.tipo }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary">
                  {TIPO_OPTS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Título</label>
                <input required value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Resumen</label>
                <textarea rows={2} value={form.resumen} onChange={e => setForm(p => ({ ...p, resumen: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Contenido</label>
                <textarea rows={5} value={form.contenido} onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Fecha</label>
                <input type="date"
                  value={form.fecha?.toDate?.().toISOString().split("T")[0] ?? ""}
                  onChange={e => setForm(p => ({ ...p, fecha: Timestamp.fromDate(new Date(e.target.value)) }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Estado</label>
                <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as typeof form.estado }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary">
                  {ESTADO_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Imagen</label>
                {preview && <img src={preview} alt="preview" className="h-20 w-32 rounded-xl object-cover mb-2 border border-outline-variant" />}
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-outline-variant px-3 py-2 text-xs text-on-surface-variant hover:bg-surface-container transition-colors">
                  {imgFile ? imgFile.name : "Seleccionar imagen"}
                  <input ref={imgRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)); } }} />
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShow(false)}
                  className="flex-1 rounded-xl border border-outline-variant py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
