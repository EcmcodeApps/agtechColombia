"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import type { User } from "firebase/auth";

interface AuthGuardResult {
  user: User | null;
  loading: boolean;
}

/**
 * Redirige a /login si el usuario no está autenticado.
 * Retorna { user, loading } para usarlo en la página.
 */
export function useAuthGuard(redirectTo = "/login"): AuthGuardResult {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
