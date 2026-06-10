"use client";

import { useEffect, useState } from "react";
import { getAllUsers, getAllCompanies, getAllPagos } from "@/lib/firebase/firestore";
import Link from "next/link";

export default function AdminDashboard() {
  const [users,      setUsers]      = useState(0);
  const [companies,  setCompanies]  = useState(0);
  const [pagos,      setPagos]      = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllCompanies(), getAllPagos()]).then(([u, c, p]) => {
      setUsers(u.length);
      setCompanies(c.length);
      setPagos(p.length);
      setPendientes(p.filter(x => x.estado === "pendiente").length);
      setLoading(false);
    });
  }, []);

  const STATS = [
    { label: "Usuarios",       value: users,      icon: "👥", href: "/admin/usuarios", color: "bg-blue-50   border-blue-200",  num: "text-blue-700"  },
    { label: "Empresas",       value: companies,  icon: "🏢", href: "/admin/empresas", color: "bg-green-50  border-green-200", num: "text-green-700" },
    { label: "Total pagos",    value: pagos,      icon: "💳", href: "/admin/pagos",    color: "bg-purple-50 border-purple-200",num: "text-purple-700"},
    { label: "Pend. pagos",    value: pendientes, icon: "⏳", href: "/admin/pagos",    color: "bg-amber-50  border-amber-200", num: "text-amber-700" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface font-headline">Dashboard</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Resumen del panel de administración</p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map(s => (
            <Link key={s.label} href={s.href}
              className={`rounded-2xl border-2 ${s.color} p-4 sm:p-5 flex flex-col gap-2
                          hover:shadow-md transition-all hover:-translate-y-0.5`}>
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-2xl sm:text-3xl font-extrabold ${s.num}`}>{s.value}</span>
              <span className="text-xs sm:text-sm text-on-surface-variant font-medium leading-tight">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
          Acceso rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/admin/empresas",   icon: "🏢", title: "Gestionar empresas",   desc: "Activar, desactivar y revisar empresas registradas" },
            { href: "/admin/pagos",      icon: "💳", title: "Revisar pagos",        desc: "Aprobar o rechazar comprobantes de pago" },
            { href: "/admin/usuarios",   icon: "👥", title: "Ver usuarios",         desc: "Listado completo de usuarios registrados" },
            { href: "/admin/categorias", icon: "🏷️", title: "Categorías",           desc: "Gestionar categorías del directorio" },
            { href: "/admin/noticias",   icon: "📰", title: "Noticias",             desc: "Publicar y gestionar noticias AgTech" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-2xl border border-outline-variant/40 p-4
                         hover:shadow-md hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
