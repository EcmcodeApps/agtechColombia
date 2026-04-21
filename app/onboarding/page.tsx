"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/firebase/auth";
import {
  markOnboardingComplete,
  getCategoriasActivas,
  type CategoriaRecord,
} from "@/lib/firebase/firestore";
import { db, storage } from "@/lib/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DEPARTAMENTOS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas",
  "Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca",
  "Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño",
  "Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés","Santander",
  "Sucre","Tolima","Valle del Cauca","Vaupés","Vichada",
];

const TABS = ["Datos empresa","Representantes","Descripción"] as const;
type Tab = typeof TABS[number];

// Step 1
interface Step1 {
  logoFile: File | null; logoUrl: string;
  portadaFile: File | null; portadaUrl: string;
  nombreComercial: string; razonSocial: string;
  nit: string; anioFundacion: string;
  categorias: string[];
  departamento: string; ciudad: string;
  tamano: "1-10"|"11-50"|"51+";
  sitioWeb: string;
}
// Step 2
interface Step2 {
  nombre: string; cargo: string; correo: string;
  celular: string; whatsapp: string; linkedin: string;
  fotoFile: File | null; fotoUrl: string;
}
// Step 3
interface Step3 {
  pitchCorto: string; descripcionCompleta: string;
  cultivos: string; zonas: string;
}

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Datos empresa");
  const [saving, setSaving] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaRecord[]>([]);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const logoRef    = useRef<HTMLInputElement>(null);
  const portadaRef = useRef<HTMLInputElement>(null);
  const fotoRef    = useRef<HTMLInputElement>(null);

  const [s1, setS1] = useState<Step1>({
    logoFile: null, logoUrl: "", portadaFile: null, portadaUrl: "",
    nombreComercial: "", razonSocial: "", nit: "", anioFundacion: "",
    categorias: [], departamento: "", ciudad: "", tamano: "1-10", sitioWeb: "",
  });
  const [s2, setS2] = useState<Step2>({
    nombre: "", cargo: "", correo: "", celular: "", whatsapp: "", linkedin: "",
    fotoFile: null, fotoUrl: "",
  });
  const [s3, setS3] = useState<Step3>({
    pitchCorto: "", descripcionCompleta: "", cultivos: "", zonas: "",
  });

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    getCategoriasActivas().then(setCategorias).catch(() => {});
  }, []);

  function pickFile(file: File, key: "logo"|"portada"|"foto") {
    const url = URL.createObjectURL(file);
    if (key === "logo")    setS1(p => ({ ...p, logoFile: file,    logoUrl: url }));
    if (key === "portada") setS1(p => ({ ...p, portadaFile: file, portadaUrl: url }));
    if (key === "foto")    setS2(p => ({ ...p, fotoFile: file,    fotoUrl: url }));
  }

  async function upload(file: File, path: string): Promise<string> {
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  }

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    try {
      const companyRef = doc(db, "companies", user.uid);

      let logoUrl    = s1.logoUrl.startsWith("blob:") ? "" : s1.logoUrl;
      let portadaUrl = s1.portadaUrl.startsWith("blob:") ? "" : s1.portadaUrl;
      let fotoUrl    = s2.fotoUrl.startsWith("blob:") ? "" : s2.fotoUrl;

      if (s1.logoFile)    logoUrl    = await upload(s1.logoFile,    `companies/${user.uid}/logo`);
      if (s1.portadaFile) portadaUrl = await upload(s1.portadaFile, `companies/${user.uid}/portada`);
      if (s2.fotoFile)    fotoUrl    = await upload(s2.fotoFile,    `representantes/${user.uid}/contacto`);

      await setDoc(companyRef, {
        ownerId: user.uid,
        // Step 1
        nombreComercial: s1.nombreComercial, razonSocial: s1.razonSocial,
        nombre: s1.nombreComercial, nit: s1.nit,
        anioFundacion: s1.anioFundacion, categorias: s1.categorias,
        departamento: s1.departamento, ciudad: s1.ciudad,
        tamano: s1.tamano, sitioWeb: s1.sitioWeb || null,
        logoUrl: logoUrl || null, portadaUrl: portadaUrl || null,
        // Step 2
        contacto: {
          nombre: s2.nombre, cargo: s2.cargo, correo: s2.correo,
          celular: s2.celular, whatsapp: s2.whatsapp || null,
          linkedin: s2.linkedin || null, fotoUrl: fotoUrl || null,
        },
        // Step 3
        pitchCorto: s3.pitchCorto,
        descripcionCompleta: s3.descripcionCompleta || null,
        cultivos: s3.cultivos ? s3.cultivos.split(",").map(x => x.trim()) : [],
        zonas: s3.zonas ? s3.zonas.split(",").map(x => x.trim()) : [],
        updatedAt: serverTimestamp(),
      }, { merge: true });

      await markOnboardingComplete(user.uid);
      router.replace("/dashboard");
    } finally { setSaving(false); }
  }

  async function handleNext() {
    if (tab === "Datos empresa")    setTab("Representantes");
    else if (tab === "Representantes") setTab("Descripción");
    else await handleFinish();
  }

  function handleBack() {
    if (tab === "Representantes") setTab("Datos empresa");
    else if (tab === "Descripción") setTab("Representantes");
  }

  const tabIdx = TABS.indexOf(tab);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-surface border-b border-outline-variant">
        <span className="font-bold text-primary font-headline text-lg">AgTech Colombia</span>
        <button onClick={async () => { await logout(); router.replace("/auth/login"); }}
          className="text-sm font-medium text-on-surface-variant hover:text-on-surface">
          Salir
        </button>
      </header>

      {/* Tab bar */}
      <div className="flex border-b border-outline-variant bg-surface">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors border-b-2 ${
              tab === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32 space-y-5">

        {/* ── STEP 1: Datos empresa ── */}
        {tab === "Datos empresa" && (
          <>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Cuéntanos sobre tu empresa</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Completa la información básica para que otros miembros del ecosistema puedan encontrarte.
              </p>
            </div>

            {/* Logo + Portada */}
            <div className="flex gap-4">
              {[
                { label: "Logo", key: "logo" as const, preview: s1.logoUrl, ref: logoRef },
                { label: "Foto de portada", key: "portada" as const, preview: s1.portadaUrl, ref: portadaRef },
              ].map(f => (
                <button key={f.key} onClick={() => f.ref.current?.click()}
                  className="flex-1 aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 hover:bg-surface-container transition-colors overflow-hidden">
                  {f.preview
                    ? <img src={f.preview} alt={f.label} className="w-full h-full object-cover" />
                    : <>
                        <span className="text-2xl text-on-surface-variant">📷</span>
                        <span className="text-xs text-on-surface-variant">{f.label}</span>
                      </>
                  }
                </button>
              ))}
              <input ref={logoRef}    type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f,"logo"); }} />
              <input ref={portadaRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f,"portada"); }} />
            </div>

            {/* Nombre comercial */}
            <Field label="NOMBRE COMERCIAL" required>
              <input value={s1.nombreComercial} onChange={e => setS1(p=>({...p,nombreComercial:e.target.value}))}
                placeholder="Ej. AgroTech Solutions" className={inputCls} />
            </Field>

            {/* Razón social */}
            <Field label="RAZÓN SOCIAL" required>
              <input value={s1.razonSocial} onChange={e => setS1(p=>({...p,razonSocial:e.target.value}))}
                placeholder="Razón legal completa" className={inputCls} />
            </Field>

            {/* NIT + Año */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="NIT" required>
                <input value={s1.nit} onChange={e => setS1(p=>({...p,nit:e.target.value}))}
                  placeholder="900.123.456-7" className={inputCls} />
              </Field>
              <Field label="AÑO FUNDACIÓN">
                <input value={s1.anioFundacion} onChange={e => setS1(p=>({...p,anioFundacion:e.target.value}))}
                  placeholder="YYYY" maxLength={4} className={inputCls} />
              </Field>
            </div>

            {/* Categorías */}
            <Field label="CATEGORÍAS AGTECH">
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {s1.categorias.map(cid => {
                  const cat = categorias.find(c => c.id === cid);
                  return cat ? (
                    <span key={cid} className="flex items-center gap-1 rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container">
                      {cat.icono} {cat.nombre}
                      <button onClick={() => setS1(p=>({...p,categorias:p.categorias.filter(x=>x!==cid)}))}
                        className="ml-1 text-on-primary-container/60 hover:text-on-primary-container">✕</button>
                    </span>
                  ) : null;
                })}
                <button onClick={() => setShowCatPicker(true)}
                  className="rounded-full border border-dashed border-outline-variant px-3 py-1 text-xs text-on-surface-variant hover:bg-surface-container transition-colors">
                  + Añadir
                </button>
              </div>
            </Field>

            {/* Departamento + Ciudad */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="DEPARTAMENTO">
                <select value={s1.departamento} onChange={e => setS1(p=>({...p,departamento:e.target.value}))}
                  className={inputCls}>
                  <option value="">Seleccionar</option>
                  {DEPARTAMENTOS.map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="CIUDAD">
                <input value={s1.ciudad} onChange={e => setS1(p=>({...p,ciudad:e.target.value}))}
                  placeholder="Ej. Medellín" className={inputCls} />
              </Field>
            </div>

            {/* Tamaño */}
            <Field label="TAMAÑO DE LA EMPRESA">
              <div className="flex gap-2">
                {(["1-10","11-50","51+"] as const).map(t => (
                  <button key={t} onClick={() => setS1(p=>({...p,tamano:t}))}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      s1.tamano === t ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            {/* Sitio web */}
            <Field label="SITIO WEB">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">🌐</span>
                <input value={s1.sitioWeb} onChange={e => setS1(p=>({...p,sitioWeb:e.target.value}))}
                  placeholder="https://miempresa.com" className={`${inputCls} pl-9`} />
              </div>
            </Field>
          </>
        )}

        {/* ── STEP 2: Representantes ── */}
        {tab === "Representantes" && (
          <>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Contacto principal</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Persona de contacto que aparecerá en el directorio.
              </p>
            </div>

            {/* Foto */}
            <button onClick={() => fotoRef.current?.click()}
              className="mx-auto flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-outline-variant hover:bg-surface-container transition-colors overflow-hidden">
              {s2.fotoUrl
                ? <img src={s2.fotoUrl} alt="foto" className="w-full h-full object-cover" />
                : <><span className="text-3xl">👤</span><span className="text-xs text-on-surface-variant mt-1">Foto</span></>
              }
            </button>
            <input ref={fotoRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f,"foto"); }} />

            {[
              { label:"NOMBRE COMPLETO", key:"nombre", placeholder:"Juan García" },
              { label:"CARGO",           key:"cargo",  placeholder:"Gerente Comercial" },
              { label:"CORREO",          key:"correo", placeholder:"juan@empresa.com" },
              { label:"CELULAR",         key:"celular",placeholder:"+57 310 000 0000" },
              { label:"WHATSAPP",        key:"whatsapp",placeholder:"+57 310 000 0000 (opcional)" },
              { label:"LINKEDIN",        key:"linkedin",placeholder:"https://linkedin.com/in/... (opcional)" },
            ].map(f => (
              <Field key={f.key} label={f.label}>
                <input value={(s2 as never)[f.key]} onChange={e => setS2(p=>({...p,[f.key]:e.target.value}))}
                  placeholder={f.placeholder} className={inputCls} />
              </Field>
            ))}
          </>
        )}

        {/* ── STEP 3: Descripción ── */}
        {tab === "Descripción" && (
          <>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Describe tu empresa</h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Esta información aparece en tu perfil público del directorio.
              </p>
            </div>

            <Field label="PITCH CORTO" required>
              <textarea value={s3.pitchCorto} onChange={e => setS3(p=>({...p,pitchCorto:e.target.value}))}
                placeholder="En una frase, ¿qué hace tu empresa?" rows={3}
                className={`${inputCls} resize-none`} maxLength={160} />
              <p className="text-xs text-on-surface-variant text-right mt-1">{s3.pitchCorto.length}/160</p>
            </Field>

            <Field label="DESCRIPCIÓN COMPLETA">
              <textarea value={s3.descripcionCompleta} onChange={e => setS3(p=>({...p,descripcionCompleta:e.target.value}))}
                placeholder="Cuéntanos más sobre tu propuesta de valor, historia y diferenciadores." rows={5}
                className={`${inputCls} resize-none`} />
            </Field>

            <Field label="CULTIVOS / PRODUCTOS (separados por coma)">
              <input value={s3.cultivos} onChange={e => setS3(p=>({...p,cultivos:e.target.value}))}
                placeholder="Café, Aguacate, Caña de azúcar…" className={inputCls} />
            </Field>

            <Field label="ZONAS GEOGRÁFICAS (separadas por coma)">
              <input value={s3.zonas} onChange={e => setS3(p=>({...p,zonas:e.target.value}))}
                placeholder="Eje Cafetero, Valle del Cauca…" className={inputCls} />
            </Field>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-surface border-t border-outline-variant px-5 py-4 space-y-3">
        <button onClick={handleNext} disabled={saving}
          className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2">
          {saving ? "Guardando…" : tab === "Descripción" ? "Finalizar ✓" : `Siguiente →`}
        </button>
        {tabIdx > 0 && (
          <button onClick={handleBack} className="w-full text-sm text-on-surface-variant hover:text-on-surface text-center py-1">
            ← Volver
          </button>
        )}

        {/* Tab icons */}
        <div className="flex pt-1">
          {[
            { t:"Datos empresa",  icon:"🏢" },
            { t:"Representantes", icon:"👤" },
            { t:"Descripción",    icon:"📝" },
          ].map(({ t, icon }) => (
            <button key={t} onClick={() => setTab(t as Tab)}
              className={`flex-1 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${tab === t ? "text-primary" : "text-on-surface-variant"}`}>
              <span className="text-lg">{icon}</span>{t}
            </button>
          ))}
        </div>
      </div>

      {/* Category picker modal */}
      {showCatPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/40">
          <div className="w-full max-w-md bg-surface rounded-t-3xl p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <h2 className="font-bold text-on-surface font-headline">Selecciona categorías</h2>
            <div className="flex flex-wrap gap-2">
              {categorias.map(c => {
                const sel = s1.categorias.includes(c.id!);
                return (
                  <button key={c.id} onClick={() => {
                    setS1(p => ({
                      ...p,
                      categorias: sel ? p.categorias.filter(x => x !== c.id) : [...p.categorias, c.id!],
                    }));
                  }}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      sel ? "border-primary bg-primary-container text-on-primary-container" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}>
                    {c.icono} {c.nombre}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowCatPicker(false)}
              className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-on-primary">
              Listo ({s1.categorias.length} seleccionadas)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
