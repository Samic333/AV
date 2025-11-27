'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import { format, parseISO, isAfter, isBefore } from 'date-fns';

type FilterType = 'all' | 'upcoming' | 'past' | 'cancelled';

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
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

  const getFilteredBookings = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return bookings.filter(
          (b) =>
            (b.status === 'confirmed' || b.status === 'pending') &&
            isAfter(parseISO(b.scheduledAt), now)
        );
      case 'past':
        return bookings.filter(
          (b) =>
            b.status === 'completed' ||
            (isBefore(parseISO(b.scheduledAt), now) && b.status !== 'cancelled')
        );
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      default:
        return bookings;
    }
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
          <h1 className="text-3xl font-bold text-navy-900 mb-2">My Bookings</h1>
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
              variant={filter === 'upcoming' ? 'primary' : 'outline'}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'primary' : 'outline'}
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'primary' : 'outline'}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </Button>
          </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-navy-600 mb-2">No bookings found</p>
            <p className="text-sm text-navy-500 mb-4">
              {filter === 'all'
                ? 'Book your first lesson to get started!'
                : `No ${filter} bookings found.`}
            </p>
            {filter === 'all' && (
              <Link href="/tutors">
                <Button variant="primary">Find Instructor</Button>
              </Link>
            )}
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
                    {booking.tutor?.user && (
                      <p className="text-navy-600 text-sm mb-2">
                        with {booking.tutor.user.firstName} {booking.tutor.user.lastName}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600">
                      <span>
                        📅 {format(parseISO(booking.scheduledAt), 'MMM d, yyyy')} at{' '}
                        {format(parseISO(booking.scheduledAt), 'h:mm a')}
                      </span>
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

