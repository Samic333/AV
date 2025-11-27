'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TutorAvailabilityPage() {
  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="tutor" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
              <p className="text-gray-600">Set your available time slots for lessons</p>
            </div>

            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
                <p className="text-gray-600 mb-4">
                  Select the days and times when you're available to teach. Students will only be 
                  able to book lessons during these time slots.
                </p>
                <Button variant="primary">Set Availability</Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Availability</h3>
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-2">No availability set</p>
                  <p className="text-sm">Set your availability to start receiving bookings</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

