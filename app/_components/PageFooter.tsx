import Link from "next/link";

interface PageFooterProps {
  /** Clases extra para controlar visibilidad responsiva (ej. "hidden md:flex") */
  className?: string;
  showLogo?: boolean;
}

export default function PageFooter({
  className = "",
  showLogo = false,
}: PageFooterProps) {
  return (
    <footer
      className={`w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-md bg-surface-container border-t border-outline-variant ${className}`}
    >
      {showLogo && (
        <div className="text-headline-md font-bold text-primary">TalentoYa</div>
      )}

      <div className="flex flex-wrap justify-center gap-md md:gap-lg">
        <Link
          href="#"
          className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
        >
          Política de privacidad
        </Link>
        <Link
          href="#"
          className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
        >
          Términos de uso
        </Link>
        <Link
          href="#"
          className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
        >
          Soporte y contacto
        </Link>
        <Link
          href="https://wa.me/57300000000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          Soporte por WhatsApp
        </Link>
      </div>

      <p className="text-body-sm text-on-surface-variant opacity-70 text-center">
        © 2025 TalentoYa Colombia. Todos los derechos reservados.
      </p>
    </footer>
  );
}
