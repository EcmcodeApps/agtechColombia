"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { savePago } from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PLANES = ["Básico", "Profesional", "Empresa"];

export default function NuevoPagoPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const [plan, setPlan]         = useState(PLANES[0]);
  const [monto, setMonto]       = useState("");
  const [file, setFile]         = useState<File | null>(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setError("");
    try {
      let comprobanteUrl = "";
      if (file) {
        const r = ref(storage, `comprobantes/${user.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(r, file);
        comprobanteUrl = await getDownloadURL(r);
      }
      await savePago(user.uid, { plan, monto: Number(monto), comprobanteUrl, estado: "pendiente" });
      router.replace("/pagos");
    } catch {
      setError("Error al registrar el pago. Intenta de nuevo.");
    } finally { setSaving(false); }
  }

  return (
    <div className="p-6 max-w-md space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Registrar pago</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-surface-container-low border border-outline-variant p-6">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Plan</label>
          <select value={plan} onChange={e => setPlan(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary">
            {PLANES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Monto (COP)</label>
          <input type="number" required min="0" value={monto} onChange={e => setMonto(e.target.value)}
            placeholder="150000"
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Comprobante (imagen o PDF)</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-outline-variant px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
            {file ? file.name : "Seleccionar archivo"}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity">
          {saving ? "Guardando…" : "Registrar pago"}
        </button>
      </form>
    </div>
  );
}
