'use client';

import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        {children}
      </div>
    </AuthGuard>
  );
}

