import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-grow p-4 sm:p-8 overflow-auto pt-18 md:pt-8">
        {children}
      </main>
    </div>
  );
}
