"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopAppBarProps {
  userName: string;
  userType: string;
  avatarUrl: string;
  hasNotification?: boolean;
}

const navItems = [
  { href: "/home",     label: "Inicio"   },
  { href: "/vacantes", label: "Vacantes" },
  { href: "/matches",  label: "Matches"  },
  { href: "/perfil",   label: "Perfil"   },
];

export default function TopAppBar({
  userName,
  userType,
  avatarUrl,
  hasNotification = false,
}: TopAppBarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between gap-lg">
        {/* Avatar + nombre */}
        <div className="flex items-center gap-sm flex-shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <Image
              src={avatarUrl}
              alt={userName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface">{userName}</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              {userType}
            </span>
          </div>
        </div>

        {/* Navegación desktop — oculta en móvil/tablet */}
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

        {/* Campana */}
        <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors relative active:scale-95 duration-200 flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-[22px]">
            notifications
          </span>
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-energy-orange rounded-full border-2 border-surface" />
          )}
        </button>
      </div>
    </header>
  );
}
