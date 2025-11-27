'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function TutorProfilePage() {
  const params = useParams();
  const tutorId = params.tutorId as string;
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await api.get(`/tutors/${tutorId}`);
        // Backend wraps response in { success: true, data: {...} }
        setTutor(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch tutor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchTutor();
    }
  }, [tutorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Tutor Not Found</h2>
          <p className="text-navy-700 mb-4">The tutor you're looking for doesn't exist.</p>
          <Link href="/tutors">
            <Button variant="primary">Browse All Tutors</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-sky-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-sky-blue-700 shadow-soft">
                {tutor.firstName?.[0]}{tutor.lastName?.[0]}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-navy-900 mb-2">
                {tutor.firstName} {tutor.lastName}
              </h1>
              {tutor.tutorProfile?.averageRating && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-lg font-semibold text-navy-900">
                    {tutor.tutorProfile.averageRating.toFixed(1)}
                  </span>
                  <span className="text-navy-600">({tutor.tutorProfile.totalLessonsTaught || 0} lessons)</span>
                </div>
              )}
              <div className="mb-6">
                <p className="text-3xl font-bold text-sky-blue-600 mb-1">
                  ${tutor.tutorProfile?.hourlyRate || 'N/A'}/hour
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Book a Lesson</Button>
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">About</h2>
              <p className="text-navy-700 whitespace-pre-line leading-relaxed">
                {tutor.tutorProfile?.bio || 'No bio available.'}
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.tutorProfile?.specialties?.length > 0 ? (
                  tutor.tutorProfile.specialties.map((spec: any, idx: number) => (
                    <Badge key={idx} variant="info">{spec.specialty}</Badge>
                  ))
                ) : (
                  <p className="text-navy-600">No specialties listed.</p>
                )}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Reviews</h2>
              <p className="text-navy-600">No reviews yet.</p>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-navy-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-navy-600">Total Lessons</p>
                  <p className="text-2xl font-bold text-navy-900">{tutor.tutorProfile?.totalLessonsTaught || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-navy-600">Total Students</p>
                  <p className="text-2xl font-bold text-navy-900">{tutor.tutorProfile?.totalStudents || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-navy-600">Response Time</p>
                  <p className="text-lg font-semibold text-navy-900">Within 24 hours</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-navy-900 mb-4">Availability</h3>
              <p className="text-navy-600 mb-4">Check tutor's calendar for available time slots.</p>
              <Button variant="outline" className="w-full">View Calendar</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

