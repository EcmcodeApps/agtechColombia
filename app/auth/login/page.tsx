"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, loginWithGoogle } from "@/lib/firebase/auth";
import { getUserProfile } from "@/lib/firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred = await login(email, password);
      await redirect(cred.user.uid);
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    try {
      const cred = await loginWithGoogle();
      await redirect(cred.user.uid);
    } catch {
      setError("Error al iniciar con Google.");
    } finally { setLoading(false); }
  }

  async function redirect(uid: string) {
    const profile = await getUserProfile(uid);
    if (!profile?.onboardingCompleto) router.replace("/onboarding");
    else router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-surface-container-low p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface font-headline">AgTech Colombia</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Correo electrónico</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="tu@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Contraseña</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? "Iniciando…" : "Iniciar sesión"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant" /></div>
          <div className="relative flex justify-center text-xs text-on-surface-variant"><span className="bg-surface-container-low px-2">o</span></div>
        </div>

        <button
          onClick={handleGoogle} disabled={loading}
          className="w-full rounded-xl border border-outline-variant bg-surface py-3 text-sm font-medium text-on-surface hover:bg-surface-container transition-colors disabled:opacity-60"
        >
          Continuar con Google
        </button>

        <p className="text-center text-sm text-on-surface-variant">
          <Link href="/auth/reset" className="text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="text-center text-sm text-on-surface-variant">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
