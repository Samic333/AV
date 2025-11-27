'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';

const AIRLINES = [
  { name: 'Ethiopian Airlines', logo: '🇪🇹' },
  { name: 'Emirates', logo: '🇦🇪' },
  { name: 'Qatar Airways', logo: '🇶🇦' },
  { name: 'Etihad Airways', logo: '🇦🇪' },
  { name: 'Turkish Airlines', logo: '🇹🇷' },
  { name: 'Lufthansa', logo: '🇩🇪' },
  { name: 'British Airways', logo: '🇬🇧' },
  { name: 'Air France', logo: '🇫🇷' },
];

export default function AirlineInterviewPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAirline, setSelectedAirline] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [selectedAirline]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedAirline) {
        params.append('airlineFocus', selectedAirline);
      }
      params.append('category', 'Cabin Crew Interview Prep');

      const [instructorsResponse, classesResponse] = await Promise.all([
        api.get(`/tutors?${params.toString()}`),
        api.get(`/classes?${params.toString()}`),
      ]);

      const instructorsData = instructorsResponse.data.data || instructorsResponse.data;
      setInstructors(instructorsData?.tutors || instructorsData || []);

      const classesData = classesResponse.data.data || classesResponse.data;
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Airline Interview Preparation</h1>
          <p className="text-xl text-navy-700 max-w-3xl mx-auto">
            Get expert guidance to ace your airline interviews. Connect with instructors who have experience with major airlines.
          </p>
        </div>

        {/* Airline Filter */}
        <Card className="mb-12">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Filter by Airline</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedAirline('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedAirline === ''
                  ? 'bg-sky-blue-600 text-white'
                  : 'bg-gray-100 text-navy-700 hover:bg-gray-200'
              }`}
            >
              All Airlines
            </button>
            {AIRLINES.map((airline) => (
              <button
                key={airline.name}
                onClick={() => setSelectedAirline(airline.name)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedAirline === airline.name
                    ? 'bg-sky-blue-600 text-white'
                    : 'bg-gray-100 text-navy-700 hover:bg-gray-200'
                }`}
              >
                {airline.logo} {airline.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Instructors Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">Interview Prep Instructors</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
            </div>
          ) : instructors.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-navy-700">No instructors found for this airline.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => (
                <Card key={instructor.id} hover>
                  <Link href={`/tutors/${instructor.tutorProfile?.id || instructor.id}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-sky-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-sky-blue-700 flex-shrink-0">
                        {instructor.firstName?.[0]}{instructor.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-navy-900 mb-1 truncate">
                          {instructor.firstName} {instructor.lastName}
                        </h3>
                        <Badge variant="info" className="mb-2">
                          Interview Prep Specialist
                        </Badge>
                        {instructor.tutorProfile?.averageRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-semibold text-navy-700">
                              {instructor.tutorProfile.averageRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-navy-600">Starting at</p>
                        <p className="text-2xl font-bold text-sky-blue-600">
                          ${instructor.tutorProfile?.hourlyRate || 'N/A'}/hr
                        </p>
                      </div>
                      <Button variant="primary" size="sm">View Profile</Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Classes Section */}
        <div>
          <h2 className="text-3xl font-bold text-navy-900 mb-8">Interview Prep Classes</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
            </div>
          ) : classes.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-navy-700">No classes found for this airline.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.id} hover>
                  <Link href={`/group-classes/${classItem.id}`}>
                    <Badge variant="info" className="mb-2">{classItem.category}</Badge>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{classItem.title}</h3>
                    <p className="text-navy-700 text-sm mb-4 line-clamp-2">{classItem.description}</p>
                    {classItem.airlineFocus && (
                      <Badge variant="default" className="mb-4">
                        {classItem.airlineFocus}
                      </Badge>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-navy-600">Price per student</p>
                        <p className="text-2xl font-bold text-sky-blue-600">
                          ${Number(classItem.pricePerStudent).toFixed(2)}
                        </p>
                      </div>
                      <Button variant="primary" size="sm">View Class</Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Request Help Section */}
        <Card className="mt-16 bg-sky-blue-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Need Help with a Specific Airline?</h2>
            <p className="text-navy-700 mb-6">
              Post a request and let instructors bid on helping you prepare for your interview
            </p>
            <Link href="/exam-prep">
              <Button variant="primary">Post Interview Prep Request</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

