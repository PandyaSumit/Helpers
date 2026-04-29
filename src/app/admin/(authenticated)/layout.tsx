import AdminSidebar from '@/components/AdminSidebar';

export default function AdminAuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100/60">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="min-h-screen px-4 pb-0 pt-20 sm:px-6 lg:px-10 lg:pb-0 lg:pt-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
