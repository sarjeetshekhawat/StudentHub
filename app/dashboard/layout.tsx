import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="ml-64 flex-1 min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </div>
  );
}
