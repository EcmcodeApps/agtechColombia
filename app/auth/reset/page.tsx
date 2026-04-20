"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/firebase/auth";

export default function ResetPage() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError("No encontramos una cuenta con ese correo.");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-surface-container-low p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface font-headline">Recuperar contraseña</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Te enviaremos un enlace de restablecimiento</p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-primary-container p-4 text-center text-sm text-on-primary-container">
            Revisa tu bandeja de entrada. Si el correo existe, recibirás el enlace.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Correo electrónico</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="tu@empresa.com"
              />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-on-surface-variant">
          <Link href="/auth/login" className="text-primary hover:underline">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
}
