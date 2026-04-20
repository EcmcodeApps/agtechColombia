"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, getCompany, getUserPlan, getUserPagos, type UserProfile, type CompanyRecord } from "@/lib/firebase/firestore";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyRecord | null>(null);
  const [plan, setPlan]       = useState<string>("gratuito");
  const [pagos, setPagos]     = useState(0);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setProfile);
    getCompany(user.uid).then(setCompany);
    getUserPlan(user.uid).then(p => setPlan(p ?? "gratuito"));
    getUserPagos(user.uid).then(p => setPagos(p.length));
  }, [user]);

  const CARDS = [
    { label: "Catálogos",    href: "/catalogos",             icon: "📄", desc: "Gestiona tus catálogos PDF" },
    { label: "Directorio",   href: "/catalogos/directorio",  icon: "🏢", desc: "Empresas del ecosistema" },
    { label: "Representantes", href: "/catalogos/representantes", icon: "👤", desc: "Tu equipo comercial" },
    { label: "Galería",      href: "/catalogos/galeria",     icon: "🖼️", desc: "Fotos y videos de empresa" },
    { label: "Pagos",        href: "/pagos",                 icon: "💳", desc: `${pagos} registro${pagos !== 1 ? "s" : ""}` },
    { label: "Mi plan",      href: "/planes",                icon: "⭐", desc: plan.charAt(0).toUpperCase() + plan.slice(1) },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {company?.logoUrl
          ? <img src={company.logoUrl} alt="logo" className="h-14 w-14 rounded-2xl object-cover border border-outline-variant" />
          : <div className="h-14 w-14 rounded-2xl bg-primary-container flex items-center justify-center text-2xl">🌱</div>
        }
        <div>
          <h1 className="text-xl font-bold text-on-surface font-headline">
            {company?.nombre ?? profile?.nombre ?? "Mi empresa"}
          </h1>
          <p className="text-sm text-on-surface-variant">Plan {plan}</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CARDS.map(({ label, href, icon, desc }) => (
          <Link key={href} href={href}
            className="rounded-3xl bg-surface-container-low p-5 hover:bg-surface-container transition-colors flex flex-col gap-2 border border-outline-variant">
            <span className="text-2xl">{icon}</span>
            <span className="font-semibold text-on-surface text-sm">{label}</span>
            <span className="text-xs text-on-surface-variant">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
