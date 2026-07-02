import Image from "next/image";
import Link from "next/link";

const PROFILE_AV = "https://lh3.googleusercontent.com/aida-public/AB6AXuArV0qRybU8OqAaKjhLxgkcmT5htEgj7LjSiL3OhPLc18X8zXHze664ZrB-TYMNppVxwBS56M2xWxNJBv6Y4CflFSPqm76lcz1ygh3mRbqXIEYQLlkvKDo7kNX2bD1Nb8Ab3GSLmfvejZpFXvC8pL4tvIKuUv9uzAzBH6Y8-2HqJsOc-Yth3ODz0Kj0XUzhMToHVl-aeEZydrWgsysI4XBMoHmEIdiLhM4jBcNLBGw2nmoTbyevTtYaNpzlmfcT1EElGPypehuFbA";

const MENU = [
  { href: "/configuracion/suscripcion", icon: "stars",        bg: "bg-primary-fixed",         iconColor: "text-primary", label: "Suscripción",       sub: <>Plan actual: <strong className="text-primary">PYME Pro</strong></> },
  { href: "/configuracion/suscripcion", icon: "credit_card",  bg: "bg-surface-container-high", iconColor: "text-on-surface-variant", label: "Métodos de Pago", sub: <>Visa terminada en <strong>****4242</strong></> },
  { href: "/configuracion/suscripcion", icon: "receipt_long", bg: "bg-surface-container-high", iconColor: "text-on-surface-variant", label: "Facturación",       sub: "Historial y facturas pendientes" },
  { href: "#",                          icon: "language",     bg: "bg-surface-container-high", iconColor: "text-on-surface-variant", label: "Idioma y Región",   sub: "Español (Colombia)" },
];

const card = "bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,76,129,0.05)]";

export default function ConfiguracionPage() {
  return (
    <div className="px-margin-mobile md:px-gutter py-xl">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter max-w-5xl">

        {/* ── Perfil + menú ────────────────────────────────────────── */}
        <section className="xl:col-span-8 space-y-gutter">

          {/* Tarjeta de perfil */}
          <div className={`${card} p-xl`}>
            <div className="flex flex-col md:flex-row items-center gap-xl">
              <div className="relative">
                <Image src={PROFILE_AV} alt="Admin" width={96} height={96}
                  className="w-24 h-24 rounded-full border-4 border-surface-container shadow-sm object-cover" />
                <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:scale-105 transition-transform" aria-label="Editar foto">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-headline-md text-on-surface">Juan Pérez Rodríguez</h2>
                <p className="text-body-md text-on-surface-variant">juan.perez@TalentoYa.co</p>
                <div className="mt-sm flex flex-wrap justify-center md:justify-start gap-xs">
                  <span className="px-sm py-xs bg-secondary-container text-on-secondary-container rounded-full text-label-sm">Admin Principal</span>
                  <span className="px-sm py-xs bg-primary-fixed text-on-primary-fixed-variant rounded-full text-label-sm">Bogotá, CO</span>
                </div>
              </div>
              <Link href="/configuracion/perfil"
                className="px-lg py-sm border border-primary text-primary rounded-xl text-label-md hover:bg-surface-container-high transition-colors active:scale-95">
                Editar Perfil
              </Link>
            </div>
          </div>

          {/* Menú de categorías */}
          <div className="space-y-md">
            <p className="text-label-md text-outline px-sm">Preferencias de la Cuenta</p>
            {MENU.map(({ href, icon, bg, iconColor, label, sub }) => (
              <Link key={label} href={href}
                className={`${card} flex items-center justify-between p-lg hover:bg-surface-container-low transition-all active:scale-[0.99]`}>
                <div className="flex items-center gap-lg">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${iconColor}`}
                      style={icon === "stars" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {icon}
                    </span>
                  </div>
                  <div>
                    <span className="block text-label-md text-on-surface">{label}</span>
                    <span className="block text-body-sm text-on-surface-variant">{sub}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Soporte + Seguridad ──────────────────────────────────── */}
        <aside className="xl:col-span-4 space-y-gutter">

          {/* Soporte WhatsApp */}
          <div className={`${card} p-xl bg-primary text-white relative overflow-hidden`}>
            <div className="relative z-10">
              <h3 className="text-headline-md mb-sm">¿Necesitas ayuda?</h3>
              <p className="text-body-sm opacity-90 mb-xl">Nuestro equipo está disponible para ayudarte con tu configuración.</p>
              <button className="w-full flex items-center justify-center gap-sm py-md px-lg bg-[#25D366] text-white rounded-xl text-label-md hover:scale-[1.02] transition-transform active:scale-95">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                Contactar vía WhatsApp
              </button>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">support_agent</span>
            </div>
          </div>

          {/* Estado de seguridad */}
          <div className={`${card} p-xl`}>
            <h3 className="text-label-md text-on-surface mb-lg">Estado de Seguridad</h3>
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-body-sm">Contraseña segura</span>
                </div>
                <Link href="/configuracion/seguridad" className="text-primary text-label-sm hover:underline">Cambiar</Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <span className="text-body-sm">2FA Desactivado</span>
                </div>
                <Link href="/configuracion/seguridad" className="text-primary text-label-sm hover:underline">Activar</Link>
              </div>
              <div className="pt-md border-t border-outline-variant">
                <p className="text-label-sm text-on-surface-variant">Último acceso: Hace 2 horas desde Bogotá</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
