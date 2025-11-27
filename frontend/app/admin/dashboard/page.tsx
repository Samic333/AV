'use client';

import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-sky-blue-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy-900 mb-2">Admin Dashboard</h1>
              <p className="text-navy-600">Manage the AviatorTutor platform and community.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-navy-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Active Tutors</p>
                    <p className="text-3xl font-bold text-navy-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Upcoming Lessons</p>
                    <p className="text-3xl font-bold text-navy-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Revenue (MTD)</p>
                    <p className="text-3xl font-bold text-navy-900">$0</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-sky-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Pending Tutors</h3>
                    <p className="text-sm text-navy-600">Review tutor applications</p>
                  </div>
                </div>
                <Link href="/admin/tutors">
                  <Button variant="outline" className="w-full">Review Applications</Button>
                </Link>
              </Card>

              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-amber rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">All Bookings</h3>
                    <p className="text-sm text-navy-600">View and manage bookings</p>
                  </div>
                </div>
                <Link href="/admin/bookings">
                  <Button variant="primary" className="w-full">View Bookings</Button>
                </Link>
              </Card>

              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Payouts</h3>
                    <p className="text-sm text-navy-600">Process tutor payouts</p>
                  </div>
                </div>
                <Link href="/admin/payments/payouts">
                  <Button variant="outline" className="w-full">Manage Payouts</Button>
                </Link>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

