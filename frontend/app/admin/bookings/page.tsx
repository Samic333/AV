'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminBookingsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Bookings</h1>
              <p className="text-gray-600">View and manage all lesson bookings</p>
            </div>

            <div className="mb-6 flex gap-4">
              <Button variant="outline" className="bg-white">All</Button>
              <Button variant="outline">Pending</Button>
              <Button variant="outline">Confirmed</Button>
              <Button variant="outline">Completed</Button>
              <Button variant="outline">Cancelled</Button>
            </div>

            <div className="space-y-4">
              {/* Placeholder for bookings */}
              <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">IFR Training Session</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Student: Jane Smith | Tutor: John Doe
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📅 Dec 25, 2024 at 2:00 PM</span>
                      <span>⏱️ 60 minutes</span>
                      <span>💰 $75</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="success">Confirmed</Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </Card>

              <Card className="text-center py-12">
                <p className="text-lg text-gray-600 mb-2">No bookings found</p>
                <p className="text-sm text-gray-500">All bookings will appear here</p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}


