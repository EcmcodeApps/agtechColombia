"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard",               label: "Inicio",          icon: "🏠" },
  { href: "/catalogos",               label: "Catálogos",       icon: "📄" },
  { href: "/catalogos/directorio",    label: "Directorio",      icon: "🏢" },
  { href: "/catalogos/representantes",label: "Representantes",  icon: "👤" },
  { href: "/catalogos/galeria",       label: "Galería",         icon: "🖼️" },
  { href: "/pagos",                   label: "Pagos",           icon: "💳" },
  { href: "/planes",                  label: "Planes",          icon: "⭐" },
  { href: "/dashboard/perfil",        label: "Perfil",          icon: "✏️" },
  { href: "/dashboard/ajustes",       label: "Ajustes",         icon: "⚙️" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-surface-container-low border-r border-outline-variant px-4 py-6 gap-1">
      <div className="mb-6 px-2">
        <span className="text-lg font-bold text-primary font-headline">AgTech Colombia</span>
      </div>

      {NAV.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link key={href} href={href}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>{icon}</span> {label}
          </Link>
        );
      })}

      <div className="mt-auto">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-error hover:bg-error-container transition-colors">
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
