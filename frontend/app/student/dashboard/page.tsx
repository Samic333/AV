'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Booking } from '@/lib/types';
import { format, parseISO, isAfter } from 'date-fns';

export default function StudentDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [failedPayments, setFailedPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    upcomingLessons: 0,
    totalHours: 0,
    favoriteTutors: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.firstName || 'Student';

  useEffect(() => {
    fetchBookings();
    checkProfileCompletion();
    fetchPaymentNotifications();
  }, []);

  const fetchPaymentNotifications = async () => {
    try {
      const response = await api.get('/payments/history');
      const data = response.data.data || response.data;
      const transactionsList = Array.isArray(data) ? data : [];
      const payments = transactionsList.filter((t: any) => t.type === 'payment');
      setPendingPayments(payments.filter((t: any) => t.status === 'pending'));
      setFailedPayments(payments.filter((t: any) => t.status === 'failed'));
    } catch (error) {
      console.error('Failed to fetch payment notifications:', error);
    }
  };

  const checkProfileCompletion = async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data.data || response.data;
      
      // Try to fetch student profile
      try {
        const profileResponse = await api.get('/students/profile');
        const profileData = profileResponse.data.data || profileResponse.data;
        setStudentProfile(profileData);
        
        // Check if profile is complete
        const complete = !!(
          userData.firstName &&
          userData.lastName &&
          userData.timezone &&
          profileData?.yearsOfAviationExperience !== undefined
        );
        setProfileComplete(complete);
      } catch (error) {
        // Profile might not exist yet
        const complete = !!(
          userData.firstName &&
          userData.lastName &&
          userData.timezone
        );
        setProfileComplete(complete);
      }
    } catch (error) {
      console.error('Failed to check profile completion:', error);
    }
  };

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
    <div className="min-h-screen bg-sky-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-1">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-gray-500 text-sm">Welcome back, Student</p>
        </div>

        {/* Profile Completion Prompt */}
        {!profileComplete && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">Complete Your Profile</h3>
                <p className="text-navy-700 text-sm">
                  Complete your profile to get better matches with instructors and unlock all features.
                </p>
              </div>
              <Link href="/student/profile">
                <Button variant="primary">Finish Profile</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Payment Notifications */}
        {(pendingPayments.length > 0 || failedPayments.length > 0) && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-1">
                    Payment {pendingPayments.length > 0 ? 'Pending' : 'Failed'}
                  </h3>
                  <p className="text-navy-700 text-sm">
                    {pendingPayments.length > 0 && `${pendingPayments.length} payment${pendingPayments.length > 1 ? 's' : ''} waiting to be completed. `}
                    {failedPayments.length > 0 && `${failedPayments.length} payment${failedPayments.length > 1 ? 's' : ''} failed. `}
                    Click to resolve.
                  </p>
                </div>
              </div>
              <Link href="/student/payments">
                <Button variant="primary">View Payments</Button>
              </Link>
            </div>
          </Card>
        )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Upcoming Lessons</p>
                  <p className="text-3xl font-bold text-navy-900">
                    {isLoading ? '...' : stats.upcomingLessons}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Total Hours Learned</p>
                  <p className="text-3xl font-bold text-navy-900">
                    {isLoading ? '...' : stats.totalHours}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✈️</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Favorite Tutors</p>
                  <p className="text-3xl font-bold text-navy-900">
                    {isLoading ? '...' : stats.favoriteTutors}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming Lessons */}
          <div className="mb-8">
            <Card>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Upcoming Lessons</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
                </div>
              ) : nextLesson ? (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-sky-blue-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">
                      {nextLesson.lessonType || 'Lesson'}
                    </h3>
                    <div className="space-y-1 text-sm text-navy-600">
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
                    {nextLesson.meetingLink && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(nextLesson.meetingLink, '_blank')}
                        className="ml-2"
                      >
                        Join (Zoom)
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No upcoming lessons</p>
                  <p className="text-sm mb-4">Book your first lesson to get started!</p>
                  <Link href="/tutors">
                    <Button variant="primary">Find Instructor</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Lessons */}
          {bookings.filter((b) => b.status === 'completed').length > 0 && (
            <div className="mb-8">
              <Card>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Recent Lessons</h2>
                <div className="space-y-4">
                  {bookings
                    .filter((b) => b.status === 'completed')
                    .slice(0, 3)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-sky-blue-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-navy-900 mb-2">
                            {booking.lessonType || 'Lesson'}
                          </h3>
                          <div className="space-y-1 text-sm text-navy-600">
                            <p>
                              📅 {format(parseISO(booking.scheduledAt), 'MMM d, yyyy')} at{' '}
                              {format(parseISO(booking.scheduledAt), 'h:mm a')}
                            </p>
                            {booking.tutor?.user && (
                              <p>
                                👨‍🏫 Instructor: {booking.tutor.user.firstName} {booking.tutor.user.lastName}
                              </p>
                            )}
                            <p>⏱️ Duration: {booking.durationMinutes} minutes</p>
                          </div>
                        </div>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-sky-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">My Bookings</h3>
                  <p className="text-sm text-navy-600">View and manage your lessons</p>
                </div>
              </div>
              <Link href="/student/bookings">
                <Button variant="outline" className="w-full">View Bookings</Button>
              </Link>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-sky-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">Find Instructor</h3>
                  <p className="text-sm text-navy-600">Find available aviation instructors</p>
                </div>
              </div>
              <Link href="/tutors">
                <Button variant="primary" className="w-full">Find Instructor</Button>
              </Link>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">Messages</h3>
                  <p className="text-sm text-navy-600">Chat with your instructors</p>
                </div>
              </div>
              <Link href="/student/messages">
                <Button variant="outline" className="w-full">Go to Messages</Button>
              </Link>
            </Card>
          </div>
      </div>
    </div>
  );
}

