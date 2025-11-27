'use client';

import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        {children}
      </div>
    </AuthGuard>
  );
}

