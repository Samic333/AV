'use client';

import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function TutorClassesPage() {
  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="tutor" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Classes</h1>
                <p className="text-gray-600">Manage your group classes</p>
              </div>
              <Link href="/tutor/classes/new">
                <Button variant="primary">Create New Class</Button>
              </Link>
            </div>

            <div className="mb-6 flex gap-4">
              <Button variant="outline" className="bg-white">All</Button>
              <Button variant="outline">Pending Approval</Button>
              <Button variant="outline">Approved</Button>
              <Button variant="outline">Completed</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for classes */}
              <Card hover>
                <div className="mb-4">
                  <Badge variant="info" className="mb-2">IFR Training</Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced IFR Procedures</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn advanced instrument flight rules and procedures.
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Price per student</p>
                      <p className="text-xl font-bold text-aviation-blue">$25</p>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </Card>

              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">No group classes yet</p>
                <Link href="/tutor/classes/new">
                  <Button variant="primary">Create Your First Class</Button>
                </Link>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

