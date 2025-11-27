'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import { format, parseISO } from 'date-fns';

type FilterType = 'all' | 'pending' | 'confirmed' | 'completed';

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tutor/bookings');
      const data = response.data.data || response.data;
      const bookingsList = Array.isArray(data) ? data : [];
      setBookings(bookingsList);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await api.put(`/tutor/bookings/${bookingId}/accept`);
      fetchBookings();
    } catch (error) {
      console.error('Failed to accept booking:', error);
      alert('Failed to accept booking. Please try again.');
    }
  };

  const handleDecline = async (bookingId: string) => {
    try {
      await api.put(`/tutor/bookings/${bookingId}/decline`);
      fetchBookings();
    } catch (error) {
      console.error('Failed to decline booking:', error);
      alert('Failed to decline booking. Please try again.');
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter((b) => b.status === filter);
  };

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

  const filteredBookings = getFilteredBookings();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Bookings</h1>
          <p className="text-navy-600">Manage your lesson bookings</p>
        </div>

        <div className="mb-6 flex gap-4 flex-wrap">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'primary' : 'outline'}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-navy-600 mb-2">No bookings found</p>
            <p className="text-sm text-navy-500">
              {filter === 'all' ? 'Your bookings will appear here' : `No ${filter} bookings found.`}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy-900 mb-1">
                      {booking.lessonType || 'Lesson'}
                    </h3>
                    {booking.student && (
                      <p className="text-navy-600 text-sm mb-2">
                        with {booking.student.firstName} {booking.student.lastName}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600">
                      <span>
                        📅 {format(parseISO(booking.scheduledAt), 'MMM d, yyyy')} at{' '}
                        {format(parseISO(booking.scheduledAt), 'h:mm a')}
                      </span>
                      <span>⏱️ {booking.durationMinutes} minutes</span>
                      <span>💰 ${Number(booking.totalPrice).toFixed(2)}</span>
                      {booking.tutorPayout && (
                        <span>💵 Payout: ${Number(booking.tutorPayout).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAccept(booking.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecline(booking.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

