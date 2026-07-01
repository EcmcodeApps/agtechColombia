"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":                   "Inicio",
  "/dashboard/perfil":            "Mi Perfil",
  "/dashboard/ajustes":           "Ajustes",
  "/catalogos":                   "Catálogos",
  "/catalogos/productos":         "Productos",
  "/catalogos/directorio":        "Directorio",
  "/catalogos/representantes":    "Representantes",
  "/catalogos/galeria":           "Galería",
  "/pagos":                       "Pagos",
  "/planes":                      "Planes",
  "/directorio":                  "Directorio Público",
  "/foro":                        "AgForo",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = Object.entries(PAGE_TITLES).find(([k]) =>
    pathname === k || (k !== "/dashboard" && pathname.startsWith(k))
  )?.[1] ?? "Dashboard";

  return (
    <DashboardGuard>
      <div className="flex min-h-screen bg-surface">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header móvil */}
          <header className="md:hidden sticky top-0 z-30 flex items-center gap-3
                             bg-white border-b border-outline-variant/40 px-4 h-14 shadow-sm">
            <Link href="/" className="text-primary font-bold text-sm font-headline shrink-0">
              🌱
            </Link>
            <span className="text-sm font-semibold text-on-surface flex-1 truncate">{title}</span>
            <Link href="/dashboard/ajustes"
              className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-base shrink-0">
              ⚙️
            </Link>
          </header>

          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            {children}
          </main>
        </div>

        <DashboardBottomNav />
      </div>
    </DashboardGuard>
  );
}
