"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile, getCompany, saveCompanyStep } from "@/lib/firebase/firestore";
import { cambiarEmail } from "@/lib/firebase/auth";
import { storage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AjustesPage() {
  const { user } = useAuth();
  const [nombre, setNombre]       = useState("");
  const [email, setEmail]         = useState("");
  const [empresa, setEmpresa]     = useState("");
  const [ciudad, setCiudad]       = useState("");
  const [telefono, setTelefono]   = useState("");
  const [sitioWeb, setSitioWeb]   = useState("");
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(p => { if (p) { setNombre(p.nombre); setEmail(p.email); } });
    getCompany(user.uid).then(c => {
      if (!c) return;
      setEmpresa(c.nombre ?? "");
      setCiudad(c.ciudad ?? "");
      setTelefono(c.telefono ?? "");
      setSitioWeb(c.sitioWeb ?? "");
      if (c.logoUrl) setLogoPreview(c.logoUrl);
    });
  }, [user]);

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSuccess(false);
    try {
      await updateUserProfile(user.uid, { nombre });
      if (email !== user.email) await cambiarEmail(email);

      let logoUrl: string | undefined;
      if (logoFile) {
        const r = ref(storage, `companies/${user.uid}/logo`);
        await uploadBytes(r, logoFile);
        logoUrl = await getDownloadURL(r);
      }
      await saveCompanyStep(user.uid, { nombre: empresa, ciudad, telefono, sitioWeb, ...(logoUrl ? { logoUrl } : {}) });
      setSuccess(true);
    } finally { setSaving(false); }
  }

  const field = (label: string, value: string, set: (v: string) => void, type = "text", placeholder = "") => (
    <div key={label}>
      <label className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
      <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
    </div>
  );

  return (
    <div className="p-6 max-w-lg space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Ajustes de cuenta</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-3xl bg-surface-container-low p-5 space-y-4 border border-outline-variant">
          <h2 className="font-semibold text-on-surface">Perfil personal</h2>
          {field("Nombre", nombre, setNombre, "text", "Tu nombre")}
          {field("Correo electrónico", email, setEmail, "email", "tu@correo.com")}
        </div>

        <div className="rounded-3xl bg-surface-container-low p-5 space-y-4 border border-outline-variant">
          <h2 className="font-semibold text-on-surface">Empresa</h2>
          {field("Nombre de la empresa", empresa, setEmpresa)}
          {field("Ciudad", ciudad, setCiudad)}
          {field("Teléfono", telefono, setTelefono, "tel")}
          {field("Sitio web", sitioWeb, setSitioWeb, "url", "https://")}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">Logo</label>
            {logoPreview && <img src={logoPreview} alt="logo" className="h-16 w-16 rounded-xl object-cover mb-2 border border-outline-variant" />}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-outline-variant px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
              {logoFile ? logoFile.name : "Cambiar logo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
          </div>
        </div>

        {success && <p className="text-sm text-primary font-medium">✓ Cambios guardados correctamente</p>}
        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity">
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
