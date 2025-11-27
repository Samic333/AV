'use client';

import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-white">
        <TopBar />
        {children}
      </div>
    </AuthGuard>
  );
}


