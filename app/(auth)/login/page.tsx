"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/app/lib/firebase-auth";
import { FirebaseError } from "firebase/app";

const GOOGLE_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCViB3WQg_3wt9WDIH-8nh_XlZLZy62i1LMRZdiGZabH5mXZRtG_g2S7WD_LTWVk11f_0YAokn2JUJrCnjv4VINNX7mkv4YPFn-xGSc9-IbnzF6otvK60qibKa19y1_oAWgvJw33RXIQPePYiGb-F0rXtVhDOceXSx0z0JFUCIS6yvNQktOWOGsMeTb0JJRSRsVP5d3xATqezhLgZNESkM1AYgeDjHIn5ukbzW-TNJZ84OvlwygZ8Gal7x18xoY07Cwa8NrShzFUQ";

type UserType = "candidate" | "employer";

const PAGE_TITLES: Record<UserType, string> = {
  candidate: "Busca tu próximo empleo",
  employer:  "Encuentra el mejor talento",
};

// ── Mensajes de error en español ──────────────────────────────────────────────
function firebaseErrorMsg(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found":        "No existe una cuenta con ese correo.",
    "auth/wrong-password":        "Contraseña incorrecta. Inténtalo de nuevo.",
    "auth/invalid-credential":    "Correo o contraseña incorrectos.",
    "auth/invalid-email":         "El correo electrónico no es válido.",
    "auth/user-disabled":         "Esta cuenta ha sido deshabilitada.",
    "auth/too-many-requests":     "Demasiados intentos fallidos. Intenta más tarde.",
    "auth/network-request-failed":"Error de red. Verifica tu conexión.",
    "auth/popup-closed-by-user":  "",
    "auth/cancelled-popup-request":"",
  };
  return map[code] ?? "Ocurrió un error. Intenta de nuevo.";
}

