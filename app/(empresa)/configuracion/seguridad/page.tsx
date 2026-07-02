"use client";

import Link from "next/link";
import { useState } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
type SaveState = "idle" | "loading" | "saved" | "error";

// ── Sesiones activas (demo) ────────────────────────────────────────────────────
const SESIONES = [
  { device: "Chrome — Windows 11",   icon: "computer",     location: "Bogotá, Colombia",   time: "Ahora mismo",     current: true  },
  { device: "Safari — iPhone 14",    icon: "phone_iphone", location: "Bogotá, Colombia",   time: "Hace 3 horas",    current: false },
  { device: "Chrome — MacBook Pro",  icon: "laptop_mac",   location: "Medellín, Colombia", time: "Ayer, 9:14 a.m.", current: false },
];

// ── Requisitos de contraseña ──────────────────────────────────────────────────
const PWD_RULES = [
  { id: "len",  label: "Mínimo 8 caracteres",  test: (v: string) => v.length >= 8 },
  { id: "up",   label: "Una letra mayúscula",  test: (v: string) => /[A-Z]/.test(v) },
  { id: "num",  label: "Un número",            test: (v: string) => /[0-9]/.test(v) },
  { id: "spec", label: "Un carácter especial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const inputCls =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl " +
  "h-12 px-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary " +
  "focus:border-transparent transition-all placeholder:text-outline";

const card = "bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)] border border-outline-variant/30";

// ── Campo de contraseña ────────────────────────────────────────────────────────
function PwdInput({
  id, label, value, show, onToggle, onChange, placeholder,
}: {
  id: string; label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-xs">
      <label htmlFor={id} className="text-label-md text-on-surface">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[20px]">lock</span>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder ?? "••••••••"}
          onChange={e => onChange(e.target.value)}
          className={`${inputCls} pl-[44px] pr-[44px]`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          aria-label={show ? "Ocultar" : "Mostrar"}
        >
          <span className="material-symbols-outlined text-[20px]">{show ? "visibility_off" : "visibility"}</span>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function SeguridadPage() {
  // ── Cambiar contraseña ────────────────────────────────────────────────────
  const [actual,    setActual]    = useState("");
  const [nueva,     setNueva]     = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showA, setShowA] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showC, setShowC] = useState(false);
  const [pwdSave, setPwdSave] = useState<SaveState>("idle");
  const [mismatch, setMismatch] = useState(false);

  const checks  = PWD_RULES.map(r => ({ ...r, ok: r.test(nueva) }));
  const pwdOk   = checks.every(c => c.ok);
  const canSave = !!actual && pwdOk && !!confirmar && pwdSave === "idle";

  const handlePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    if (nueva !== confirmar) { setMismatch(true); return; }
    setMismatch(false);
    setPwdSave("loading");
    // TODO: Firebase Auth — reauthenticateWithCredential + updatePassword
    setTimeout(() => {
      setPwdSave("saved");
      setActual(""); setNueva(""); setConfirmar("");
      setTimeout(() => setPwdSave("idle"), 3000);
    }, 1500);
  };

  // ── 2FA ───────────────────────────────────────────────────────────────────
  const [twoFA,    setTwoFA]    = useState(false);
  const [showQR,   setShowQR]   = useState(false);
  const [otpCode,  setOtpCode]  = useState("");
  const [twoFASave, setTwoFASave] = useState<SaveState>("idle");

  const handleToggle2FA = () => {
    if (twoFA) {
      setTwoFA(false);
      setShowQR(false);
    } else {
      setShowQR(true);
    }
  };

  const handleVerifyOTP = () => {
    if (otpCode.length < 6) return;
    setTwoFASave("loading");
    // TODO: Firebase TOTP / SMS verification
    setTimeout(() => {
      setTwoFA(true);
      setShowQR(false);
      setOtpCode("");
      setTwoFASave("idle");
    }, 1200);
  };

  // ── Cerrar sesiones ───────────────────────────────────────────────────────
  const [sesiones, setSesiones] = useState(SESIONES);
  const closeSession = (i: number) =>
    setSesiones(prev => prev.filter((_, idx) => idx !== i));

  // ── Eliminar cuenta ───────────────────────────────────────────────────────
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteOpen,  setDeleteOpen]  = useState(false);
  const confirmWord = "ELIMINAR";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="px-margin-mobile md:px-gutter py-xl">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-xs text-on-surface-variant mb-xl">
        <Link href="/configuracion" className="text-label-sm hover:text-primary transition-colors">Configuración</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-label-sm font-semibold text-primary">Seguridad</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-5xl">

        {/* ── Columna principal ─────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-gutter">

          {/* ── Cambiar contraseña ──────────────────────────────────────── */}
          <section className={`${card} p-xl`}>
            <div className="flex items-center gap-md mb-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">key</span>
              </div>
              <div>
                <h2 className="text-headline-md text-on-surface">Cambiar contraseña</h2>
                <p className="text-body-sm text-on-surface-variant">Usa una contraseña fuerte y única para proteger tu cuenta.</p>
              </div>
            </div>

            <form onSubmit={handlePwd} className="space-y-lg">
              <PwdInput id="actual" label="Contraseña actual" value={actual} show={showA}
                onToggle={() => setShowA(p => !p)} onChange={setActual} />

              <PwdInput id="nueva" label="Nueva contraseña" value={nueva} show={showN}
                onToggle={() => setShowN(p => !p)} onChange={v => { setNueva(v); setMismatch(false); }}
                placeholder="Mínimo 8 caracteres" />

              {/* Requisitos en vivo */}
              {nueva.length > 0 && (
                <div className="grid grid-cols-2 gap-xs bg-surface-container-low rounded-xl p-md">
                  {checks.map(c => (
                    <div key={c.id} className="flex items-center gap-xs">
                      <span
                        className={`material-symbols-outlined text-[16px] transition-colors ${c.ok ? "text-brand-green" : "text-outline-variant"}`}
                        style={c.ok ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {c.ok ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      <span className={`text-body-sm transition-colors ${c.ok ? "text-brand-green" : "text-on-surface-variant"}`}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <PwdInput id="confirmar" label="Confirmar nueva contraseña" value={confirmar} show={showC}
                onToggle={() => setShowC(p => !p)} onChange={v => { setConfirmar(v); setMismatch(false); }} />

              {mismatch && (
                <p className="text-body-sm text-error flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Las contraseñas no coinciden.
                </p>
              )}

              {pwdSave === "saved" && (
                <div className="flex items-center gap-sm p-md bg-secondary/10 rounded-xl text-brand-green">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-label-md">Contraseña actualizada correctamente.</span>
                </div>
              )}

              <div className="flex justify-end gap-md pt-xs">
                <button type="button" onClick={() => { setActual(""); setNueva(""); setConfirmar(""); }}
                  className="px-xl py-sm border border-outline-variant text-on-surface-variant rounded-xl text-label-md hover:bg-surface-container transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={!canSave}
                  className="px-xl py-sm bg-energy-orange text-white rounded-xl text-label-md font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm">
                  {pwdSave === "loading"
                    ? <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Guardando...</>
                    : <><span className="material-symbols-outlined text-[18px]">save</span> Guardar contraseña</>}
                </button>
              </div>
            </form>
          </section>

          {/* ── Autenticación de dos factores ────────────────────────────── */}
          <section className={`${card} p-xl`}>
            <div className="flex items-start justify-between gap-md mb-lg">
              <div className="flex items-center gap-md">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${twoFA ? "bg-brand-green/10" : "bg-error/10"}`}>
                  <span className={`material-symbols-outlined ${twoFA ? "text-brand-green" : "text-error"}`}>
                    {twoFA ? "verified_user" : "gpp_bad"}
                  </span>
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface">Verificación en dos pasos</h2>
                  <p className="text-body-sm text-on-surface-variant">Protección extra al iniciar sesión desde un dispositivo nuevo.</p>
                </div>
              </div>
              {/* Toggle */}
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${twoFA ? "bg-brand-green" : "bg-outline-variant"}`}
                role="switch"
                aria-checked={twoFA}
              >
                <span className={`inline-block h-5 w-5 mt-1 ml-1 rounded-full bg-white shadow transition-transform duration-200 ${twoFA ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Badge de estado */}
            <div className={`flex items-center gap-sm px-md py-sm rounded-xl mb-lg ${twoFA ? "bg-brand-green/10" : "bg-error/10"}`}>
              <span className={`material-symbols-outlined text-[18px] ${twoFA ? "text-brand-green" : "text-error"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}>
                {twoFA ? "check_circle" : "warning"}
              </span>
              <p className={`text-body-sm font-semibold ${twoFA ? "text-brand-green" : "text-error"}`}>
                {twoFA ? "2FA activo — tu cuenta está protegida." : "2FA inactivo — tu cuenta es más vulnerable."}
              </p>
            </div>

            {/* Panel QR para activar */}
            {showQR && !twoFA && (
              <div className="border-2 border-primary/20 rounded-xl p-lg space-y-lg bg-primary/5">
                <p className="text-label-md text-on-surface">Paso 1 — Escanea este código QR con tu app autenticadora</p>
                <p className="text-body-sm text-on-surface-variant">(Google Authenticator, Authy, Microsoft Authenticator)</p>

                {/* QR placeholder */}
                <div className="flex justify-center">
                  <div className="w-36 h-36 bg-white border-2 border-outline-variant rounded-xl flex flex-col items-center justify-center gap-xs">
                    <span className="material-symbols-outlined text-on-surface-variant text-[48px]">qr_code_2</span>
                    <p className="text-label-sm text-on-surface-variant text-center px-sm">QR demo</p>
                  </div>
                </div>

                <div className="space-y-xs">
                  <p className="text-label-sm text-on-surface-variant">O ingresa el código manualmente:</p>
                  <code className="block bg-surface-container-highest rounded-lg px-md py-sm text-label-md text-primary tracking-widest text-center select-all">
                    TALY-XKCD-7823-QWER
                  </code>
                </div>

                <hr className="border-outline-variant" />

                <p className="text-label-md text-on-surface">Paso 2 — Ingresa el código de 6 dígitos que muestra la app</p>
                <div className="flex gap-md">
                  <input
                    className={`${inputCls} tracking-widest text-center text-headline-md font-mono flex-1`}
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    onClick={handleVerifyOTP}
                    disabled={otpCode.length < 6 || twoFASave === "loading"}
                    className="px-lg bg-primary text-white rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm"
                  >
                    {twoFASave === "loading"
                      ? <span className="material-symbols-outlined animate-spin">sync</span>
                      : "Verificar"}
                  </button>
                </div>
              </div>
            )}

            {twoFA && (
              <div className="space-y-sm">
                <p className="text-label-md text-on-surface mb-sm">Métodos configurados</p>
                <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary">phone_iphone</span>
                    <div>
                      <p className="text-label-md text-on-surface">App autenticadora</p>
                      <p className="text-body-sm text-on-surface-variant">Vinculada hace 3 días</p>
                    </div>
                  </div>
                  <span className="bg-brand-green/10 text-brand-green text-label-sm px-sm py-xs rounded-full font-semibold">Activo</span>
                </div>
              </div>
            )}
          </section>

          {/* ── Sesiones activas ─────────────────────────────────────────── */}
          <section className={`${card} p-xl`}>
            <div className="flex items-center gap-md mb-xl">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">devices</span>
              </div>
              <div>
                <h2 className="text-headline-md text-on-surface">Sesiones activas</h2>
                <p className="text-body-sm text-on-surface-variant">{sesiones.length} dispositivo{sesiones.length !== 1 ? "s" : ""} conectado{sesiones.length !== 1 ? "s" : ""}.</p>
              </div>
            </div>

            <div className="space-y-md">
              {sesiones.map((s, i) => (
                <div key={i} className={`flex items-center justify-between gap-md p-md rounded-xl transition-colors ${s.current ? "bg-primary/5 border border-primary/20" : "bg-surface-container-low"}`}>
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{s.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-sm flex-wrap">
                        <p className="text-label-md text-on-surface">{s.device}</p>
                        {s.current && (
                          <span className="bg-primary text-white text-[10px] font-bold px-xs py-[2px] rounded-full">Esta sesión</span>
                        )}
                      </div>
                      <p className="text-body-sm text-on-surface-variant">{s.location} · {s.time}</p>
                    </div>
                  </div>
                  {!s.current && (
                    <button
                      onClick={() => closeSession(i)}
                      className="p-xs text-error hover:bg-error/10 rounded-lg transition-colors flex-shrink-0"
                      aria-label="Cerrar sesión"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {sesiones.length > 1 && (
              <button
                onClick={() => setSesiones(prev => prev.filter(s => s.current))}
                className="mt-lg text-error text-label-sm hover:underline flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Cerrar todas las otras sesiones
              </button>
            )}
          </section>
        </div>

        {/* ── Sidebar derecho ───────────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-gutter">

          {/* Resumen de seguridad */}
          <div className={`${card} p-xl`}>
            <h3 className="text-label-md text-on-surface mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">security</span>
              Puntaje de seguridad
            </h3>
            {/* Score visual */}
            <div className="flex flex-col items-center mb-lg">
              <div className="relative w-28 h-28 mb-md">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112" aria-hidden>
                  <circle cx="56" cy="56" r="44" fill="none" stroke="#e0e3e5" strokeWidth="8" />
                  <circle cx="56" cy="56" r="44" fill="none"
                    stroke={twoFA ? "#00A676" : "#FF9800"}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - (twoFA ? 0.9 : 0.55))}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-headline-md font-bold ${twoFA ? "text-brand-green" : "text-[#FF9800]"}`}>
                    {twoFA ? "90" : "55"}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">/100</span>
                </div>
              </div>
              <p className={`text-label-md font-semibold ${twoFA ? "text-brand-green" : "text-[#FF9800]"}`}>
                {twoFA ? "Cuenta segura" : "Seguridad media"}
              </p>
            </div>

            <div className="space-y-sm">
              {[
                { label: "Contraseña fuerte",      ok: true  },
                { label: "Email verificado",        ok: true  },
                { label: "2FA activado",            ok: twoFA },
                { label: "Sesiones revisadas",      ok: sesiones.length <= 1 },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-sm">
                  <span className={`material-symbols-outlined text-[18px] ${ok ? "text-brand-green" : "text-outline-variant"}`}
                    style={ok ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                    {ok ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span className={`text-body-sm ${ok ? "text-on-surface" : "text-on-surface-variant"}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zona de peligro */}
          <div className={`${card} p-xl border-error/30`}>
            <h3 className="text-label-md text-error mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Zona de peligro
            </h3>
            <p className="text-body-sm text-on-surface-variant mb-lg leading-relaxed">
              Eliminar tu cuenta es una acción <strong className="text-on-surface">permanente e irreversible</strong>. Todos tus datos serán anonimizados según la{" "}
              <Link href="/politica-privacidad" target="_blank" className="text-primary hover:underline">
                Ley 1581 de 2012
              </Link>.
            </p>

            {!deleteOpen ? (
              <button
                onClick={() => setDeleteOpen(true)}
                className="w-full border-2 border-error text-error py-sm rounded-xl text-label-md font-bold hover:bg-error hover:text-white active:scale-95 transition-all"
              >
                Eliminar mi cuenta
              </button>
            ) : (
              <div className="space-y-md">
                <p className="text-body-sm text-on-surface-variant">
                  Escribe <strong className="text-error font-mono">{confirmWord}</strong> para confirmar:
                </p>
                <input
                  className={`${inputCls} border-error/50 focus:ring-error text-center tracking-widest font-mono`}
                  placeholder={confirmWord}
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value.toUpperCase())}
                />
                <div className="flex gap-sm">
                  <button
                    onClick={() => { setDeleteOpen(false); setDeleteInput(""); }}
                    className="flex-1 border border-outline-variant text-on-surface-variant py-sm rounded-xl text-label-md hover:bg-surface-container transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={deleteInput !== confirmWord}
                    className="flex-1 bg-error text-white py-sm rounded-xl text-label-md font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
