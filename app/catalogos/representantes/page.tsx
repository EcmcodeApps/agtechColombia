"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getRepresentantes, saveRepresentante, updateRepresentante, deleteRepresentante,
  getUserPlan, REP_LIMITS, type RepresentanteRecord,
} from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BLANK: Omit<RepresentanteRecord, "uid" | "createdAt"> = {
  nombre: "", cargo: "", telefono: "", email: "", fotoUrl: "", orden: 0,
};

export default function RepresentantesPage() {
  const { user } = useAuth();
  const [reps, setReps]         = useState<RepresentanteRecord[]>([]);
  const [plan, setPlan]         = useState("gratuito");
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ ...BLANK });
  const [editId, setEditId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [show, setShow]         = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [preview, setPreview]   = useState("");

  const MAX = REP_LIMITS[plan as keyof typeof REP_LIMITS] ?? 0;

  useEffect(() => {
    if (!user) return;
    getUserPlan(user.uid).then(p => setPlan(p ?? "gratuito"));
    getRepresentantes(user.uid).then(r => { setReps(r); setLoading(false); });
  }, [user]);

  function openNew() {
    setForm({ ...BLANK, orden: reps.length }); setEditId(null);
    setFotoFile(null); setPreview(""); setShow(true);
  }

  function openEdit(r: RepresentanteRecord) {
    setForm({ nombre: r.nombre, cargo: r.cargo, telefono: r.telefono, email: r.email, fotoUrl: r.fotoUrl ?? "", orden: r.orden });
    setEditId(r.id!); setFotoFile(null); setPreview(r.fotoUrl ?? ""); setShow(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let fotoUrl = form.fotoUrl;
      if (fotoFile) {
        const r = ref(storage, `representantes/${user.uid}/${Date.now()}`);
        await uploadBytes(r, fotoFile);
        fotoUrl = await getDownloadURL(r);
      }
      const data = { ...form, fotoUrl, uid: user.uid };
      if (editId) {
        await updateRepresentante(editId, data);
        setReps(prev => prev.map(r => r.id === editId ? { ...r, ...data } : r));
      } else {
        const id = await saveRepresentante(data as RepresentanteRecord);
        setReps(prev => [...prev, { ...data, id, createdAt: null as never }]);
      }
      setShow(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    await deleteRepresentante(id);
    setReps(prev => prev.filter(r => r.id !== id));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface font-headline">Representantes</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant">{reps.length}/{MAX}</span>
          <button onClick={openNew} disabled={reps.length >= MAX}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity">
            + Agregar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : reps.length === 0 ? (
        <div className="rounded-3xl bg-surface-container-low border border-outline-variant p-10 text-center">
          <p className="text-4xl mb-3">👤</p>
          <p className="font-semibold text-on-surface">Sin representantes</p>
          <p className="text-sm text-on-surface-variant mt-1">Agrega a tu equipo comercial</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reps.sort((a, b) => a.orden - b.orden).map(r => (
            <div key={r.id} className="rounded-3xl bg-surface-container-low border border-outline-variant p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {r.fotoUrl
                  ? <img src={r.fotoUrl} alt={r.nombre} className="h-14 w-14 rounded-full object-cover border border-outline-variant" />
                  : <div className="h-14 w-14 rounded-full bg-primary-container flex items-center justify-center text-2xl">👤</div>
                }
                <div>
                  <p className="font-semibold text-on-surface text-sm">{r.nombre}</p>
                  <p className="text-xs text-on-surface-variant">{r.cargo}</p>
                </div>
              </div>
              {r.telefono && <p className="text-xs text-on-surface-variant">{r.telefono}</p>}
              {r.email    && <p className="text-xs text-on-surface-variant">{r.email}</p>}
              <div className="flex gap-2">
                <button onClick={() => openEdit(r)}
                  className="flex-1 rounded-xl border border-outline-variant py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                  Editar
                </button>
                <button onClick={() => handleDelete(r.id!)}
                  className="flex-1 rounded-xl border border-error py-2 text-xs font-medium text-error hover:bg-error-container transition-colors">
                  Eliminar
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
            <h2 className="font-bold text-on-surface font-headline">{editId ? "Editar" : "Nuevo"} representante</h2>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { label: "Nombre", key: "nombre", type: "text" },
                { label: "Cargo",  key: "cargo",  type: "text" },
                { label: "Teléfono", key: "telefono", type: "tel" },
                { label: "Email",  key: "email",  type: "email" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">{f.label}</label>
                  <input type={f.type} value={(form as never)[f.key]} required={f.key === "nombre"}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none focus:border-primary" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Foto</label>
                {preview && <img src={preview} alt="preview" className="h-12 w-12 rounded-full object-cover mb-1 border border-outline-variant" />}
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-outline-variant px-3 py-2 text-xs text-on-surface-variant hover:bg-surface-container transition-colors">
                  {fotoFile ? fotoFile.name : "Seleccionar foto"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) { setFotoFile(f); setPreview(URL.createObjectURL(f)); } }} />
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
