"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/candidato/home",           icon: "home",         label: "Inicio"      },
  { href: "/candidato/vacantes",       icon: "work_history", label: "Empleos"     },
  { href: "/candidato/postulaciones",  icon: "description",  label: "Solicitudes" },
  { href: "/candidato/mensajes",       icon: "chat",         label: "Mensajes"    },
  { href: "/candidato/perfil",         icon: "person",       label: "Perfil"      },
];

export default function BottomNavCandidato() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex items-center px-xs py-base bg-surface border-t border-outline-variant shadow-[0px_-4px_20px_rgba(15,76,129,0.05)] rounded-t-xl">
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-1 min-w-0 flex-col items-center justify-center rounded-full px-1 sm:px-4 py-1 active:scale-90 transition-transform ${
              isActive
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-[10px] sm:text-label-sm mt-0.5 truncate max-w-full">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
