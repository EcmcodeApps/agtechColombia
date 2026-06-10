"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, loginWithGoogle, getGoogleRedirectResult } from "@/lib/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

async function checkAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
}

/** Verifica el código contra Firestore config/junta_acceso */
async function verificarCodigoJunta(codigo: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "config", "junta_acceso"));
  if (!snap.exists()) return false;
  const data = snap.data();
  if (!data.activo) return false;
  if (data.codigo !== codigo.trim()) return false;
  if (data.expira) {
    const expiraMs = data.expira.toMillis ? data.expira.toMillis() : data.expira;
    if (Date.now() > expiraMs) return false;
  }
  return true;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Modal acceso junta
  const [showJunta,    setShowJunta]    = useState(false);
  const [codigoJunta,  setCodigoJunta]  = useState("");
  const [juntaError,   setJuntaError]   = useState("");
  const [juntaLoading, setJuntaLoading] = useState(false);

  // Maneja resultado redirect de Google
  useEffect(() => {
    setGoogleLoading(true);
    getGoogleRedirectResult()
      .then(async result => {
        if (!result) return;
        const ok = await checkAdmin(result.user.uid);
        if (!ok) { setError("Esta cuenta no tiene permisos de administrador."); return; }
        router.replace("/admin/dashboard");
      })
      .catch(() => {})
      .finally(() => setGoogleLoading(false));
  }, [router]);

  async function handleGoogle() {
    setError(""); setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result) return;
      const ok = await checkAdmin(result.user.uid);
      if (!ok) { setError("Esta cuenta no tiene permisos de administrador."); return; }
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("popup-closed"))       setError("Ventana cerrada. Intenta de nuevo.");
      else if (msg.includes("popup-blocked")) setError("Redirigiendo a Google…");
      else setError("Error con Google. Intenta de nuevo.");
    } finally { setGoogleLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred = await login(email, password);
      const ok   = await checkAdmin(cred.user.uid);
      if (!ok) { setError("Esta cuenta no tiene permisos de administrador."); return; }
      router.replace("/admin/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally { setLoading(false); }
  }

  async function handleJuntaAcceso(e: React.FormEvent) {
    e.preventDefault();
    setJuntaError(""); setJuntaLoading(true);
    try {
      const valido = await verificarCodigoJunta(codigoJunta);
      if (!valido) {
        setJuntaError("Código incorrecto o acceso desactivado.");
        return;
      }
      // Sesión temporal 8 horas
      sessionStorage.setItem("junta_session", JSON.stringify({
        expira: Date.now() + 8 * 60 * 60 * 1000,
        tipo: "junta",
      }));
      router.replace("/admin/dashboard");
    } catch {
      setJuntaError("Error al verificar el código. Intenta de nuevo.");
    } finally { setJuntaLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(0.20_0.08_160)] px-4">
      <div className="w-full max-w-sm flex flex-col gap-5">

        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-white font-headline">Panel Admin</h1>
          <p className="text-sm text-white/60 mt-1">AgTech Colombia</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-7 flex flex-col gap-4">

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-outline-variant
                       rounded-xl py-3 text-sm font-semibold text-on-surface
                       hover:border-primary hover:bg-surface-container-low
                       transition-all disabled:opacity-60 active:scale-[0.99]">
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
            {googleLoading ? "Verificando…" : "Ingresar con Google"}
          </button>

          {/* ── BOTÓN JUNTA DIRECTIVA ── */}
          <button
            onClick={() => { setShowJunta(true); setJuntaError(""); setCodigoJunta(""); }}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3
                       text-sm font-semibold border-2 border-amber-300 bg-amber-50
                       text-amber-800 hover:bg-amber-100 transition-all
                       disabled:opacity-60 active:scale-[0.99]">
            🏛️ Acceso Junta Directiva
            <span className="text-[10px] bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-bold">
              TEMPORAL
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant"/>
            <span className="text-xs text-on-surface-variant font-medium">o con correo</span>
            <div className="flex-1 h-px bg-outline-variant"/>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Correo electrónico
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@empresa.com" autoComplete="email"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm
                           outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 pr-11 text-sm
                             outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-error-container rounded-xl px-4 py-3">
                <span className="text-error mt-0.5">⚠️</span>
                <p className="text-sm text-error leading-snug">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading || googleLoading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-on-primary
                         hover:bg-[oklch(0.40_0.15_160)] disabled:opacity-60 transition-all">
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/40">
          Acceso restringido · Solo administradores autorizados
        </p>
      </div>

      {/* ── MODAL ACCESO JUNTA ── */}
      {showJunta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4
                        bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5">

            <div className="text-center">
              <div className="text-4xl mb-2">🏛️</div>
              <h2 className="text-lg font-bold text-on-surface font-headline">
                Acceso Junta Directiva
              </h2>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                Ingresa el código proporcionado por la presidenta de AgTech Colombia.
              </p>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <span className="text-amber-500 text-base shrink-0 mt-0.5">⚠️</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                Acceso <strong>temporal de 8 horas</strong>. Puede ser revocado por la presidenta en cualquier momento.
              </p>
            </div>

            <form onSubmit={handleJuntaAcceso} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Código de acceso
                </label>
                <input
                  type="text"
                  required
                  value={codigoJunta}
                  onChange={e => setCodigoJunta(e.target.value)}
                  placeholder="Escribe el código aquí"
                  autoComplete="off"
                  autoFocus
                  className="w-full rounded-xl border-2 border-amber-200 bg-amber-50/50 px-4 py-3
                             text-sm outline-none focus:border-amber-400 focus:ring-2
                             focus:ring-amber-200 text-center font-mono tracking-widest transition-all"
                />
              </div>

              {juntaError && (
                <div className="flex items-start gap-2 bg-error-container rounded-xl px-4 py-3">
                  <span className="text-error">⚠️</span>
                  <p className="text-sm text-error leading-snug">{juntaError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowJunta(false)}
                  className="flex-1 rounded-xl border-2 border-outline-variant py-3 text-sm
                             font-semibold text-on-surface-variant hover:bg-surface-container transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={juntaLoading || !codigoJunta.trim()}
                  className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white
                             hover:bg-amber-600 disabled:opacity-60 transition-all">
                  {juntaLoading ? "Verificando…" : "Ingresar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
