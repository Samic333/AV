'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-sky-blue-50 flex flex-col">
        <TopBar />
        <div className="flex flex-1">
          <DashboardSidebar role="student" />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}


