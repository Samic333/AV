'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: '',
    minRating: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await api.get('/tutors');
        const responseData = response.data.data || response.data;
        const tutorsList = responseData?.tutors || responseData || [];
        setTutors(tutorsList);
        setFilteredTutors(tutorsList);
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  useEffect(() => {
    let filtered = [...tutors];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (tutor) =>
          `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchLower) ||
          tutor.tutorProfile?.bio?.toLowerCase().includes(searchLower) ||
          tutor.tutorProfile?.specialties?.some((s: any) =>
            s.specialty?.toLowerCase().includes(searchLower)
          )
      );
    }

    if (filters.role) {
      filtered = filtered.filter((tutor) =>
        tutor.tutorProfile?.specialties?.some((s: any) =>
          s.specialty?.toLowerCase().includes(filters.role.toLowerCase())
        )
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(
        (tutor) => (tutor.tutorProfile?.averageRating || 0) >= parseFloat(filters.minRating)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (tutor) => (tutor.tutorProfile?.hourlyRate || 0) <= parseFloat(filters.maxPrice)
      );
    }

    setFilteredTutors(filtered);
  }, [filters, tutors]);

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
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Browse Instructors</h1>
          <p className="text-xl text-navy-700">Find experienced aviation professionals to help you succeed</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
              >
                <option value="">All Roles</option>
                <option value="pilot">Pilot</option>
                <option value="cabin crew">Cabin Crew</option>
                <option value="atc">ATC</option>
                <option value="engineer">Engineer</option>
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
          {(filters.search || filters.role || filters.minRating || filters.maxPrice) && (
            <button
              onClick={() => setFilters({ role: '', minRating: '', maxPrice: '', search: '' })}
              className="mt-4 text-sm text-sky-blue-600 hover:text-sky-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </Card>

        {filteredTutors.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-navy-700 mb-4">No tutors found matching your criteria.</p>
            <p className="text-sm text-navy-600 mb-4">Try adjusting your filters or check back later.</p>
            <Button variant="outline" onClick={() => setFilters({ role: '', minRating: '', maxPrice: '', search: '' })}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-6 text-sm text-navy-700">
              Showing {filteredTutors.length} {filteredTutors.length === 1 ? 'instructor' : 'instructors'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
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
      </div>
    </div>
  );
}

