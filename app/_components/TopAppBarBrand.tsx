"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home",     label: "Inicio"   },
  { href: "/vacantes", label: "Vacantes" },
  { href: "/matches",  label: "Matches"  },
  { href: "/perfil",   label: "Perfil"   },
];

// TopAppBar de marca — usado en páginas públicas o de exploración
export default function TopAppBarBrand() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-[0px_4px_20px_rgba(15,76,129,0.05)]">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between gap-lg">
        {/* Logo + marca */}
        <div className="flex items-center gap-md flex-shrink-0">
          <button
            className="p-xs active:scale-95 duration-200 lg:hidden"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <Link href="/home">
            <h1 className="text-headline-md font-bold text-primary">TalentoYa</h1>
          </Link>
        </div>

        {/* Navegación desktop */}
        <nav className="hidden lg:flex items-center gap-xs">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`px-md py-xs rounded-full text-label-md transition-colors ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Botón de acceso */}
        <button className="text-primary font-bold hover:bg-surface-container transition-colors px-md py-xs rounded-full text-label-md flex-shrink-0">
          Ingresar
        </button>
      </div>
    </header>
  );
}
