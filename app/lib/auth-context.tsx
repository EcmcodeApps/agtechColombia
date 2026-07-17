"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "./firebase-auth";
import { usuariosService } from "./firestore-service";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  role: "empresa" | "candidato" | null;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, role: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [role,    setRole]    = useState<"empresa" | "candidato" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const usuario = await usuariosService.get(u.uid);
        setRole((usuario?.role as "empresa" | "candidato") ?? null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