export default function LoginPage() {
  const router = useRouter();

  const [userType,     setUserType]     = useState<UserType>("candidate");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  // ── Destino según tipo de usuario ─────────────────────────────────────────
  const dest = userType === "employer" ? "/home" : "/home";

  // ── Login con email ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push(dest);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg  = firebaseErrorMsg(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Login con Google ───────────────────────────────────────────────────────
  const handleGoogle = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push(dest);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg  = firebaseErrorMsg(code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-surface shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
        <div className="max-w-max-width mx-auto px-gutter h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-energy-orange" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-headline-md font-black text-primary">TalentoYa</span>
          </Link>
          <div className="hidden md:flex gap-lg items-center">
            <Link href="/" className="text-body-md text-on-surface-variant hover:text-primary transition-colors">Inicio</Link>
            <Link href="/registro"
              className="bg-primary text-white px-xl py-xs rounded-xl text-label-md active:scale-95 transition-transform">
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center py-xl px-gutter relative overflow-hidden">

        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-container opacity-5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-tertiary-container opacity-5 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

        <div className="w-full z-10" style={{ maxWidth: 480 }}>
          <div className="bg-white/95 backdrop-blur-md shadow-[0px_8px_40px_rgba(15,76,129,0.10)] rounded-[24px] overflow-hidden border border-outline-variant/30">

            {/* Selector tipo */}
            <div className="p-sm bg-surface-container-low flex gap-xs">
              {(["candidate", "employer"] as UserType[]).map((type) => (
                <button key={type} onClick={() => { setUserType(type); setError(""); }}
                  className={`flex-1 py-md rounded-xl flex items-center justify-center gap-xs text-label-md transition-all duration-300 ${
                    userType === type
                      ? "bg-white shadow-md text-primary border-2 border-primary/10 ring-1 ring-black/5"
                      : "text-on-surface-variant border-2 border-transparent hover:text-primary hover:bg-surface-container-high"
                  }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {type === "candidate" ? "person" : "business"}
                  </span>
                  {type === "candidate" ? "Soy Candidato" : "Soy Empresa"}
                </button>
              ))}
            </div>

            <div className="p-xl space-y-xl">

              {/* Título */}
              <div className="text-center space-y-xs">
                <h1 className="text-headline-lg text-primary transition-all duration-300">
                  {PAGE_TITLES[userType]}
                </h1>
                <p className="text-body-sm text-on-surface-variant">
                  Ingresa tus credenciales para acceder a TalentoYa
                </p>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-md">
                <button onClick={handleGoogle} disabled={loading}
                  className="flex items-center justify-center gap-base border border-outline-variant py-md px-base rounded-xl hover:bg-surface-container-high transition-colors active:scale-95 disabled:opacity-60">
                  <Image src={GOOGLE_LOGO} alt="Google" width={20} height={20} className="w-5 h-5" />
                  <span className="text-label-md">Google</span>
                </button>
                <button disabled
                  className="flex items-center justify-center gap-base border border-outline-variant py-md px-base rounded-xl text-on-surface-variant/50 cursor-not-allowed">
                  <span className="text-[#0A66C2]/50 font-bold text-body-md leading-none">in</span>
                  <span className="text-label-md">LinkedIn</span>
                </button>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-base">
                <div className="h-px flex-grow bg-outline-variant" />
                <span className="text-label-sm text-on-surface-variant px-base whitespace-nowrap">o continúa con email</span>
                <div className="h-px flex-grow bg-outline-variant" />
              </div>

              {/* Formulario */}
              <form className="space-y-lg" onSubmit={handleSubmit}>

                {/* Email */}
                <div className="space-y-xs">
                  <label htmlFor="email" className="block text-label-md text-on-surface">Correo electrónico</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">mail</span>
                    <input id="email" type="email" required
                      placeholder="ejemplo@correo.com"
                      value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                      className="w-full pl-[44px] pr-md py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-body-md bg-white" />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-label-md text-on-surface">Contraseña</label>
                    <Link href="/recuperar-contrasena" className="text-label-sm text-energy-orange hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">lock</span>
                    <input id="password" type={showPassword ? "text" : "password"} required
                      placeholder="••••••••"
                      value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                      className="w-full pl-[44px] pr-[44px] py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline-variant text-body-md bg-white" />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                {/* Error Firebase */}
                {error && (
                  <div className="flex items-center gap-sm p-md bg-error/10 border border-error/20 rounded-xl text-error">
                    <span className="material-symbols-outlined text-[18px] flex-shrink-0">error</span>
                    <p className="text-body-sm">{error}</p>
                  </div>
                )}

                {/* CTA */}
                <button type="submit" disabled={loading || !email || !password}
                  className="w-full bg-energy-orange text-white py-md rounded-xl text-label-md font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-sm">
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span>Entrando...</>
                  ) : "Iniciar Sesión"}
                </button>
              </form>

              {/* Enlace registro */}
              <div className="text-center">
                <p className="text-body-sm text-on-surface-variant">
                  ¿No tienes cuenta?{" "}
                  <Link href="/registro" className="text-primary text-label-md hover:underline decoration-2">
                    Regístrate gratis
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="mt-lg flex justify-center">
            <button className="flex items-center gap-base bg-whatsapp-green text-white px-xl py-md rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              <span className="text-label-md">Habla con un asesor por WhatsApp</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-base py-xl px-gutter max-w-max-width mx-auto w-full">
          <div className="space-y-md">
            <span className="text-headline-md font-black text-primary">TalentoYa</span>
            <p className="text-body-sm text-on-surface-variant">Conectamos el talento colombiano con las mejores oportunidades.</p>
          </div>
          <div className="flex flex-col md:items-end justify-between gap-md">
            <div className="flex flex-wrap gap-lg">
              <Link href="/politica-privacidad" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Política de privacidad</Link>
              <Link href="/terminos" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Términos de uso</Link>
            </div>
            <p className="text-body-sm text-on-surface-variant">© 2026 TalentoYa Colombia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
