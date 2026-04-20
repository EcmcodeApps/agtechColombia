import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardBottomNav from "@/components/dashboard/DashboardBottomNav";

export default function CatalogosLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen bg-surface">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col pb-20 md:pb-0">{children}</main>
        <DashboardBottomNav />
      </div>
    </DashboardGuard>
  );
}
