"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/firebase/auth";
import { createUserProfile } from "@/lib/firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre]     = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    setError(""); setLoading(true);
    try {
      const cred = await register(email, password);
      await createUserProfile(cred.user.uid, { nombre, email });
      router.replace("/onboarding");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) setError("Este correo ya está registrado.");
      else setError("Error al crear la cuenta. Intenta de nuevo.");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-surface-container-low p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface font-headline">Crear cuenta</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Únete a AgTech Colombia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Nombre completo", value: nombre, set: setNombre, type: "text",     placeholder: "Juan García" },
            { label: "Correo electrónico", value: email, set: setEmail, type: "email",   placeholder: "tu@empresa.com" },
            { label: "Contraseña", value: password, set: setPassword, type: "password", placeholder: "Mínimo 6 caracteres" },
            { label: "Confirmar contraseña", value: confirm, set: setConfirm, type: "password", placeholder: "••••••••" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">{f.label}</label>
              <input
                type={f.type} required value={f.value} onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
