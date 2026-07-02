"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithEmail, loginWithGoogle } from "@/app/lib/firebase-auth";
import { setDocument } from "@/app/lib/firebase-firestore";
import { FirebaseError } from "firebase/app";
import { serverTimestamp } from "firebase/firestore";

const GOOGLE_LOGO = "https://lh3.googleusercontent.com/aida-public/AB6AXuCViB3WQg_3wt9WDIH-8nh_XlZLZy62i1LMRZdiGZabH5mXZRtG_g2S7WD_LTWVk11f_0YAokn2JUJrCnjv4VINNX7mkv4YPFn-xGSc9-IbnzF6otvK60qibKa19y1_oAWgvJw33RXIQPePYiGb-F0rXtVhDOceXSx0z0JFUCIS6yvNQktOWOGsMeTb0JJRSRsVP5d3xATqezhLgZNESkM1AYgeDjHIn5ukbzW-TNJZ84OvlwygZ8Gal7x18xoY07Cwa8NrShzFUQ";

type UserType = "candidato" | "empresa";
type FormState = "idle" | "loading" | "success";

const PWD_REQ = [
  { id: "len", label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { id: "up",  label: "Una mayúscula",        test: (v: string) => /[A-Z]/.test(v) },
  { id: "num", label: "Un número",            test: (v: string) => /[0-9]/.test(v) },
];

function firebaseErrorMsg(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use":  "Ya existe una cuenta con ese correo.",
    "auth/invalid-email":         "El correo electrónico no es válido.",
    "auth/weak-password":         "La contraseña es demasiado débil.",
    "auth/network-request-failed":"Error de red. Verifica tu conexión.",
    "auth/too-many-requests":     "Demasiados intentos. Intenta más tarde.",
    "auth/popup-closed-by-user":  "",
    "auth/cancelled-popup-request":"",
  };
  return map[code] ?? "Ocurrió un error. Intenta de nuevo.";
}

function Field({ id, label, icon, className = "", ...props }: {
  id: string; label: string; icon: string; className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-xs">
      <label htmlFor={id} className="text-label-md text-on-surface-variant block ml-1">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[20px]">{icon}</span>
        <input id={id} className={`w-full bg-surface-container-low border border-outline-variant rounded-lg pl-[44px] py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline ${className}`} {...props} />
      </div>
    </div>
  );
}

