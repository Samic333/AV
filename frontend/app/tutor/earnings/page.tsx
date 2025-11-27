'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function TutorEarningsPage() {
  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="tutor" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
              <p className="text-gray-600">View your earnings and request payouts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-aviation-blue">$0</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-1">Pending Payout</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings History</h2>
                  <div className="space-y-4">
                    {/* Placeholder for earnings */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">IFR Training Session</p>
                          <p className="text-sm text-gray-600">Dec 25, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">$63.75</p>
                          <p className="text-xs text-gray-500">After 15% commission</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center py-12">
                    <p className="text-gray-600 mb-4">No earnings yet</p>
                    <p className="text-sm text-gray-500">Start teaching to earn money!</p>
                  </div>
                </Card>
              </div>

              <div>
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Payout</h2>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                    <p className="text-3xl font-bold text-aviation-blue">$0</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Payouts are processed within 3-5 business days.
                  </p>
                  <Button variant="primary" className="w-full" disabled>
                    Request Payout
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

