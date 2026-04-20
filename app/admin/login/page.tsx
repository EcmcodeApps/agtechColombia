"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AdminLoginPage() {
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
      const snap = await getDoc(doc(db, "admins", cred.user.uid));
      if (!snap.exists()) { setError("No tienes permisos de administrador."); return; }
      router.replace("/admin/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-inverse-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-surface p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface font-headline">Admin</h1>
          <p className="mt-1 text-sm text-on-surface-variant">AgTech Colombia</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Correo", value: email, set: setEmail, type: "email" },
            { label: "Contraseña", value: password, set: setPassword, type: "password" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">{f.label}</label>
              <input type={f.type} required value={f.value} onChange={e => f.set(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          ))}
          {error && <p className="text-sm text-error">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 disabled:opacity-60 transition-opacity">
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
