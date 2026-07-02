// Layout para flujos de formulario — sin BottomNav
// El BottomNav se suprime para mantener el foco en la tarea de publicación
export default function EmpresaFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
