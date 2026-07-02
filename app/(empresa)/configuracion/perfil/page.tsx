"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FORM_AV = "https://lh3.googleusercontent.com/aida-public/AB6AXuCIA6m1nLjnQUmUwGy_GQly6Kep6NtuDU8JHgIkvKBqBCyGESOHEvsBiVA7EP-s8ndtYoQya6tQQLH5IZXIZRD9Y6PY5ABG4MYllbaMveKKUprk1bJiuWv8qbozGYpbE45FdLnQOBmSMEaYeImWSBFFnzgmxq3f8Zl0O5JiZ7zaoypyPYW4BHK9nSvF8dwIlnnZ2qOoBcGdwUMsprQL_7K3DlgMId5abuJiRij6LEpobsXMf5QvAq352bAbwSP2WjVzo1QMuY5YGw";

type SaveState = "idle" | "loading" | "saved";

const inputCls = "w-full bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary h-12 px-md text-body-md outline-none transition-all";
const card = "bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant";

export default function PerfilConfigPage() {
  const [nombre,   setNombre]   = useState("Admin TalentoYa");
  const [cargo,    setCargo]    = useState("Director de Operaciones");
  const [telefono, setTelefono] = useState("300 123 4567");
  const [saveState, setSave]    = useState<SaveState>("idle");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveState !== "idle") return;
    setSave("loading");
    // TODO: Firestore — update user doc
    setTimeout(() => {
      setSave("saved");
      setTimeout(() => setSave("idle"), 2000);
    }, 1500);
  };

  return (
    <div className="px-margin-mobile md:px-gutter py-xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs text-on-surface-variant mb-xl">
        <Link href="/configuracion" className="text-label-sm hover:text-primary transition-colors">Configuración</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-label-sm font-semibold text-primary">Mi Perfil</span>
      </nav>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-5xl">

          {/* ── Formulario ──────────────────────────────────────────── */}
          <section className="lg:col-span-8 space-y-gutter">

            {/* Información general */}
            <div className={`${card} p-xl`}>
              <div className="flex items-center gap-lg mb-xl">
                <div className="relative group flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-surface-container-high">
                    <Image src={FORM_AV} alt="Foto de perfil" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  <button type="button"
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                    aria-label="Cambiar foto">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface">Información General</h2>
                  <p className="text-body-sm text-on-surface-variant">Actualiza tus datos personales y profesionales.</p>
                </div>
              </div>

              <div className="space-y-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md text-on-surface">Nombre Completo</label>
                    <input className={inputCls} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md text-on-surface">Cargo en la Empresa</label>
                    <input className={inputCls} value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ej: Gerente de RRHH" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md text-on-surface">Correo Electrónico</label>
                    <div className="relative">
                      <input className={`${inputCls} bg-surface-container-low text-on-surface-variant pr-[44px]`}
                        value="admin@TalentoYa.co" readOnly />
                      <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant">Contacta a soporte para cambiar tu correo.</p>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md text-on-surface">Teléfono de Contacto</label>
                    <div className="flex">
                      <div className="flex items-center justify-center bg-surface-variant px-md rounded-l-lg border border-r-0 border-outline-variant text-label-md select-none">+57</div>
                      <input className={`${inputCls} rounded-l-none`} type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className={`${card} p-lg cursor-pointer hover:shadow-md transition-shadow group`}>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">key</span>
                </div>
                <h3 className="text-label-md text-on-surface mb-xs">Cambiar Contraseña</h3>
                <p className="text-body-sm text-on-surface-variant mb-md">Actualiza tu clave de acceso periódicamente.</p>
                <span className="text-primary text-label-sm font-bold inline-flex items-center gap-xs">
                  Configurar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
              <div className={`${card} p-lg cursor-pointer hover:shadow-md transition-shadow group`}>
                <div className="flex justify-between items-start mb-md">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed-dim flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] px-sm py-0.5 rounded-full font-bold uppercase tracking-wider">Activo</span>
                </div>
                <h3 className="text-label-md text-on-surface mb-xs">Doble Factor (2FA)</h3>
                <p className="text-body-sm text-on-surface-variant mb-md">Protección extra vía SMS o App.</p>
                <span className="text-primary text-label-sm font-bold inline-flex items-center gap-xs">
                  Administrar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>

            {/* Botones guardar */}
            <div className="flex gap-md justify-end pt-md">
              <Link href="/configuracion"
                className="px-xl py-md border border-outline-variant text-on-surface text-label-md font-bold rounded-xl hover:bg-surface-container-low transition-colors">
                Cancelar
              </Link>
              <button type="submit" disabled={saveState !== "idle"}
                className="px-xl py-md bg-energy-orange text-white text-label-md font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-sm">
                {saveState === "loading" ? (
                  <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Guardando...</>
                ) : saveState === "saved" ? (
                  <><span className="material-symbols-outlined text-[20px]">check</span> ¡Guardado!</>
                ) : (
                  <><span className="material-symbols-outlined text-[20px]">save</span> Guardar Cambios</>
                )}
              </button>
            </div>
          </section>

          {/* ── Sidebar: seguridad + ayuda ───────────────────────────── */}
          <aside className="lg:col-span-4 space-y-gutter">
            <div className="bg-primary-container text-white p-xl rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10 pointer-events-none">
                <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              </div>
              <h3 className="text-[20px] font-semibold mb-md relative z-10">Tu seguridad es nuestra prioridad</h3>
              <p className="text-on-primary-container text-body-sm mb-lg relative z-10 opacity-90 leading-relaxed">
                Datos encriptados bajo los estándares de ciberseguridad colombianos.
              </p>
              <Link href="/politica-privacidad" target="_blank"
                className="w-full bg-white text-primary text-label-md font-bold py-md rounded-xl flex items-center justify-center gap-sm hover:bg-surface-container-low transition-colors relative z-10">
                <span className="material-symbols-outlined text-[20px]">description</span>
                Ver Política de Privacidad
              </Link>
            </div>

            <div className={`${card} p-xl`}>
              <h3 className="text-label-md text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary">help</span>
                Centro de Ayuda
              </h3>
              <ul className="space-y-md">
                {[
                  { label: "¿Cómo cambiar mi plan?",   icon: "open_in_new" },
                  { label: "Exportar mis datos",         icon: "download" },
                ].map(({ label, icon }) => (
                  <li key={label}>
                    <a href="#" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors flex justify-between items-center">
                      {label} <span className="material-symbols-outlined text-[16px]">{icon}</span>
                    </a>
                    <hr className="border-outline-variant mt-md" />
                  </li>
                ))}
                <li>
                  <a href="#" className="text-body-sm text-error hover:underline transition-colors flex justify-between items-center">
                    Eliminar mi cuenta <span className="material-symbols-outlined text-[16px]">delete</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
