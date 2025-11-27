'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get('/tutors');
        // Backend wraps response in { success: true, data: {...} }
        const responseData = response.data.data || response.data;
        setTutors(responseData?.tutors || responseData || []);
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aviation-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Tutors</h1>
          <p className="text-xl text-gray-600">Find experienced aviation professionals to help you succeed</p>
        </div>

        {tutors.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No tutors available at the moment.</p>
            <p className="text-sm text-gray-500">Check back later or become a tutor yourself!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <Card key={tutor.id} hover className="flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {tutor.firstName} {tutor.lastName}
                    </h3>
                    {tutor.tutorProfile.averageRating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold text-gray-700">
                          {tutor.tutorProfile.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {tutor.tutorProfile.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tutor.tutorProfile.bio}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Hourly Rate</p>
                      <p className="text-2xl font-bold text-aviation-blue">
                        ${tutor.tutorProfile.hourlyRate}
                      </p>
                    </div>
                  </div>
                  <Link href={`/tutors/${tutor.tutorProfile.id}`}>
                    <Button variant="primary" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

