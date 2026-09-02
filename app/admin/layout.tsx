import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminHeader from "@/component/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      <AdminSidebar />
      <div className="ml-60 transition-all duration-300 max-md:ml-[68px]">
        <AdminHeader />
        <main className="p-6 max-md:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
