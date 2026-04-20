"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard",            label: "Inicio",      icon: "🏠" },
  { href: "/catalogos",            label: "Catálogos",   icon: "📄" },
  { href: "/catalogos/directorio", label: "Directorio",  icon: "🏢" },
  { href: "/pagos",                label: "Pagos",       icon: "💳" },
  { href: "/dashboard/ajustes",    label: "Ajustes",     icon: "⚙️" },
];

export default function DashboardBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface-container-low border-t border-outline-variant flex z-50">
      {NAV.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link key={href} href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span className="text-lg leading-none">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
