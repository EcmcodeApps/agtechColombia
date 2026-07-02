"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/firebase/auth";

interface NavItem { href: string; label: string; }
interface Props {
  nav: NavItem[];
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ nav, mobileOpen, onClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <img src="/images/logo-agtech.png" alt="AgTech Colombia" className="h-7 w-auto brightness-0 invert" />
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium
                     text-red-400 hover:bg-red-500/10 transition-colors text-left">
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: sidebar fijo siempre visible ── */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[oklch(0.20_0.08_160)] shrink-0">
        <SidebarContent />
      </aside>

      {/* ── MOBILE: drawer overlay ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[oklch(0.20_0.08_160)] md:hidden
                            flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
