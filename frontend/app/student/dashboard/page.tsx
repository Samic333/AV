'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import { format, parseISO, isAfter } from 'date-fns';

export default function StudentDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingLessons: 0,
    totalHours: 0,
    favoriteTutors: 0,
  });

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

      // Calculate stats
      const now = new Date();
      const upcoming = bookingsList.filter(
        (b: Booking) =>
          (b.status === 'confirmed' || b.status === 'pending') &&
          isAfter(parseISO(b.scheduledAt), now)
      );
      
      const completed = bookingsList.filter(
        (b: Booking) => b.status === 'completed'
      );
      
      const totalHours = completed.reduce(
        (sum: number, b: Booking) => sum + b.durationMinutes / 60,
        0
      );

      // Get unique tutor IDs
      const tutorIds = new Set(bookingsList.map((b: Booking) => b.tutorId));
      
      setStats({
        upcomingLessons: upcoming.length,
        totalHours: Math.round(totalHours * 10) / 10,
        favoriteTutors: tutorIds.size,
      });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextUpcomingLesson = () => {
    const now = new Date();
    const upcoming = bookings
      .filter(
        (b) =>
          (b.status === 'confirmed' || b.status === 'pending') &&
          isAfter(parseISO(b.scheduledAt), now)
      )
      .sort((a, b) => parseISO(a.scheduledAt).getTime() - parseISO(b.scheduledAt).getTime());

    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const nextLesson = getNextUpcomingLesson();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="student" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's an overview of your learning journey.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Lessons</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? '...' : stats.upcomingLessons}
                  </p>
                </div>
                <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours Learned</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? '...' : stats.totalHours}
                  </p>
                </div>
                <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✈️</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Favorite Tutors</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? '...' : stats.favoriteTutors}
                  </p>
                </div>
                <div className="w-12 h-12 bg-aviation-sky rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Next Upcoming Lesson */}
          <div className="mb-8">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Upcoming Lesson</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aviation-blue mx-auto"></div>
                </div>
              ) : nextLesson ? (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {nextLesson.lessonType || 'Lesson'}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        📅 {format(parseISO(nextLesson.scheduledAt), 'MMM d, yyyy')} at{' '}
                        {format(parseISO(nextLesson.scheduledAt), 'h:mm a')}
                      </p>
                      {nextLesson.tutor?.user && (
                        <p>
                          👨‍🏫 Tutor: {nextLesson.tutor.user.firstName} {nextLesson.tutor.user.lastName}
                        </p>
                      )}
                      <p>⏱️ Duration: {nextLesson.durationMinutes} minutes</p>
                      <p>💰 ${Number(nextLesson.totalPrice).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        nextLesson.status === 'confirmed'
                          ? 'success'
                          : nextLesson.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {nextLesson.status}
                    </Badge>
                    <Button
                      variant="primary"
                      onClick={() => router.push(`/student/bookings`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No upcoming lessons</p>
                  <p className="text-sm mb-4">Book your first lesson to get started!</p>
                  <Link href="/tutors">
                    <Button variant="primary">Find a Tutor</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-aviation-blue rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
                  <p className="text-sm text-gray-600">View and manage your lessons</p>
                </div>
              </div>
              <Link href="/student/bookings">
                <Button variant="outline" className="w-full">View Bookings</Button>
              </Link>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-aviation-amber rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Browse Tutors</h3>
                  <p className="text-sm text-gray-600">Find available aviation tutors</p>
                </div>
              </div>
              <Link href="/tutors">
                <Button variant="primary" className="w-full">Browse Tutors</Button>
              </Link>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Chat with your tutors</p>
                </div>
              </div>
              <Link href="/student/messages">
                <Button variant="outline" className="w-full">Go to Messages</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

