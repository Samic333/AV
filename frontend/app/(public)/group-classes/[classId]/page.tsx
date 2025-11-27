'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { format, parseISO } from 'date-fns';
import { useAuthStore } from '@/store/auth-store';

export default function GroupClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [classItem, setClassItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (params.classId) {
      fetchClassDetails();
    }
  }, [params.classId]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/classes/${params.classId}`);
      const responseData = response.data.data || response.data;
      setClassItem(responseData);
    } catch (error) {
      console.error('Failed to fetch class details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can enroll in classes');
      return;
    }

    try {
      setEnrolling(true);
      await api.post(`/classes/${params.classId}/enroll`);
      alert('Successfully enrolled! Redirecting to payment...');
      router.push('/student/payments');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to enroll in class');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600"></div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <p className="text-lg text-navy-700 mb-4">Class not found</p>
            <Link href="/group-classes">
              <Button variant="primary">Back to Classes</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const seatsLeft = classItem.maxStudents - (classItem.enrollments?.length || 0);
  const isEnrolled = user && classItem.enrollments?.some((e: any) => e.booking?.student?.id === user.id);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/group-classes" className="text-sky-blue-600 hover:text-sky-blue-700 mb-4 inline-block">
          ← Back to Classes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              {classItem.category && (
                <Badge variant="info" className="mb-4">
                  {classItem.category}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-navy-900 mb-4">{classItem.title}</h1>
              <div className="prose max-w-none mb-6">
                <p className="text-navy-700 whitespace-pre-line">{classItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-navy-600 mb-1">Instructor</p>
                  <p className="font-semibold text-navy-900">
                    {classItem.tutor?.user?.firstName} {classItem.tutor?.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-navy-600 mb-1">Date & Time</p>
                  <p className="font-semibold text-navy-900">
                    {format(parseISO(classItem.scheduledAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-navy-700">
                    {format(parseISO(classItem.scheduledAt), 'h:mm a')} ({classItem.durationMinutes} min)
                  </p>
                </div>
                {classItem.language && (
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Language</p>
                    <p className="font-semibold text-navy-900">{classItem.language}</p>
                  </div>
                )}
                {classItem.aircraftType && (
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Aircraft Type</p>
                    <p className="font-semibold text-navy-900">{classItem.aircraftType}</p>
                  </div>
                )}
                {classItem.airlineFocus && (
                  <div>
                    <p className="text-sm text-navy-600 mb-1">Airline Focus</p>
                    <p className="font-semibold text-navy-900">{classItem.airlineFocus}</p>
                  </div>
                )}
              </div>

              {classItem.videoUrl && (
                <div className="mb-6">
                  <p className="text-sm text-navy-600 mb-2">Intro Video</p>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <a
                      href={classItem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-blue-600 hover:text-sky-blue-700"
                    >
                      Watch Video →
                    </a>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-navy-600 mb-1">Price per student</p>
                <p className="text-4xl font-bold text-sky-blue-600">
                  ${Number(classItem.pricePerStudent).toFixed(2)}
                </p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-navy-600">Max Students</span>
                  <span className="font-semibold text-navy-900">{classItem.maxStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-600">Enrolled</span>
                  <span className="font-semibold text-navy-900">
                    {classItem.enrollments?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-600">Seats Left</span>
                  <span className={`font-semibold ${seatsLeft > 0 ? 'text-navy-900' : 'text-red-600'}`}>
                    {seatsLeft}
                  </span>
                </div>
              </div>

              {isEnrolled ? (
                <Button variant="outline" className="w-full" disabled>
                  Already Enrolled
                </Button>
              ) : seatsLeft === 0 ? (
                <Button variant="outline" className="w-full" disabled>
                  Class Full
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Join Class'}
                </Button>
              )}

              {user && user.role === 'student' && (
                <p className="text-xs text-navy-600 text-center mt-4">
                  You'll be redirected to payment after enrollment
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

