'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get('/tutors');
        setTutors(response.data.data?.tutors || []);
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Tutors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <a
              key={tutor.id}
              href={`/tutors/${tutor.tutorProfile.id}`}
              className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {tutor.firstName} {tutor.lastName}
              </h2>
              <p className="text-gray-600 mb-2">${tutor.tutorProfile.hourlyRate}/hour</p>
              {tutor.tutorProfile.averageRating && (
                <p className="text-yellow-600">⭐ {tutor.tutorProfile.averageRating}</p>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

