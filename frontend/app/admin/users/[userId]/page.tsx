'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [suspendReason, setSuspendReason] = useState('');

  useEffect(() => {
    if (params.userId) {
      fetchUserDetails();
    }
  }, [params.userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${params.userId}`);
      const data = response.data.data || response.data;
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      alert('Please provide a reason for suspension');
      return;
    }

    if (!confirm(`Are you sure you want to suspend this user? Reason: ${suspendReason}`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${params.userId}/suspend`, { reason: suspendReason });
      alert('User suspended successfully');
      router.push('/admin/users');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to suspend user');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="text-center py-12">
            <p className="text-lg text-navy-700 mb-4">User not found</p>
            <Link href="/admin/users">
              <Button variant="primary">Back to Users</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/users" className="text-sky-blue-600 hover:text-sky-blue-700 mb-4 inline-block">
          ← Back to Users
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'tutor' ? 'info' : 'default'}>
              {user.role}
            </Badge>
            {user.deletedAt && <Badge variant="danger">Suspended</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-navy-600">Email</p>
                <p className="font-semibold text-navy-900">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-navy-600">Phone</p>
                  <p className="font-semibold text-navy-900">{user.phone}</p>
                </div>
              )}
              {user.country && (
                <div>
                  <p className="text-sm text-navy-600">Country</p>
                  <p className="font-semibold text-navy-900">{user.country}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-navy-600">Timezone</p>
                <p className="font-semibold text-navy-900">{user.timezone}</p>
              </div>
              <div>
                <p className="text-sm text-navy-600">Joined</p>
                <p className="font-semibold text-navy-900">
                  {format(parseISO(user.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </Card>

          {/* Role-Specific Info */}
          {user.role === 'tutor' && user.tutorProfile && (
            <Card>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Instructor Profile</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-navy-600">Status</p>
                  <Badge variant={user.tutorProfile.status === 'approved' ? 'success' : 'warning'}>
                    {user.tutorProfile.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-navy-600">Hourly Rate</p>
                  <p className="font-semibold text-navy-900">${Number(user.tutorProfile.hourlyRate).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-navy-600">Rating</p>
                  <p className="font-semibold text-navy-900">
                    {user.tutorProfile.averageRating ? user.tutorProfile.averageRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-navy-600">Total Lessons</p>
                  <p className="font-semibold text-navy-900">{user.tutorProfile.totalLessonsTaught}</p>
                </div>
              </div>
            </Card>
          )}

          {user.role === 'student' && user.studentProfile && (
            <Card>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Student Profile</h2>
              <div className="space-y-3">
                {user.studentProfile.yearsOfAviationExperience !== null && (
                  <div>
                    <p className="text-sm text-navy-600">Years of Experience</p>
                    <p className="font-semibold text-navy-900">
                      {user.studentProfile.yearsOfAviationExperience}
                    </p>
                  </div>
                )}
                {user.studentProfile.currentRole && (
                  <div>
                    <p className="text-sm text-navy-600">Current Role</p>
                    <p className="font-semibold text-navy-900">{user.studentProfile.currentRole}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Bookings */}
        {user.bookingsAsStudent && user.bookingsAsStudent.length > 0 && (
          <Card className="mt-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Recent Bookings</h2>
            <div className="space-y-2">
              {user.bookingsAsStudent.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center p-3 bg-sky-blue-50 rounded">
                  <div>
                    <p className="font-semibold text-navy-900">{booking.lessonType || 'Lesson'}</p>
                    <p className="text-sm text-navy-600">
                      {format(parseISO(booking.scheduledAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={booking.status === 'completed' ? 'success' : 'warning'}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Suspend User */}
        {!user.deletedAt && (
          <Card className="mt-6 bg-red-50 border-red-200">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Suspend User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">
                  Reason for Suspension
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter reason for suspension..."
                />
              </div>
              <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700" onClick={handleSuspend}>
                Suspend User
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

