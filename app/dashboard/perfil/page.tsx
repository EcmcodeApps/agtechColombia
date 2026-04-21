"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCompany, getCategoriasActivas, type CategoriaRecord } from "@/lib/firebase/firestore";
import { db, storage } from "@/lib/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

interface ProfileForm {
  nombreComercial: string;
  razonSocial: string;
  nit: string;
  categoriaId: string;
  departamento: string;
  ciudad: string;
  pitchCorto: string;
  descripcionCompleta: string;
  cultivos: string;
  sitioWeb: string;
  instagram: string;
  linkedin: string;
  logoUrl: string;
  portadaUrl: string;
}

const BLANK: ProfileForm = {
  nombreComercial: "", razonSocial: "", nit: "", categoriaId: "",
  departamento: "", ciudad: "", pitchCorto: "", descripcionCompleta: "",
  cultivos: "", sitioWeb: "", instagram: "", linkedin: "",
  logoUrl: "", portadaUrl: "",
};

export default function PerfilPage() {
  const { user } = useAuth();
  const [form, setForm]           = useState<ProfileForm>(BLANK);
  const [cats, setCats]           = useState<CategoriaRecord[]>([]);
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [saving, setSaving]       = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveLabel, setSaveLabel] = useState("");
  const logoRef    = useRef<HTMLInputElement>(null);
  const portadaRef = useRef<HTMLInputElement>(null);
  const saveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data
  useEffect(() => {
    if (!user) return;
    getCompany(user.uid).then(c => {
      if (!c) return;
      setForm({
        nombreComercial:   c.nombreComercial ?? c.nombre ?? "",
        razonSocial:       c.razonSocial ?? "",
        nit:               c.nit ?? "",
        categoriaId:       (c.categorias?.[0]) ?? "",
        departamento:      c.departamento ?? "",
        ciudad:            c.ciudad ?? "",
        pitchCorto:        c.pitchCorto ?? "",
        descripcionCompleta: c.descripcionCompleta ?? "",
        cultivos:          (c.cultivos as string[] | undefined)?.join(", ") ?? "",
        sitioWeb:          c.sitioWeb ?? "",
        instagram:         "",
        linkedin:          "",
        logoUrl:           c.logoUrl ?? "",
        portadaUrl:        c.portadaUrl ?? "",
      });
    });
    getCategoriasActivas().then(setCats);
  }, [user]);

  // Auto-save
  const autoSave = useCallback(async (data: ProfileForm, lf: File | null, pf: File | null) => {
    if (!user) return;
    setSaving(true);
    try {
      let logoUrl    = data.logoUrl;
      let portadaUrl = data.portadaUrl;
      if (lf) { const r = ref(storage, `companies/${user.uid}/logo`);    await uploadBytes(r, lf); logoUrl    = await getDownloadURL(r); setLogoFile(null); }
      if (pf) { const r = ref(storage, `companies/${user.uid}/portada`); await uploadBytes(r, pf); portadaUrl = await getDownloadURL(r); setPortadaFile(null); }
      const catObj = cats.find(c => c.id === data.categoriaId);
      await setDoc(doc(db, "companies", user.uid), {
        nombreComercial: data.nombreComercial, razonSocial: data.razonSocial,
        nombre: data.nombreComercial, nit: data.nit,
        categorias: data.categoriaId ? [data.categoriaId] : [],
        categoriaLabel: catObj?.nombre ?? "",
        departamento: data.departamento, ciudad: data.ciudad,
        pitchCorto: data.pitchCorto, descripcionCompleta: data.descripcionCompleta,
        cultivos: data.cultivos ? data.cultivos.split(",").map(x => x.trim()).filter(Boolean) : [],
        sitioWeb: data.sitioWeb || null,
        logoUrl: logoUrl || null, portadaUrl: portadaUrl || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      if (logoUrl !== data.logoUrl)    setForm(p => ({ ...p, logoUrl }));
      if (portadaUrl !== data.portadaUrl) setForm(p => ({ ...p, portadaUrl }));
      setLastSaved(new Date());
    } finally { setSaving(false); }
  }, [user, cats]);

  function scheduleAutoSave(newForm: ProfileForm, lf = logoFile, pf = portadaFile) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => autoSave(newForm, lf, pf), 2000);
  }

  function set(key: keyof ProfileForm, val: string) {
    const next = { ...form, [key]: val };
    setForm(next);
    scheduleAutoSave(next);
  }

  function pickLogo(f: File) {
    const url = URL.createObjectURL(f);
    setLogoFile(f);
    const next = { ...form, logoUrl: url };
    setForm(next);
    scheduleAutoSave(next, f, portadaFile);
  }

  function pickPortada(f: File) {
    const url = URL.createObjectURL(f);
    setPortadaFile(f);
    const next = { ...form, portadaUrl: url };
    setForm(next);
    scheduleAutoSave(next, logoFile, f);
  }

  // Relative time
  useEffect(() => {
    const id = setInterval(() => {
      if (!lastSaved) return;
      const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (s < 60) setSaveLabel(`hace ${s}s`);
      else setSaveLabel(`hace ${Math.floor(s / 60)} min`);
    }, 5000);
    if (lastSaved) setSaveLabel("ahora mismo");
    return () => clearInterval(id);
  }, [lastSaved]);

  const catLabel = cats.find(c => c.id === form.categoriaId)?.nombre ?? "Categoría";
  const cultivosList = form.cultivos.split(",").map(x => x.trim()).filter(Boolean);

  const inp = "w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-outline-variant px-8 py-4 bg-surface">
          <h1 className="text-lg font-bold text-primary font-headline">Editar perfil público</h1>
          <div className="h-5 w-px bg-outline-variant" />
          <Link href="/catalogos/directorio" className="text-sm text-on-surface-variant hover:text-on-surface">Directorio</Link>
          <span className="text-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Reportes</span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* ── Main form ── */}
          <main className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

            {/* Identidad visual */}
            <section className="space-y-5">
              <SectionTitle icon="🎨" title="Identidad visual" />

              {/* Portada */}
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
                  Imagen de portada (1200×400px)
                </p>
                <button onClick={() => portadaRef.current?.click()}
                  className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant bg-surface-container hover:opacity-90 transition-opacity group">
                  {form.portadaUrl
                    ? <img src={form.portadaUrl} alt="portada" className="w-full h-full object-cover" />
                    : <div className="flex flex-col items-center justify-center h-full gap-2 text-on-surface-variant">
                        <span className="text-4xl">🏔️</span>
                        <span className="text-sm">Click para subir portada</span>
                      </div>
                  }
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-inverse-surface/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-3xl">☁️</span>
                    <span className="text-sm font-semibold text-inverse-on-surface">Click para cambiar portada</span>
                  </div>
                </button>
                <input ref={portadaRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) pickPortada(f); }} />
              </div>

              {/* Logo */}
              <div className="flex items-center gap-5">
                <div className="h-24 w-24 rounded-2xl border-2 border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                  {form.logoUrl
                    ? <img src={form.logoUrl} alt="logo" className="w-full h-full object-cover" />
                    : <span className="text-4xl text-on-surface-variant">🏢</span>
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface mb-2">Logotipo de la empresa</p>
                  <button onClick={() => logoRef.current?.click()}
                    className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-container transition-colors">
                    Subir nuevo logo
                  </button>
                  <p className="text-xs text-on-surface-variant mt-1.5">Formatos aceptados: SVG, PNG o JPG. Máx. 2MB.</p>
                </div>
                <input ref={logoRef} type="file" accept="image/svg+xml,image/png,image/jpeg" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) pickLogo(f); }} />
              </div>
            </section>

            {/* Información básica */}
            <section className="space-y-4">
              <SectionTitle icon="ℹ️" title="Información básica" />
              <div className="grid grid-cols-2 gap-4">
                <Label text="NOMBRE COMERCIAL">
                  <input value={form.nombreComercial} onChange={e => set("nombreComercial", e.target.value)}
                    placeholder="AgroInnova Colombia SAS" className={inp} />
                </Label>
                <Label text="NIT / IDENTIFICACIÓN">
                  <input value={form.nit} onChange={e => set("nit", e.target.value)}
                    placeholder="900.123.456-7" className={inp} />
                </Label>
                <Label text="CATEGORÍA PRINCIPAL">
                  <select value={form.categoriaId} onChange={e => set("categoriaId", e.target.value)} className={inp}>
                    <option value="">Seleccionar categoría</option>
                    {cats.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
                  </select>
                </Label>
                <Label text="UBICACIÓN SEDE">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">📍</span>
                    <input value={`${form.ciudad}${form.ciudad && form.departamento ? ", " : ""}${form.departamento}`}
                      onChange={e => {
                        const parts = e.target.value.split(",").map(x => x.trim());
                        set("ciudad", parts[0] ?? "");
                      }}
                      placeholder="Bogotá, Cundinamarca" className={`${inp} pl-9`} />
                  </div>
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Label text="CIUDAD">
                  <input value={form.ciudad} onChange={e => set("ciudad", e.target.value)}
                    placeholder="Bogotá" className={inp} />
                </Label>
                <Label text="DEPARTAMENTO">
                  <input value={form.departamento} onChange={e => set("departamento", e.target.value)}
                    placeholder="Cundinamarca" className={inp} />
                </Label>
              </div>
            </section>

            {/* Descripción */}
            <section className="space-y-4">
              <SectionTitle icon="📝" title="Descripción de la empresa" />
              <Label text="PITCH CORTO (SLOGAN)">
                <input value={form.pitchCorto} onChange={e => set("pitchCorto", e.target.value)}
                  placeholder="Innovación sostenible para el campo colombiano" maxLength={160} className={inp} />
                <p className="text-xs text-on-surface-variant text-right mt-1">{form.pitchCorto.length}/160</p>
              </Label>
              <Label text="DESCRIPCIÓN COMPLETA">
                <textarea value={form.descripcionCompleta} onChange={e => set("descripcionCompleta", e.target.value)}
                  placeholder="Cuéntanos más sobre tu propuesta de valor…" rows={4}
                  className={`${inp} resize-none`} />
              </Label>
              <Label text="CULTIVOS / PRODUCTOS (separados por coma)">
                <input value={form.cultivos} onChange={e => set("cultivos", e.target.value)}
                  placeholder="Café, Aguacate Hass, Cacao…" className={inp} />
              </Label>
            </section>

            {/* Redes */}
            <section className="space-y-4">
              <SectionTitle icon="🔗" title="Redes y contacto" />
              <div className="grid grid-cols-2 gap-4">
                <Label text="SITIO WEB">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">🌐</span>
                    <input value={form.sitioWeb} onChange={e => set("sitioWeb", e.target.value)}
                      placeholder="https://miempresa.com" className={`${inp} pl-9`} />
                  </div>
                </Label>
                <Label text="INSTAGRAM">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">📸</span>
                    <input value={form.instagram} onChange={e => set("instagram", e.target.value)}
                      placeholder="@miempresa" className={`${inp} pl-9`} />
                  </div>
                </Label>
              </div>
            </section>

            <div className="h-10" />
          </main>

          {/* ── Live preview ── */}
          <aside className="hidden lg:flex w-80 flex-col gap-4 border-l border-outline-variant bg-surface-container-low p-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Vista previa</span>
              <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Actualizando en vivo
              </span>
            </div>

            {/* Preview card */}
            <div className="rounded-2xl bg-surface border border-outline-variant overflow-hidden shadow-sm">
              {/* Banner */}
              <div className="h-20 bg-primary-container overflow-hidden">
                {form.portadaUrl && <img src={form.portadaUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              {/* Logo */}
              <div className="px-4 pb-4">
                <div className="-mt-6 mb-3 h-12 w-12 rounded-xl border-2 border-surface bg-surface-container flex items-center justify-center overflow-hidden">
                  {form.logoUrl
                    ? <img src={form.logoUrl} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xl">🏢</span>
                  }
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-on-surface text-sm leading-tight">
                    {form.nombreComercial || "Nombre de empresa"}
                  </p>
                  <span className="shrink-0 rounded-full bg-primary-container px-2 py-0.5 text-xs font-bold text-primary">VERIFICADO</span>
                </div>
                {form.categoriaId && (
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-0.5">{catLabel}</p>
                )}
                {form.pitchCorto && (
                  <p className="text-xs text-on-surface-variant italic mt-2">"{form.pitchCorto}"</p>
                )}
                <div className="mt-3 space-y-1">
                  {(form.ciudad || form.departamento) && (
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span>📍</span> {[form.ciudad, form.departamento].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {form.nit && (
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span>🪪</span> NIT: {form.nit}
                    </p>
                  )}
                </div>
                {cultivosList.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">Impacto en cultivos</p>
                    <div className="flex flex-wrap gap-1">
                      {cultivosList.slice(0, 3).map(c => (
                        <span key={c} className="rounded-full bg-primary-container px-2 py-0.5 text-xs text-on-primary-container">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {form.sitioWeb  && <span className="text-sm">🌐</span>}
                    {form.instagram && <span className="text-sm">📸</span>}
                  </div>
                  <button className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-on-primary">Conectar</button>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="rounded-2xl bg-primary-container p-4 text-xs text-on-primary-container">
              Este es el aspecto que tendrá tu perfil para otros miembros de la red AgTech Colombia.
              Asegúrate de incluir imágenes de alta calidad para destacar.
            </div>
          </aside>
        </div>

        {/* Bottom save bar */}
        <footer className="border-t border-outline-variant bg-surface px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            {saving
              ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> Guardando…</>
              : lastSaved
                ? <><span className="text-primary">✓</span> Guardado automáticamente {saveLabel}</>
                : <span className="text-on-surface-variant/50">Sin cambios</span>
            }
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { if (user) getCompany(user.uid).then(c => c && setForm(p => ({ ...p }))); }}
              className="rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              Descartar
            </button>
            <button onClick={() => autoSave(form, logoFile, portadaFile)} disabled={saving}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center gap-2">
              Ver perfil público ↗
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-base">{icon}</div>
      <h2 className="text-base font-bold text-on-surface">{title}</h2>
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold tracking-wide text-on-surface-variant uppercase">{text}</label>
      {children}
    </div>
  );
}
