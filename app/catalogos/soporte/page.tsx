"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const FAQ = [
  { q: "¿Cómo subo mi catálogo PDF?", a: "Ve a la sección Catálogos, haz clic en '+ Subir PDF' y selecciona el archivo desde tu dispositivo. El archivo quedará disponible para descarga inmediatamente." },
  { q: "¿Cuántas fotos puedo subir?", a: "Depende de tu plan: Gratuito (3), Básico (10), Profesional (30), Empresa (ilimitado)." },
  { q: "¿Cómo cambio a un plan superior?", a: "Ve a la sección Planes, elige el plan que deseas y haz clic en 'Contratar'. Luego registra tu comprobante de pago." },
  { q: "¿Cómo aparece mi empresa en el directorio?", a: "Al completar el proceso de onboarding y tener un plan activo, tu empresa aparece automáticamente en el directorio público." },
  { q: "¿Puedo cambiar el logo de mi empresa?", a: "Sí, ve a Ajustes y en la sección Empresa encontrarás la opción para cambiar tu logo." },
];

export default function SoportePage() {
  const { user } = useAuth();
  const [open, setOpen] = useState<number | null>(null);
  const [msg, setMsg]   = useState("");
  const [sent, setSent] = useState(false);

  function handleContact(e: React.FormEvent) {
    e.preventDefault();
    // In production: send to a Firestore collection or email
    setSent(true);
  }

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <h1 className="text-xl font-bold text-on-surface font-headline">Centro de soporte</h1>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="font-semibold text-on-surface">Preguntas frecuentes</h2>
        {FAQ.map((item, i) => (
          <div key={i} className="rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              {item.q}
              <span className={`ml-3 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}>▾</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-on-surface-variant">{item.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* Contact form */}
      <section className="space-y-4">
        <h2 className="font-semibold text-on-surface">Contáctanos</h2>
        {sent ? (
          <div className="rounded-2xl bg-primary-container p-4 text-sm text-on-primary-container">
            ✓ Mensaje enviado. Responderemos en 24-48 horas hábiles.
          </div>
        ) : (
          <form onSubmit={handleContact} className="space-y-3 rounded-3xl bg-surface-container-low border border-outline-variant p-5">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Correo de respuesta</label>
              <input type="email" defaultValue={user?.email ?? ""} readOnly
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface opacity-70" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Mensaje</label>
              <textarea required rows={4} value={msg} onChange={e => setMsg(e.target.value)}
                placeholder="Describe tu consulta o problema…"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <button type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity">
              Enviar mensaje
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
