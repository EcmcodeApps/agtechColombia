"use client";

import Link from "next/link";
import { useState } from "react";

// ── Requisitos ────────────────────────────────────────────────────────────────
interface Requirement {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { id: "length",    label: "Mínimo 8 caracteres",      test: (v) => v.length >= 8 },
  { id: "uppercase", label: "Al menos una mayúscula",   test: (v) => /[A-Z]/.test(v) },
  { id: "number",    label: "Al menos un número",       test: (v) => /[0-9]/.test(v) },
];

type SaveState = "idle" | "loading" | "success";

// ── Página ────────────────────────────────────────────────────────────────────
export default function NuevaContrasenaPage() {
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [saveState, setSaveState]       = useState<SaveState>("idle");
  const [mismatch, setMismatch]         = useState(false);

  // ── Validaciones en vivo ───────────────────────────────────────────────────
  const checks = REQUIREMENTS.map((r) => ({ ...r, passed: r.test(password) }));
  const allPassed = checks.every((c) => c.passed);
  const canSubmit = allPassed && confirm.length > 0 && saveState === "idle";

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (password !== confirm) {
      setMismatch(true);
      setTimeout(() => setMismatch(false), 2200);
      return;
    }

    setMismatch(false);
    setSaveState("loading");
    // TODO: Firebase Auth — confirmPasswordReset(auth, oobCode, newPassword)
    setTimeout(() => {
      setSaveState("success");
    }, 1600);
  };

  // ── Pantalla de éxito ──────────────────────────────────────────────────────
  if (saveState === "success") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="fixed top-0 left-0 w-full z-50 flex items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 backdrop-blur-md">
          <span className="text-headline-md font-bold text-primary">TalentoYa</span>
        </header>

        <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl mt-16">
          <div className="w-full max-w-[480px] space-y-lg text-center">

            {/* Icono de éxito */}
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-secondary-container flex items-center justify-center shadow-lg">
                <span
                  className="material-symbols-outlined text-secondary text-[56px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>

            <section className="bg-white/80 backdrop-blur-md border border-outline-variant/30 rounded-xl p-lg md:p-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
              <div className="space-y-xs mb-xl">
                <h1 className="text-headline-lg text-on-surface">
                  ¡Contraseña actualizada!
                </h1>
                <p className="text-body-md text-on-surface-variant mx-auto">
                  Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar
                  sesión con tu nueva contraseña.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full bg-energy-orange text-white text-label-md font-bold py-md rounded-lg shadow-md transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-sm"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  login
                </span>
                Ir al inicio de sesión
              </Link>
            </section>
          </div>
        </main>

        <footer className="w-full py-xl px-margin-mobile flex items-center justify-center bg-surface-container/50">
          <p className="text-body-sm text-on-surface-variant text-center">
            © 2025 TalentoYa Colombia. Todos los derechos reservados.
          </p>
        </footer>

        {/* Fondo atmosférico */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary-fixed-dim blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary-fixed-dim blur-[100px]" />
        </div>
      </div>
    );
  }

  // ── Formulario principal ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 backdrop-blur-md">
        <span className="text-headline-md font-bold text-primary">TalentoYa</span>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl mt-16">
        <div className="w-full max-w-[480px] space-y-lg">

          {/* Icono decorativo */}
          <div className="flex justify-center mb-xl">
            <div className="relative h-24 w-24 rounded-2xl bg-tertiary-container flex items-center justify-center shadow-lg -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <span
                className="material-symbols-outlined text-on-tertiary-container text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-energy-orange flex items-center justify-center shadow-md">
                <span
                  className="material-symbols-outlined text-white text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  edit
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta */}
          <section className="bg-white/80 backdrop-blur-md border border-outline-variant/30 rounded-xl p-lg md:p-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
            <div className="space-y-xs text-center mb-xl">
              <h1 className="text-headline-lg text-on-surface">Nueva contraseña</h1>
              <p className="text-body-md text-on-surface-variant mx-auto">
                Crea una contraseña segura para proteger tu cuenta.
              </p>
            </div>

            <form className="space-y-lg" onSubmit={handleSubmit}>

              {/* ── Campo: nueva contraseña ──────────────────────────── */}
              <div className="space-y-xs">
                <label
                  htmlFor="password"
                  className="text-label-md text-on-surface-variant block ml-1"
                >
                  Nueva contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[20px]">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-[44px] pr-[44px] py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* ── Requisitos en vivo ───────────────────────────────── */}
              {password.length > 0 && (
                <ul className="space-y-xs pl-1">
                  {checks.map((c) => (
                    <li key={c.id} className="flex items-center gap-sm">
                      <span
                        className={`material-symbols-outlined text-[18px] transition-colors duration-300 ${
                          c.passed ? "text-secondary" : "text-outline-variant"
                        }`}
                        style={
                          c.passed
                            ? { fontVariationSettings: "'FILL' 1" }
                            : undefined
                        }
                      >
                        {c.passed ? "check_circle" : "circle"}
                      </span>
                      <span
                        className={`text-body-sm transition-colors duration-300 ${
                          c.passed ? "text-secondary" : "text-on-surface-variant"
                        }`}
                      >
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* ── Campo: confirmar contraseña ──────────────────────── */}
              <div className="space-y-xs">
                <label
                  htmlFor="confirm"
                  className="text-label-md text-on-surface-variant block ml-1"
                >
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[20px]">
                    lock_open
                  </span>
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repite tu contraseña"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setMismatch(false); }}
                    className={`w-full bg-surface-container-low border rounded-lg pl-[44px] pr-[44px] py-sm text-body-md focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-outline ${
                      mismatch
                        ? "border-error focus:ring-error"
                        : "border-outline-variant focus:ring-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {mismatch && (
                  <p className="text-body-sm text-error ml-1 flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    Las contraseñas no coinciden.
                  </p>
                )}
              </div>

              {/* ── Botón guardar ────────────────────────────────────── */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-energy-orange text-white text-label-md font-bold py-md rounded-lg shadow-md transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saveState === "loading" ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      sync
                    </span>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      lock_reset
                    </span>
                    <span>Guardar contraseña</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="w-full py-xl px-margin-mobile flex items-center justify-center bg-surface-container/50">
        <p className="text-body-sm text-on-surface-variant text-center">
          © 2025 TalentoYa Colombia. Todos los derechos reservados.
        </p>
      </footer>

      {/* ── Fondo atmosférico ────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-tertiary-fixed-dim blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary-fixed-dim blur-[100px]" />
      </div>
    </div>
  );
}
