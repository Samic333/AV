'use client';

import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function StudentDashboard() {
  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="student" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's an overview of your learning journey.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Upcoming Lessons</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Lessons</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Tutors</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-blue rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
                    <p className="text-sm text-gray-600">View and manage your lessons</p>
                  </div>
                </div>
                <Link href="/student/bookings">
                  <Button variant="outline" className="w-full">View Bookings</Button>
                </Link>
              </Card>

              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-amber rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Find a Tutor</h3>
                    <p className="text-sm text-gray-600">Browse available aviation tutors</p>
                  </div>
                </div>
                <Link href="/tutors">
                  <Button variant="primary" className="w-full">Browse Tutors</Button>
                </Link>
              </Card>

              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                    <p className="text-sm text-gray-600">Chat with your tutors</p>
                  </div>
                </div>
                <Link href="/student/messages">
                  <Button variant="outline" className="w-full">Open Messages</Button>
                </Link>
              </Card>
            </div>

            {/* Upcoming Lessons */}
            <div className="mt-8">
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Lessons</h2>
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No upcoming lessons</p>
                  <p className="text-sm mb-4">Book your first lesson to get started!</p>
                  <Link href="/tutors">
                    <Button variant="primary">Find a Tutor</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

