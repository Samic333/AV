'use client';

import TopBar from '@/components/layout/TopBar';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-white flex flex-col">
        <TopBar />
        <div className="flex flex-1">
          <DashboardSidebar role="admin" />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}


