'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import { format, parseISO, startOfDay, isSameDay, groupBy } from 'date-fns';

export default function StudentCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/bookings');
      const data = response.data.data || response.data;
      const bookingsList = Array.isArray(data) ? data : [];
      setBookings(bookingsList);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingsByDay = () => {
    const grouped = groupBy(bookings, (booking) =>
      format(startOfDay(parseISO(booking.scheduledAt)), 'yyyy-MM-dd')
    );
    return grouped;
  };

  const bookingsByDay = getBookingsByDay();
  const sortedDays = Object.keys(bookingsByDay).sort();

  const getStatusBadgeVariant = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="student" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
            <p className="text-gray-600">View your lessons by date</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aviation-blue mx-auto"></div>
            </div>
          ) : sortedDays.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-lg text-gray-600 mb-2">No bookings scheduled</p>
              <p className="text-sm text-gray-500 mb-4">Book your first lesson to get started!</p>
              <Link href="/tutors">
                <Button variant="primary">Browse Tutors</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedDays.map((day) => {
                const dayBookings = bookingsByDay[day];
                const dayDate = parseISO(day);

                return (
                  <Card key={day}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {format(dayDate, 'EEEE, MMMM d, yyyy')}
                    </h2>
                    <div className="space-y-4">
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {booking.lessonType || 'Lesson'}
                            </h3>
                            {booking.tutor?.user && (
                              <p className="text-gray-600 text-sm mb-2">
                                with {booking.tutor.user.firstName} {booking.tutor.user.lastName}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <span>🕐 {format(parseISO(booking.scheduledAt), 'h:mm a')}</span>
                              <span>⏱️ {booking.durationMinutes} minutes</span>
                              <span>💰 ${Number(booking.totalPrice).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                              {booking.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

