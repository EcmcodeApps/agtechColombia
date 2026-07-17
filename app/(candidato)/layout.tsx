import BottomNavCandidato from "@/app/_components/BottomNavCandidato";

export default function CandidatoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="lg:hidden">
        <BottomNavCandidato />
      </div>
    </>
  );
}
