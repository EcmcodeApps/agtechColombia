"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function ResetPage() {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function enviar() {
    if (!email.trim()) { setError("Ingresa tu correo electrónico."); return; }
    setError(""); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: "http://localhost:3000/auth/login",
        handleCodeInApp: false,
      });
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found")    setError("No existe una cuenta con ese correo.");
      else if (code === "auth/invalid-email") setError("El correo no es válido.");
      else if (code === "auth/too-many-requests") setError("Demasiados intentos. Espera unos minutos.");
      else setError("No se pudo enviar el enlace. Verifica el correo e intenta de nuevo.");
      console.error("Reset error:", code, err);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-surface-container-low p-8 shadow-sm">

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-3xl">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-on-surface font-headline">Recuperar contraseña</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-primary-container p-5 text-center space-y-2">
              <p className="text-2xl">✉️</p>
              <p className="font-semibold text-on-primary-container">¡Enlace enviado!</p>
              <p className="text-sm text-on-primary-container">
                Revisa tu bandeja de entrada en <strong>{email}</strong>.
                Si no lo ves, revisa la carpeta de spam.
              </p>
            </div>
            <button onClick={() => { setSent(false); setEmail(""); }}
              className="w-full rounded-xl border border-outline-variant py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              Enviar a otro correo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && enviar()}
                placeholder="tu@empresa.com"
                autoComplete="email"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-error-container px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <button
              onClick={enviar}
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
                  Enviando…
                </span>
              ) : "Enviar enlace"}
            </button>
          </div>
        )}

        <p className="text-center text-sm text-on-surface-variant">
          <Link href="/auth/login" className="text-primary hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
