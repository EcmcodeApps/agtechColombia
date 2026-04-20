"use client";

import { useEffect, useState } from "react";
import { getAllUsers, getAllCompanies, getAllPagos } from "@/lib/firebase/firestore";

export default function AdminDashboard() {
  const [users,     setUsers]     = useState(0);
  const [companies, setCompanies] = useState(0);
  const [pagos,     setPagos]     = useState(0);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    getAllUsers().then(u => setUsers(u.length));
    getAllCompanies().then(c => setCompanies(c.length));
    getAllPagos().then(p => { setPagos(p.length); setPendientes(p.filter(x => x.estado === "pendiente").length); });
  }, []);

  const STATS = [
    { label: "Usuarios registrados", value: users,     icon: "👥" },
    { label: "Empresas",             value: companies, icon: "🏢" },
    { label: "Total pagos",          value: pagos,     icon: "💳" },
    { label: "Pagos pendientes",     value: pendientes, icon: "⏳" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="rounded-3xl bg-surface-container-low border border-outline-variant p-5 flex flex-col gap-2">
            <span className="text-2xl">{s.icon}</span>
            <span className="text-3xl font-extrabold text-on-surface">{s.value}</span>
            <span className="text-sm text-on-surface-variant">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
