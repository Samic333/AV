'use client';

import DashboardSidebar from '@/components/layout/DashboardSidebar';
import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-sky-blue-50 flex flex-col">
        <TopBar />
        <div className="flex flex-1">
          <DashboardSidebar role="tutor" />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}


