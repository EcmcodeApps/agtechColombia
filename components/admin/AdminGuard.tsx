"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/** Verifica si hay una sesión de junta válida en sessionStorage */
export function isJuntaSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem("junta_session");
    if (!raw) return false;
    const { expira } = JSON.parse(raw);
    return Date.now() < expira;
  } catch {
    return false;
  }
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Primero verificar sesión de junta temporal
    if (isJuntaSession()) {
      setIsAdmin(true);
      return;
    }

    if (loading) return;
    if (!user) { router.replace("/admin/login"); return; }

    getDoc(doc(db, "admins", user.uid)).then(s => {
      if (s.exists()) setIsAdmin(true);
      else { setIsAdmin(false); router.replace("/admin/login"); }
    });
  }, [user, loading, router]);

  if (loading || isAdmin === null) return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.20_0.08_160)]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
  if (!isAdmin) return null;
  return <>{children}</>;
}
