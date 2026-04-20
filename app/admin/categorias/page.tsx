"use client";

import { useEffect, useState } from "react";
import {
  getCategories, saveCategoria, updateCategoria, deleteCategoria,
  type CategoriaRecord,
} from "@/lib/firebase/firestore";

const BLANK: Omit<CategoriaRecord, "id" | "createdAt"> = {
  nombre: "", icono: "🌱", descripcion: "", orden: 0, activa: true, archivada: false,
};

export default function AdminCategoriasPage() {
  const [cats, setCats]   = useState<CategoriaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]   = useState({ ...BLANK });
  const [editId, setEditId] = useState<string | null>(null);
  const [show, setShow]   = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(c => { setCats(c); setLoading(false); });
  }, []);

  function openNew() { setForm({ ...BLANK, orden: cats.length }); setEditId(null); setShow(true); }
  function openEdit(c: CategoriaRecord) { setForm({ nombre: c.nombre, icono: c.icono, descripcion: c.descripcion, orden: c.orden, activa: c.activa, archivada: c.archivada }); setEditId(c.id!); setShow(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) {
        await updateCategoria(editId, form);
        setCats(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
      } else {
        const id = await saveCategoria(form as CategoriaRecord);
        setCats(prev => [...prev, { ...form, id, createdAt: null as never }]);
      }
      setShow(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    await deleteCategoria(id);
    setCats(prev => prev.filter(c => c.id !== id));
  }

  async function toggleActiva(c: CategoriaRecord) {
    await updateCategoria(c.id!, { activa: !c.activa });
    setCats(prev => prev.map(x => x.id === c.id ? { ...x, activa: !c.activa } : x));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface font-headline">Categorías</h1>
        <button onClick={openNew}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity">
          + Nueva
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.sort((a, b) => a.orden - b.orden).map(c => (
            <div key={c.id} className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{c.icono}</span>
                <div className="flex-1">
                  <p className="font-semibold text-on-surface text-sm">{c.nombre}</p>
                  <p className="text-xs text-on-surface-variant">{c.descripcion}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.activa ? "bg-green-100 text-green-800" : "bg-surface-container text-on-surface-variant"}`}>
                  {c.activa ? "Activa" : "Inactiva"}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)}
                  className="flex-1 rounded-xl border border-outline-variant py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  Editar
                </button>
                <button onClick={() => toggleActiva(c)}
                  className="flex-1 rounded-xl border border-outline-variant py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  {c.activa ? "Desactivar" : "Activar"}
                </button>
                <button onClick={() => handleDelete(c.id!)}
                  className="rounded-xl border border-error px-3 py-1.5 text-xs font-medium text-error hover:bg-error-container transition-colors">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-xl space-y-4">
            <h2 className="font-bold text-on-surface font-headline">{editId ? "Editar" : "Nueva"} categoría</h2>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { label: "Nombre", key: "nombre", type: "text" },
                { label: "Icono (emoji)", key: "icono", type: "text" },
                { label: "Descripción", key: "descripcion", type: "text" },
                { label: "Orden", key: "orden", type: "number" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">{f.label}</label>
                  <input type={f.type} required={f.key !== "descripcion"} value={(form as never)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary" />
                </div>
              ))}
              <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                <input type="checkbox" checked={form.activa} onChange={e => setForm(p => ({ ...p, activa: e.target.checked }))} />
                Activa
              </label>
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
