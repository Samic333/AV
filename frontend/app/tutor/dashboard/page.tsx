'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function TutorDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user || user.role !== 'tutor') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'tutor') {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <div className="space-x-4">
            <span>Welcome, {user.firstName}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/tutor/profile"
            className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">My Profile</h2>
            <p className="text-gray-600">Manage your tutor profile and settings</p>
          </a>
          <a
            href="/tutor/bookings"
            className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Bookings</h2>
            <p className="text-gray-600">View and manage lesson bookings</p>
          </a>
          <a
            href="/tutor/earnings"
            className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Earnings</h2>
            <p className="text-gray-600">View your earnings and request payouts</p>
          </a>
        </div>
      </div>
    </div>
  );
}

