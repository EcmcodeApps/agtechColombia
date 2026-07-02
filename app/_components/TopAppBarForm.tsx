// TopAppBar para flujos de formulario multi-paso
export type FormBarAction = "close" | "login" | "none";

interface TopAppBarFormProps {
  rightAction?: FormBarAction;
}

export default function TopAppBarForm({
  rightAction = "close",
}: TopAppBarFormProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
        {/* Logo + marca */}
        <div className="flex items-center gap-base">
          <button aria-label="Abrir menú" className="active:scale-95 duration-200">
            <span className="material-symbols-outlined text-primary">menu</span>
          </button>
          <h1 className="text-headline-md font-bold text-primary">TalentoYa</h1>
        </div>

        {/* Acción derecha según variante */}
        {rightAction === "close" && (
          <div className="flex items-center gap-md">
            {/* Desktop: texto */}
            <button className="hidden md:block text-label-md text-on-surface-variant hover:bg-surface-container transition-colors px-base py-xs rounded-lg">
              Cerrar
            </button>
            {/* Móvil: ícono */}
            <button className="md:hidden p-1 rounded-full hover:bg-surface-container transition-colors" aria-label="Cerrar">
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>
        )}

        {rightAction === "login" && (
          <button className="bg-primary-container text-on-primary-container px-md py-xs rounded-full text-label-md hover:bg-primary hover:text-on-primary transition-colors active:scale-95 duration-200">
            Ingresar
          </button>
        )}
      </div>
    </header>
  );
}
