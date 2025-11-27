'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminPaymentsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
              <p className="text-gray-600">View payment overview and transactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-1">Platform Fees</p>
                <p className="text-3xl font-bold text-aviation-blue">$0</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </Card>
            </div>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
              <div className="space-y-4">
                {/* Placeholder for transactions */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">IFR Training Session</p>
                      <p className="text-sm text-gray-600">Dec 25, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$75.00</p>
                      <Badge variant="success" className="mt-1">Completed</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center py-12">
                <p className="text-gray-600">No transactions found</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

