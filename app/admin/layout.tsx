"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isJuntaSession } from "@/components/admin/AdminGuard";

const NAV = [
  { href: "/admin/dashboard",  label: "📊 Dashboard"  },
  { href: "/admin/empresas",   label: "🏢 Empresas"   },
  { href: "/admin/usuarios",   label: "👥 Usuarios"   },
  { href: "/admin/pagos",      label: "💳 Pagos"      },
  { href: "/admin/exportar",   label: "📤 Exportar"   },
  { href: "/admin/categorias", label: "🏷️ Categorías" },
  { href: "/admin/noticias",   label: "📰 Noticias"   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [esJunta,   setEsJunta]   = useState(false);

  useEffect(() => {
    setEsJunta(isJuntaSession());
  }, []);

  // La página de login NO lleva guard ni sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[oklch(0.96_0.005_160)]">

        {/* Sidebar (desktop fijo / mobile drawer) */}
        <AdminSidebar nav={NAV} mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Área principal */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top bar móvil */}
          <header className="md:hidden sticky top-0 z-30 flex items-center gap-3
                             bg-[oklch(0.20_0.08_160)] px-4 h-14 shadow-md">
            <button
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         text-white hover:bg-white/10 transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <span className="text-sm font-bold text-white font-headline flex-1 truncate">
              🌱 AgTech Admin
            </span>
          </header>

          {/* Banner modo junta */}
          {esJunta && (
            <div className="bg-amber-400 text-amber-900 text-xs font-semibold
                            px-4 py-2 flex items-center justify-center gap-2 text-center">
              🏛️ Modo Junta Directiva — Acceso temporal activo (8 horas). Solo lectura y consulta.
            </div>
          )}

          {/* Contenido de la página */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
