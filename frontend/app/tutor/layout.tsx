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
      <div className="min-h-screen bg-white">
        <TopBar />
        {children}
      </div>
    </AuthGuard>
  );
}


