import AdminSidebar from '@/components/AdminSidebar';

export default function AdminAuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar />
      <div className="lg:pl-60">
        <main className="min-h-screen px-6 pb-12 pt-16 lg:px-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
