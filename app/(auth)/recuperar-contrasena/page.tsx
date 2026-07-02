"use client";

import Link from "next/link";
import { useState } from "react";
import { resetPassword } from "@/app/lib/firebase-auth";
import { FirebaseError } from "firebase/app";

type SendState = "idle" | "loading" | "sent";

function firebaseErrorMsg(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email":         "El correo electrónico no es válido.",
    "auth/network-request-failed":"Error de red. Verifica tu conexión.",
    "auth/too-many-requests":     "Demasiados intentos. Intenta más tarde.",
  };
  return map[code] ?? "Ocurrió un error. Intenta de nuevo.";
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function RecuperarContrasenaPage() {
  const [sendState, setSendState] = useState<SendState>("idle");
  const [email,     setEmail]     = useState("");
  const [error,     setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendState !== "idle" || !email) return;
    setError("");
    setSendState("loading");
    try {
      await resetPassword(email);
      setSendState("sent");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      // auth/user-not-found → mostramos éxito igual por seguridad (no revelar qué emails existen)
      if (code === "auth/user-not-found") {
        setSendState("sent");
      } else {
        setError(firebaseErrorMsg(code));
        setSendState("idle");
      }
    }
  };

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
            <div className="relative h-24 w-24 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <span
                className="material-symbols-outlined text-on-primary-container text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock_reset
              </span>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                <span
                  className="material-symbols-outlined text-white text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  key
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta */}
          <section className="bg-white/80 backdrop-blur-md border border-outline-variant/30 rounded-xl p-lg md:p-xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
            <div className="space-y-xs text-center mb-xl">
              <h1 className="text-headline-lg text-on-surface">
                Recuperar contraseña
              </h1>
              <p className="text-body-md text-on-surface-variant mx-auto">
                Ingresa tu correo electrónico y te enviaremos un código para
                restablecer tu contraseña.
              </p>
            </div>

            <form className="space-y-lg" onSubmit={handleSubmit}>
              <div className="space-y-xs">
                <label
                  htmlFor="email"
                  className="text-label-md text-on-surface-variant block ml-1"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="ejemplo@empresa.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline pr-[44px]"
                  />
                  <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
                    mail
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-sm p-md bg-error/10 border border-error/20 rounded-xl text-error">
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0">error</span>
                  <p className="text-body-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={sendState !== "idle" || !email}
                className={`w-full text-white text-label-md font-bold py-md rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-sm disabled:cursor-not-allowed ${
                  sendState === "sent"
                    ? "bg-secondary"
                    : "bg-energy-orange hover:brightness-110 disabled:opacity-80"
                }`}
              >
                {sendState === "idle" && (
                  <>
                    <span>Enviar código</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </>
                )}
                {sendState === "loading" && (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      sync
                    </span>
                    <span>Enviando...</span>
                  </>
                )}
                {sendState === "sent" && (
                  <>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span>Código enviado</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-xl pt-lg border-t border-outline-variant text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-xs text-label-md text-primary hover:underline transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
                Volver al inicio de sesión
              </Link>
            </div>
          </section>

          {/* WhatsApp */}
          <div className="text-center space-y-md">
            <p className="text-body-sm text-on-surface-variant">
              ¿Necesitas ayuda inmediata?
            </p>
            <button className="inline-flex items-center gap-sm px-lg py-sm rounded-full bg-whatsapp-green text-white text-label-md shadow-sm hover:shadow-md transition-all active:scale-95">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
              Soporte por WhatsApp
            </button>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="w-full py-xl px-margin-mobile flex flex-col items-center gap-md bg-surface-container/50">
        <p className="text-body-sm text-on-surface-variant text-center">
          © 2025 TalentoYa Colombia. Todos los derechos reservados.
        </p>
        <div className="flex flex-wrap justify-center gap-md">
          <a
            href="#"
            className="text-body-sm text-on-surface-variant hover:text-primary transition-colors underline"
          >
            Política de privacidad
          </a>
          <a
            href="#"
            className="text-body-sm text-on-surface-variant hover:text-primary transition-colors underline"
          >
            Términos de uso
          </a>
        </div>
      </footer>

      {/* ── Fondo atmosférico ────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-fixed-dim blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary-fixed-dim blur-[100px]" />
      </div>
    </div>
  );
}
