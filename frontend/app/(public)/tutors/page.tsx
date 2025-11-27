'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [featuredTutors, setFeaturedTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    aircraftType: '',
    minRating: '',
    maxPrice: '',
    search: '',
  });

  const SPECIALTIES = [
    'IFR',
    'VFR',
    'ATPL theory',
    'CPL theory',
    'Airline assessment prep',
    'Airline Interview',
    'Cabin crew recruitment',
    'ATC training',
    'Aircraft systems',
    'Aviation English',
    'Simulator training',
    'MCC/JOC',
    'Maintenance basics',
  ];

  const AIRCRAFT_TYPES = [
    'Boeing 737',
    'Boeing 777',
    'Boeing 787',
    'Airbus A320',
    'Airbus A330',
    'Airbus A350',
    'Q400',
    'ATR72',
    'Cessna 172',
    'Piper',
    'DA-42',
  ];

  useEffect(() => {
    fetchTutors();
    fetchFeatured();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search || filters.specialty || filters.aircraftType || filters.minRating || filters.maxPrice) {
        performSearch();
      } else {
        fetchTutors();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.aircraftType) params.append('aircraftType', filters.aircraftType);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/tutors?${params.toString()}`);
      const responseData = response.data.data || response.data;
      const tutorsList = responseData?.tutors || responseData || [];
      setTutors(tutorsList);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await api.get('/tutors/featured/list');
      const responseData = response.data.data || response.data;
      setFeaturedTutors(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error('Failed to fetch featured tutors:', error);
    }
  };

  const performSearch = async () => {
    try {
      setSearchLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.aircraftType) params.append('aircraftType', filters.aircraftType);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/tutors?${params.toString()}`);
      const responseData = response.data.data || response.data;
      const tutorsList = responseData?.tutors || responseData || [];
      setTutors(tutorsList);
    } catch (error) {
      console.error('Failed to search tutors:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Find Instructor</h1>
          <p className="text-xl text-navy-700">Find experienced aviation professionals to help you succeed</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, aircraft type, or specialty..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Specialty</label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Aircraft Type</label>
              <select
                value={filters.aircraftType}
                onChange={(e) => setFilters({ ...filters, aircraftType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              >
                <option value="">All Aircraft</option>
                {AIRCRAFT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
                <option value="3.5">3.5+</option>
                <option value="3.0">3.0+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Max Price ($/hr)</label>
              <input
                type="number"
                placeholder="No limit"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              />
            </div>
          </div>
          {(filters.search || filters.specialty || filters.aircraftType || filters.minRating || filters.maxPrice) && (
            <button
              onClick={() => setFilters({ specialty: '', aircraftType: '', minRating: '', maxPrice: '', search: '' })}
              className="mt-4 text-sm text-sky-blue-600 hover:text-sky-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </Card>

        {(loading || searchLoading) ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : tutors.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-navy-700 mb-4">No instructors found matching your criteria.</p>
            <p className="text-sm text-navy-600 mb-4">Try adjusting your filters or check back later.</p>
            <Button variant="outline" onClick={() => setFilters({ specialty: '', aircraftType: '', minRating: '', maxPrice: '', search: '' })}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-6 text-sm text-navy-700">
              Showing {tutors.length} {tutors.length === 1 ? 'instructor' : 'instructors'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <Card key={tutor.id} hover className="flex flex-col">
                  <Link href={`/tutors/${tutor.tutorProfile?.id || tutor.id}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-sky-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-sky-blue-700 flex-shrink-0">
                        {tutor.firstName?.[0]}{tutor.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-navy-900 mb-1 truncate">
                          {tutor.firstName} {tutor.lastName}
                        </h3>
                        {tutor.tutorProfile?.specialties?.[0] && (
                          <Badge variant="info" className="mb-2">
                            {tutor.tutorProfile.specialties[0].specialty}
                          </Badge>
                        )}
                        {tutor.tutorProfile?.averageRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-semibold text-navy-700">
                              {tutor.tutorProfile.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-navy-600">
                              ({tutor.tutorProfile.totalLessonsTaught || 0})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {tutor.tutorProfile?.bio && (
                      <p className="text-navy-700 text-sm mb-4 line-clamp-3">
                        {tutor.tutorProfile.bio}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-navy-600">Starting at</p>
                          <p className="text-2xl font-bold text-sky-blue-600">
                            ${tutor.tutorProfile?.hourlyRate || 'N/A'}/hr
                          </p>
                        </div>
                      </div>
                      <Button variant="primary" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Featured Instructors Section */}
        {featuredTutors.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-2">Featured Instructors</h2>
              <p className="text-lg text-navy-700">Top-rated instructors recommended for you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutors.map((tutor) => (
                <Card key={tutor.id} hover className="flex flex-col border-2 border-sky-blue-200">
                  <Link href={`/tutors/${tutor.tutorProfile?.id || tutor.id}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-sky-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-sky-blue-700 flex-shrink-0">
                        {tutor.firstName?.[0]}{tutor.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-navy-900 truncate">
                            {tutor.firstName} {tutor.lastName}
                          </h3>
                          <Badge variant="info" className="bg-yellow-400 text-yellow-900">
                            Featured
                          </Badge>
                        </div>
                        {tutor.tutorProfile?.specialties?.[0] && (
                          <Badge variant="info" className="mb-2">
                            {tutor.tutorProfile.specialties[0].specialty}
                          </Badge>
                        )}
                        {tutor.tutorProfile?.averageRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-semibold text-navy-700">
                              {tutor.tutorProfile.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-navy-600">
                              ({tutor.tutorProfile.totalLessonsTaught || 0})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {tutor.tutorProfile?.bio && (
                      <p className="text-navy-700 text-sm mb-4 line-clamp-3">
                        {tutor.tutorProfile.bio}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-navy-600">Starting at</p>
                          <p className="text-2xl font-bold text-sky-blue-600">
                            ${tutor.tutorProfile?.hourlyRate || 'N/A'}/hr
                          </p>
                        </div>
                      </div>
                      <Button variant="primary" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