function PwdField({ id, label, icon, value, show, onToggle, ...props }: {
  id: string; label: string; icon: string; value: string;
  show: boolean; onToggle: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-xs">
      <label htmlFor={id} className="text-label-md text-on-surface-variant block ml-1">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[20px]">{icon}</span>
        <input id={id} type={show ? "text" : "password"} value={value}
          className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-[44px] pr-[44px] py-sm text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
          {...props} />
        <button type="button" onClick={onToggle}
          className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          aria-label={show ? "Ocultar" : "Mostrar"}>
          <span className="material-symbols-outlined text-[20px]">{show ? "visibility_off" : "visibility"}</span>
        </button>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  const router = useRouter();

  const [type,    setType]    = useState<UserType>("candidato");
  const [state,   setState]   = useState<FormState>("idle");
  const [error,   setError]   = useState("");

  // Campos comunes
  const [email,    setEmail]    = useState("");
  const [pwd,      setPwd]      = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [showCfm,  setShowCfm]  = useState(false);
  const [terms,    setTerms]    = useState(false);
  const [mismatch, setMismatch] = useState(false);

  // Candidato
  const [nombre,   setNombre]   = useState("");
  const [telefono, setTelefono] = useState("");

  // Empresa
  const [empresa,  setEmpresa]  = useState("");
  const [nit,      setNit]      = useState("");
  const [contacto, setContacto] = useState("");

  const checks    = PWD_REQ.map(r => ({ ...r, ok: r.test(pwd) }));
  const pwdOk     = checks.every(c => c.ok);
  const canSubmit = state === "idle" && terms && pwdOk && !!email && !!confirm &&
    (type === "candidato" ? !!nombre : !!(empresa && nit && contacto));

  // ── Crear doc de usuario en Firestore ───────────────────────────────────
  async function createUserDoc(uid: string, extraData: Record<string, unknown>) {
    await setDocument("usuarios", uid, {
      uid,
      email,
      role: type,
      createdAt: serverTimestamp(),
      ...extraData,
    });
  }

  // ── Registro con email ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (pwd !== confirm) { setMismatch(true); return; }
    setMismatch(false);
    setError("");
    setState("loading");

    try {
      const displayName = type === "candidato" ? nombre : contacto;
      const cred = await registerWithEmail(email, pwd, displayName);
      await createUserDoc(cred.user.uid, type === "candidato"
        ? { nombre, telefono }
        : { empresaNombre: empresa, nit, contacto, onboardingCompleted: false }
      );
      setState("success");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg  = firebaseErrorMsg(code);
      setError(msg || "Ocurrió un error al crear la cuenta.");
      setState("idle");
    }
  };

  // ── Google ───────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    if (state !== "idle") return;
    setError("");
    setState("loading");
    try {
      const cred = await loginWithGoogle();
      const user = cred.user;
      // Solo crear doc si el usuario es nuevo (no tenía cuenta previa)
      await setDocument("usuarios", user.uid, {
        uid: user.uid,
        email: user.email ?? "",
        role: type,
        nombre: user.displayName ?? "",
        createdAt: serverTimestamp(),
        ...(type === "empresa" && { onboardingCompleted: false }),
      });
      router.push(type === "empresa" ? "/onboarding" : "/home");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg  = firebaseErrorMsg(code);
      if (msg) setError(msg);
      setState("idle");
    }
  };

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="fixed top-0 left-0 w-full z-50 flex items-center px-margin-mobile h-16 bg-surface/80 backdrop-blur-md">
          <span className="text-headline-md font-black text-primary">TalentoYa</span>
        </header>
        <main className="flex-grow flex items-center justify-center px-margin-mobile mt-16">
          <div className="w-full text-center space-y-lg" style={{ maxWidth: 480 }}>
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-secondary-container flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-secondary text-[56px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
              </div>
            </div>
            <section className="bg-white/80 backdrop-blur-md border border-outline-variant/30 rounded-xl p-lg shadow-[0px_4px_20px_rgba(15,76,129,0.05)] space-y-md">
              <h1 className="text-headline-lg text-on-surface">¡Cuenta creada!</h1>
              <p className="text-body-md text-on-surface-variant">
                Enviamos un correo a <span className="font-semibold text-primary">{email}</span> para verificar tu cuenta. Revisa tu bandeja de entrada.
              </p>
              <Link href={type === "empresa" ? "/onboarding" : "/login"}
                className="w-full bg-energy-orange text-white text-label-md font-bold py-md rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {type === "empresa" ? "rocket_launch" : "login"}
                </span>
                {type === "empresa" ? "Configurar mi empresa" : "Ir al inicio de sesión"}
              </Link>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">

      <header className="bg-surface shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
        <div className="max-w-max-width mx-auto px-gutter h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-energy-orange" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-headline-md font-black text-primary">TalentoYa</span>
          </Link>
          <p className="text-body-sm text-on-surface-variant hidden sm:block">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary text-label-md hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-xl px-gutter relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-container opacity-5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary-container opacity-10 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none" />

        <div className="w-full z-10" style={{ maxWidth: 520 }}>
          <div className="bg-white/95 backdrop-blur-md shadow-[0px_8px_40px_rgba(15,76,129,0.10)] rounded-[24px] overflow-hidden border border-outline-variant/30">

            {/* Selector tipo */}
            <div className="p-sm bg-surface-container-low flex gap-xs">
              {(["candidato", "empresa"] as UserType[]).map(t => (
                <button key={t} onClick={() => { setType(t); setError(""); }}
                  className={`flex-1 py-md rounded-xl flex items-center justify-center gap-xs text-label-md transition-all duration-300 ${
                    type === t
                      ? "bg-white shadow-md text-primary border-2 border-primary/10 ring-1 ring-black/5"
                      : "text-on-surface-variant border-2 border-transparent hover:text-primary hover:bg-surface-container-high"
                  }`}>
                  <span className="material-symbols-outlined text-[20px]">{t === "candidato" ? "person" : "business"}</span>
                  {t === "candidato" ? "Soy Candidato" : "Soy Empresa"}
                </button>
              ))}
            </div>

            <div className="p-xl space-y-xl">

              <div className="text-center space-y-xs">
                <h1 className="text-headline-lg text-primary">
                  {type === "candidato" ? "Crea tu perfil" : "Registra tu empresa"}
                </h1>
                <p className="text-body-sm text-on-surface-variant">
                  {type === "candidato"
                    ? "Accede a miles de oportunidades en Colombia"
                    : "Conecta con el mejor talento colombiano"}
                </p>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-md">
                <button onClick={handleGoogle} disabled={state !== "idle"}
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

              <div className="flex items-center gap-base">
                <div className="h-px flex-grow bg-outline-variant" />
                <span className="text-label-sm text-on-surface-variant px-base whitespace-nowrap">o regístrate con email</span>
                <div className="h-px flex-grow bg-outline-variant" />
              </div>

              <form className="space-y-lg" onSubmit={handleSubmit}>

                {/* Campos por tipo */}
                {type === "candidato" ? (
                  <>
                    <Field id="nombre" label="Nombre completo" icon="person"
                      type="text" required placeholder="Ej. Juan García"
                      value={nombre} onChange={e => setNombre(e.target.value)} className="pr-md" />
                    <Field id="telefono" label="Teléfono (opcional)" icon="phone"
                      type="tel" placeholder="+57 300 000 0000"
                      value={telefono} onChange={e => setTelefono(e.target.value)} className="pr-md" />
                  </>
                ) : (
                  <>
                    <Field id="empresa" label="Nombre de la empresa" icon="business"
                      type="text" required placeholder="Ej. TechInnovate S.A.S"
                      value={empresa} onChange={e => setEmpresa(e.target.value)} className="pr-md" />
                    <Field id="nit" label="NIT" icon="badge"
                      type="text" required placeholder="900.123.456-7"
                      value={nit} onChange={e => setNit(e.target.value)} className="pr-md" />
                    <Field id="contacto" label="Tu nombre" icon="person"
                      type="text" required placeholder="Nombre del responsable"
                      value={contacto} onChange={e => setContacto(e.target.value)} className="pr-md" />
                  </>
                )}

                <Field id="email" label="Correo electrónico" icon="mail"
                  type="email" required placeholder="ejemplo@correo.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(""); }} className="pr-md" />

                <PwdField id="pwd" label="Contraseña" icon="lock"
                  value={pwd} show={showPwd} onToggle={() => setShowPwd(p => !p)}
                  required placeholder="Mínimo 8 caracteres"
                  onChange={e => setPwd(e.target.value)} />

                {pwd.length > 0 && (
                  <ul className="space-y-xs pl-1 -mt-sm">
                    {checks.map(c => (
                      <li key={c.id} className="flex items-center gap-sm">
                        <span className={`material-symbols-outlined text-[16px] transition-colors ${c.ok ? "text-secondary" : "text-outline-variant"}`}
                          style={c.ok ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          {c.ok ? "check_circle" : "circle"}
                        </span>
                        <span className={`text-body-sm transition-colors ${c.ok ? "text-secondary" : "text-on-surface-variant"}`}>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <PwdField id="confirm" label="Confirmar contraseña" icon="lock_open"
                  value={confirm} show={showCfm} onToggle={() => setShowCfm(p => !p)}
                  required placeholder="Repite tu contraseña"
                  onChange={e => { setConfirm(e.target.value); setMismatch(false); }} />

                {mismatch && (
                  <p className="text-body-sm text-error -mt-sm ml-1 flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    Las contraseñas no coinciden.
                  </p>
                )}

                {/* Error Firebase */}
                {error && (
                  <div className="flex items-center gap-sm p-md bg-error/10 border border-error/20 rounded-xl text-error">
                    <span className="material-symbols-outlined text-[18px] flex-shrink-0">error</span>
                    <p className="text-body-sm">{error}</p>
                  </div>
                )}

                {/* Términos */}
                <div className="flex items-start gap-sm">
                  <input id="terms" type="checkbox" checked={terms}
                    onChange={e => setTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-outline-variant cursor-pointer accent-primary flex-shrink-0" />
                  <label htmlFor="terms" className="text-body-sm text-on-surface-variant cursor-pointer leading-relaxed">
                    Acepto los{" "}
                    <Link href="/terminos" target="_blank" className="text-primary hover:underline">Términos de uso</Link>
                    {" "}y la{" "}
                    <Link href="/politica-privacidad" target="_blank" className="text-primary hover:underline">Política de privacidad</Link>
                    {" "}de TalentoYa.
                  </label>
                </div>

                <button type="submit" disabled={!canSubmit}
                  className="w-full bg-energy-orange text-white py-md rounded-xl text-label-md font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-sm">
                  {state === "loading" ? (
                    <><span className="material-symbols-outlined text-[20px] animate-spin">sync</span>Creando cuenta...</>
                  ) : (
                    <>{type === "candidato" ? "Crear mi perfil" : "Registrar empresa"}<span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
                  )}
                </button>
              </form>

              <p className="text-center text-body-sm text-on-surface-variant sm:hidden">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary text-label-md hover:underline">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-max-width mx-auto px-gutter py-xl flex flex-wrap justify-between items-center gap-md">
          <p className="text-body-sm text-on-surface-variant">© 2026 TalentoYa Colombia. Todos los derechos reservados.</p>
          <div className="flex gap-lg">
            <Link href="/politica-privacidad" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Política de privacidad</Link>
            <Link href="/terminos" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Términos de uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
