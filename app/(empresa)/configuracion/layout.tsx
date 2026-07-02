"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuC3m0gU-8QvxaD2crVEuV2Re0YJLNfVtnf7SU_u3G-KP_u_Gg9TmRPC8TBnvqizyETMCoFRJ4v97G64NIFgLaL7M-dbIkfmcw6I7WB3oSNezGijiokk27_OhEMIjjHpAgEkpRSDamrcCyLHgAD2rzpQAH8w5do0BCBkUVRmv_H_iHAA9YE_GI3tiRKQmc9aDvgUiUEoIpjq6aaN6FTRw0yLRYt_lHJr-ohG5drxCAJb4dWB3vow7Slw1oGo5JQqYwbO9ShVyoBSFQ";

const NAV = [
  { href: "/configuracion/perfil",      icon: "person",       label: "Mi Perfil" },
  { href: "/configuracion/suscripcion", icon: "stars",        label: "Suscripción" },
  { href: "/configuracion/suscripcion", icon: "credit_card",  label: "Métodos de Pago" },
  { href: "/configuracion/suscripcion", icon: "receipt_long", label: "Facturación" },
  { href: "/configuracion/seguridad",    icon: "shield",       label: "Seguridad" },
  { href: "/configuracion",             icon: "settings",     label: "Ajustes" },
];

export default function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const isActive = (href: string) =>
    href === "/configuracion" ? path === "/configuracion" : path.startsWith(href);

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface shadow-sm flex items-center justify-between px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">settings</span>
          <h1 className="text-headline-md font-bold text-primary">Configuración</h1>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-xs hover:bg-surface-container-high rounded-full transition-colors" aria-label="Notificaciones">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-container">
            <Image src={AVATAR} alt="Avatar" width={36} height={36} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex pt-16">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 fixed top-16 bottom-0 bg-surface-container-low border-r border-outline-variant py-xl overflow-y-auto">
          {/* User card */}
          <div className="px-lg mb-xl">
            <div className="flex items-center gap-md p-md bg-white rounded-xl shadow-sm border border-outline-variant">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-label-md select-none">CL</div>
              <div>
                <p className="text-label-md text-primary">Admin TalentoYa</p>
                <p className="text-label-sm text-on-surface-variant">Plan PYME Pro</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-xs pr-md">
            {NAV.map(({ href, icon, label }) => (
              <Link key={`${href}-${label}`} href={href}
                className={`flex items-center gap-md py-sm px-md text-label-md transition-all ${
                  isActive(href)
                    ? "text-primary font-bold border-r-4 border-primary bg-primary-fixed rounded-r-lg"
                    : "text-on-surface-variant hover:bg-surface-container-highest rounded-r-lg"
                }`}>
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 lg:ml-[280px] pb-16 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
