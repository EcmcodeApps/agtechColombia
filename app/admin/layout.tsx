"use client";

import { usePathname } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

const NAV = [
  { href: "/admin/dashboard",  label: "Dashboard"  },
  { href: "/admin/empresas",   label: "Empresas"   },
  { href: "/admin/usuarios",   label: "Usuarios"   },
  { href: "/admin/pagos",      label: "Pagos"       },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/noticias",   label: "Noticias"   },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // La página de login NO lleva guard ni sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar nav={NAV} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </AdminGuard>
  );
}
