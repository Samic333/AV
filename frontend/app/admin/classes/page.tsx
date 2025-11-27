'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminClassesPage() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Classes</h1>
              <p className="text-gray-600">Manage group class approvals</p>
            </div>

            <div className="mb-6 flex gap-4">
              <Button variant="outline" className="bg-white">All</Button>
              <Button variant="outline">Pending Approval</Button>
              <Button variant="outline">Approved</Button>
              <Button variant="outline">Rejected</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for classes */}
              <Card hover>
                <div className="mb-4">
                  <Badge variant="info" className="mb-2">IFR Training</Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced IFR Procedures</h3>
                  <p className="text-gray-600 text-sm mb-2">Tutor: John Doe</p>
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
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">Approve</Button>
                    <Button variant="danger" size="sm" className="flex-1">Reject</Button>
                  </div>
                </div>
              </Card>

              <Card className="text-center py-12">
                <p className="text-gray-600 mb-4">No group classes found</p>
                <p className="text-sm text-gray-500">Group class approvals will appear here</p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}


