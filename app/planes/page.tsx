"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserPlan } from "@/lib/firebase/firestore";
import Link from "next/link";

const PLANES = [
  {
    id: "gratuito", nombre: "Gratuito", precio: "$0",
    features: ["1 catálogo PDF", "3 fotos", "Sin video", "Directorio básico"],
  },
  {
    id: "basico", nombre: "Básico", precio: "$150.000/mes",
    features: ["5 catálogos PDF", "10 fotos", "1 video", "Directorio completo", "2 representantes"],
    highlight: false,
  },
  {
    id: "profesional", nombre: "Profesional", precio: "$300.000/mes",
    features: ["15 catálogos PDF", "30 fotos", "5 videos", "Todo Básico", "5 representantes", "Soporte prioritario"],
    highlight: true,
  },
  {
    id: "empresa", nombre: "Empresa", precio: "$600.000/mes",
    features: ["Ilimitado", "Fotos ilimitadas", "Videos ilimitados", "Todo Profesional", "Representantes ilimitados", "Gerente de cuenta"],
  },
];

export default function PlanesPage() {
  const { user }   = useAuth();
  const [plan, setPlan] = useState<string>("gratuito");

  useEffect(() => {
    if (user) getUserPlan(user.uid).then(p => setPlan(p ?? "gratuito"));
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-on-surface font-headline">Planes y precios</h1>
      <p className="text-sm text-on-surface-variant">Tu plan actual: <strong className="text-on-surface capitalize">{plan}</strong></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANES.map(p => (
          <div key={p.id}
            className={`rounded-3xl border p-6 flex flex-col gap-3 ${
              p.highlight
                ? "border-primary bg-primary-container"
                : "border-outline-variant bg-surface-container-low"
            } ${plan === p.id ? "ring-2 ring-primary" : ""}`}>
            {p.highlight && <span className="self-start rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">Recomendado</span>}
            <h2 className={`text-lg font-bold ${p.highlight ? "text-on-primary-container" : "text-on-surface"} font-headline`}>{p.nombre}</h2>
            <p className={`text-2xl font-extrabold ${p.highlight ? "text-on-primary-container" : "text-on-surface"}`}>{p.precio}</p>
            <ul className="space-y-1.5 flex-1">
              {p.features.map(f => (
                <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                  <span className="text-primary">✓</span> {f}
                </li>
              ))}
            </ul>
            {plan === p.id ? (
              <span className="rounded-xl border border-primary py-2 text-center text-sm font-medium text-primary">Plan actual</span>
            ) : (
              <Link href="/pagos/nuevo"
                className={`rounded-xl py-2 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                  p.highlight ? "bg-primary text-on-primary" : "bg-surface-container border border-outline-variant text-on-surface"
                }`}>
                Contratar
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
