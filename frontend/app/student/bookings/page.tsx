'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function StudentBookingsPage() {
  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="student" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage your lesson bookings</p>
            </div>

            <div className="mb-6 flex gap-4">
              <Button variant="outline" className="bg-white">All</Button>
              <Button variant="outline">Upcoming</Button>
              <Button variant="outline">Past</Button>
              <Button variant="outline">Cancelled</Button>
            </div>

            <div className="space-y-4">
              {/* Placeholder for bookings - will be populated from API */}
              <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">IFR Training Session</h3>
                    <p className="text-gray-600 text-sm mb-2">with John Doe</p>
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
                <p className="text-sm text-gray-500 mb-4">Book your first lesson to get started!</p>
                <Button variant="primary">Browse Tutors</Button>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

