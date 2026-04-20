"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/firebase/auth";

interface Props { nav: { href: string; label: string }[]; }

export default function AdminSidebar({ nav }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-inverse-surface px-4 py-6 gap-1">
      <div className="mb-6 px-2">
        <span className="text-base font-bold text-inverse-on-surface font-headline">AgTech Admin</span>
      </div>
      {nav.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-primary text-on-primary" : "text-inverse-on-surface hover:bg-surface/10"
            }`}>
            {label}
          </Link>
        );
      })}
      <div className="mt-auto">
        <button onClick={handleLogout}
          className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-error hover:bg-surface/10 transition-colors text-left">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
