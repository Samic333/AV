'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { Booking, TutorProfileExtended } from '@/lib/types';
import { format, parseISO, isToday, isAfter, startOfDay } from 'date-fns';

export default function TutorDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tutorProfile, setTutorProfile] = useState<TutorProfileExtended | null>(null);
  const [wallet, setWallet] = useState<{
    balance: number;
    pendingBalance: number;
    totalEarned: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch bookings
      const bookingsResponse = await api.get('/tutor/bookings');
      const bookingsData = bookingsResponse.data.data || bookingsResponse.data;
      const bookingsList = Array.isArray(bookingsData) ? bookingsData : [];
      setBookings(bookingsList);

      // Fetch tutor profile
      const profileResponse = await api.get('/tutor/profile');
      const profileData = profileResponse.data.data || profileResponse.data;
      setTutorProfile(profileData);

      // Fetch wallet
      try {
        const walletResponse = await api.get('/tutor/earnings/wallet');
        const walletData = walletResponse.data.data || walletResponse.data;
        setWallet({
          balance: Number(walletData.balance || 0),
          pendingBalance: Number(walletData.pendingBalance || 0),
          totalEarned: Number(walletData.totalEarned || 0),
        });
      } catch (error) {
        // Wallet might not exist yet
        setWallet({ balance: 0, pendingBalance: 0, totalEarned: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(
      (b) =>
        (b.status === 'confirmed' || b.status === 'pending') &&
        isAfter(parseISO(b.scheduledAt), now)
    );
  };

  const getTodaysBookings = () => {
    return bookings.filter((b) => {
      const bookingDate = parseISO(b.scheduledAt);
      return (
        isToday(bookingDate) &&
        (b.status === 'confirmed' || b.status === 'pending')
      );
    });
  };

  const upcomingCount = getUpcomingBookings().length;
  const todaysBookings = getTodaysBookings();
  const monthlyEarnings = wallet ? wallet.totalEarned : 0; // Simplified - could calculate from transactions
  const totalStudents = tutorProfile?.totalStudents || 0;

  return (
    <div className="min-h-screen bg-sky-blue-50 flex">
      <DashboardSidebar role="tutor" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Tutor Dashboard</h1>
            <p className="text-navy-600">Manage your tutoring business and help students succeed.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Upcoming Lessons</p>
                  <p className="text-3xl font-bold text-navy-900">
                    {isLoading ? '...' : upcomingCount}
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
                  <p className="text-sm text-navy-600 mb-1">Monthly Earnings</p>
                  <p className="text-3xl font-bold text-navy-900">
                    {isLoading ? '...' : `$${monthlyEarnings.toFixed(2)}`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Total Students Taught</p>
                  <p className="text-3xl font-bold text-navy-900">
                    {isLoading ? '...' : totalStudents}
                  </p>
                </div>
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Today's Schedule */}
          <div className="mb-8">
            <Card>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Today's Schedule</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
                </div>
              ) : todaysBookings.length > 0 ? (
                <div className="space-y-4">
                  {todaysBookings.map((booking) => (
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
                            🕐 {format(parseISO(booking.scheduledAt), 'h:mm a')} ({booking.durationMinutes} min)
                          </p>
                          {booking.student && (
                            <p>
                              👨‍🎓 Student: {booking.student.firstName} {booking.student.lastName}
                            </p>
                          )}
                          <p>💰 ${Number(booking.totalPrice).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            booking.status === 'confirmed'
                              ? 'success'
                              : booking.status === 'pending'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Button
                          variant="primary"
                          onClick={() => router.push(`/tutor/bookings`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No lessons scheduled for today</p>
                  <p className="text-sm mb-4">Your upcoming lessons will appear here.</p>
                  <Link href="/tutor/availability">
                    <Button variant="primary">Set Your Availability</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-sky-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">Edit Profile</h3>
                  <p className="text-sm text-navy-600">Update your tutor information</p>
                </div>
              </div>
              <Link href="/tutor/profile">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-sky-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">Set Availability</h3>
                  <p className="text-sm text-navy-600">Manage your teaching schedule</p>
                </div>
              </div>
              <Link href="/tutor/availability">
                <Button variant="primary" className="w-full">Set Availability</Button>
              </Link>
            </Card>

            <Card hover>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">Create Group Class</h3>
                  <p className="text-sm text-navy-600">Start a new group lesson</p>
                </div>
              </div>
              <Link href="/tutor/classes/new">
                <Button variant="outline" className="w-full">Create Group Class</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

