'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminStudentsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
              <p className="text-gray-600">View and manage all students</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
              />
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Lessons</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder for students */}
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Jane Smith</td>
                      <td className="py-3 px-4 text-gray-600">jane.smith@example.com</td>
                      <td className="py-3 px-4 text-gray-600">Dec 1, 2024</td>
                      <td className="py-3 px-4 text-gray-600">5</td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 text-center py-12">
                <p className="text-gray-600">No students found</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}


