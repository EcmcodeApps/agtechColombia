"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, loginWithGoogle } from "@/lib/firebase/auth";
import { getUserProfile, createUserProfile } from "@/lib/firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function redirectAfterLogin(uid: string) {
    const profile = await getUserProfile(uid);
    router.replace(profile?.onboardingCompleted ? "/dashboard" : "/onboarding");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred = await login(email, password);
      await redirectAfterLogin(cred.user.uid);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found"))
        setError("Correo o contraseña incorrectos.");
      else if (msg.includes("too-many-requests"))
        setError("Demasiados intentos. Espera unos minutos.");
      else setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    setError(""); setGoogleLoading(true);
    try {
      const cred = await loginWithGoogle();
      const u = cred.user;
      const profile = await getUserProfile(u.uid);
      if (!profile) {
        await createUserProfile(u.uid, {
          email: u.email ?? "",
          displayName: u.displayName ?? "",
          photoURL: u.photoURL ?? "",
          onboardingCompleted: false,
        });
        router.replace("/onboarding");
      } else {
        router.replace(profile.onboardingCompleted ? "/dashboard" : "/onboarding");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("popup-closed"))       setError("Ventana cerrada. Intenta de nuevo.");
      else if (msg.includes("popup-blocked")) setError("Permite ventanas emergentes en tu navegador.");
      else setError("Error con Google. Intenta de nuevo.");
    } finally { setGoogleLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_160)] px-4 py-10">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-xl font-bold text-primary font-headline">AgTech Colombia</Link>
          <h1 className="mt-3 text-2xl font-bold text-on-surface">Bienvenido de nuevo</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/40 p-7 flex flex-col gap-5">

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-outline-variant rounded-xl py-3 text-sm font-semibold text-on-surface hover:border-primary hover:bg-surface-container-low transition-all disabled:opacity-60 active:scale-[0.99]">
            {googleLoading ? (
              <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Conectando…" : "Continuar con Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant font-medium">o con correo</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Correo electrónico</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@empresa.com" autoComplete="email"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Contraseña</label>
                <Link href="/auth/reset" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-lg">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-error-container rounded-xl px-4 py-3">
                <span className="text-error text-base mt-0.5">⚠️</span>
                <p className="text-sm text-error leading-snug">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading || googleLoading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-on-primary hover:bg-[oklch(0.40_0.15_160)] disabled:opacity-60 transition-all active:scale-[0.99] mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Iniciando sesión…
                </span>
              ) : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-primary font-semibold hover:underline">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
