'use client';

import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function TutorDashboard() {
  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="tutor" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutor Dashboard</h1>
              <p className="text-gray-600">Manage your tutoring business and help students succeed.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    <p className="text-sm text-gray-600 mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍🎓</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">This Month</p>
                    <p className="text-3xl font-bold text-gray-900">$0</p>
                  </div>
                  <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <p className="text-3xl font-bold text-gray-900">—</p>
                  </div>
                  <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-blue rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                    <p className="text-sm text-gray-600">Update your tutor information</p>
                  </div>
                </div>
                <Link href="/tutor/profile">
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </Link>
              </Card>

              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-amber rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Set Availability</h3>
                    <p className="text-sm text-gray-600">Manage your teaching schedule</p>
                  </div>
                </div>
                <Link href="/tutor/availability">
                  <Button variant="primary" className="w-full">Set Availability</Button>
                </Link>
              </Card>

              <Card hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Create Group Class</h3>
                    <p className="text-sm text-gray-600">Start a new group lesson</p>
                  </div>
                </div>
                <Link href="/tutor/classes/new">
                  <Button variant="outline" className="w-full">Create Class</Button>
                </Link>
              </Card>
            </div>

            {/* Next Lessons */}
            <div className="mt-8">
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Lessons</h2>
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No upcoming lessons</p>
                  <p className="text-sm mb-4">Your upcoming lessons will appear here.</p>
                  <Link href="/tutor/availability">
                    <Button variant="primary">Set Your Availability</Button>
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

