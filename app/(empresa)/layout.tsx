// Layout compartido para todas las páginas de empresa.
// BottomNav visible en móvil y tablet — se oculta en desktop (lg+),
// donde la navegación queda en el TopAppBar horizontal.
import BottomNav from "@/app/_components/BottomNav";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Ocultar BottomNav en pantallas lg+ */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </>
  );
}
