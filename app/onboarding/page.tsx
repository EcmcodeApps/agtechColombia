"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  saveCompanyStep,
  markOnboardingComplete,
  getActiveCategories,
  type CategoriaRecord,
} from "@/lib/firebase/firestore";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const STEPS = ["Empresa", "Contacto", "Categorías", "Logo"];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep]             = useState(0);
  const [saving, setSaving]         = useState(false);
  const [categorias, setCategorias] = useState<CategoriaRecord[]>([]);

  // Step 0 – Empresa
  const [nombre, setNombre]           = useState("");
  const [nit, setNit]                 = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Step 1 – Contacto
  const [ciudad, setCiudad]     = useState("");
  const [telefono, setTelefono] = useState("");
  const [sitioWeb, setSitioWeb] = useState("");

  // Step 2 – Categorías
  const [cats, setCats] = useState<string[]>([]);

  // Step 3 – Logo
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview]   = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    getActiveCategories().then(setCategorias);
  }, []);

  function toggleCat(id: string) {
    setCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleNext() {
    if (!user) return;
    setSaving(true);
    try {
      if (step === 0) await saveCompanyStep(user.uid, { nombre, nit, descripcion });
      if (step === 1) await saveCompanyStep(user.uid, { ciudad, telefono, sitioWeb });
      if (step === 2) await saveCompanyStep(user.uid, { categorias: cats });
      if (step === 3) {
        let logoUrl = "";
        if (logoFile) {
          const r = ref(storage, `companies/${user.uid}/logo`);
          await uploadBytes(r, logoFile);
          logoUrl = await getDownloadURL(r);
        }
        await saveCompanyStep(user.uid, { logoUrl });
        await markOnboardingComplete(user.uid);
        router.replace("/dashboard");
        return;
      }
      setStep(s => s + 1);
    } finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-lg space-y-6 rounded-3xl bg-surface-container-low p-8 shadow-sm">
        {/* Progress */}
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-outline-variant"}`} />
          ))}
        </div>
        <h2 className="text-xl font-bold text-on-surface font-headline">{STEPS[step]}</h2>

        {step === 0 && (
          <div className="space-y-4">
            {[
              { label: "Nombre de la empresa", value: nombre, set: setNombre, placeholder: "Agro Innovaciones S.A.S." },
              { label: "NIT", value: nit, set: setNit, placeholder: "900.123.456-7" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Descripción</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3}
                placeholder="Breve descripción de tu empresa…"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {[
              { label: "Ciudad", value: ciudad, set: setCiudad, placeholder: "Bogotá" },
              { label: "Teléfono / WhatsApp", value: telefono, set: setTelefono, placeholder: "+57 310 000 0000" },
              { label: "Sitio web (opcional)", value: sitioWeb, set: setSitioWeb, placeholder: "https://tuempresa.com" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-on-surface-variant">Selecciona las categorías que mejor describen tu empresa</p>
            <div className="flex flex-wrap gap-2">
              {categorias.map(c => (
                <button key={c.id} onClick={() => toggleCat(c.id!)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    cats.includes(c.id!)
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {c.icono} {c.nombre}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">Sube el logo de tu empresa (opcional)</p>
            {preview && (
              <img src={preview} alt="preview" className="h-24 w-24 rounded-2xl object-cover border border-outline-variant" />
            )}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant p-4 hover:bg-surface-container transition-colors">
              <span className="text-sm text-on-surface-variant">
                {logoFile ? logoFile.name : "Haz clic para seleccionar imagen"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 rounded-xl border border-outline-variant py-3 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              Atrás
            </button>
          )}
          <button onClick={handleNext} disabled={saving}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity">
            {saving ? "Guardando…" : step === STEPS.length - 1 ? "Finalizar" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
