'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { format, parseISO } from 'date-fns';

export default function GroupClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchClasses();
  }, [categoryFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/classes?${params.toString()}`);
      const responseData = response.data.data || response.data;
      setClasses(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchClasses();
  };

  const getSeatsLeft = (classItem: any) => {
    return classItem.maxStudents - (classItem.enrollments?.length || 0);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Group Classes</h1>
          <p className="text-xl text-navy-700 max-w-2xl mx-auto">
            Join group learning sessions with other aviation enthusiasts
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            <option value="ATPL Theory">ATPL Theory</option>
            <option value="IFR Procedures">IFR Procedures</option>
            <option value="MCC/JOC">MCC/JOC</option>
            <option value="Sim Check Prep">Sim Check Prep</option>
            <option value="Cabin Crew Interview Prep">Cabin Crew Interview Prep</option>
            <option value="Safety & Emergency">Safety & Emergency</option>
            <option value="ATC Phraseology">ATC Phraseology</option>
            <option value="Maintenance & Engineering">Maintenance & Engineering</option>
            <option value="Dispatch & Operations">Dispatch & Operations</option>
            <option value="Aviation English">Aviation English</option>
          </select>
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : classes.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-navy-700 mb-4">No classes found.</p>
            <p className="text-sm text-navy-600 mb-4">Try adjusting your filters or check back later.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => {
              const seatsLeft = getSeatsLeft(classItem);
              return (
                <Card key={classItem.id} hover className="flex flex-col">
                  <div className="mb-4">
                    {classItem.category && (
                      <Badge variant="info" className="mb-2">
                        {classItem.category}
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{classItem.title}</h3>
                    <p className="text-navy-700 text-sm mb-4 line-clamp-3">{classItem.description}</p>
                    <div className="space-y-2 text-sm text-navy-600">
                      {classItem.tutor?.user && (
                        <p>
                          <span className="font-semibold">Instructor:</span>{' '}
                          {classItem.tutor.user.firstName} {classItem.tutor.user.lastName}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Date/Time:</span>{' '}
                        {format(parseISO(classItem.scheduledAt), 'MMM d, yyyy h:mm a')}
                      </p>
                      <p>
                        <span className="font-semibold">Duration:</span> {classItem.durationMinutes} minutes
                      </p>
                      {classItem.language && (
                        <p>
                          <span className="font-semibold">Language:</span> {classItem.language}
                        </p>
                      )}
                      {classItem.aircraftType && (
                        <p>
                          <span className="font-semibold">Aircraft:</span> {classItem.aircraftType}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-navy-600">Price per student</p>
                        <p className="text-2xl font-bold text-sky-blue-600">
                          ${Number(classItem.pricePerStudent).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-navy-600">Seats left</p>
                        <p className={`text-lg font-semibold ${seatsLeft > 0 ? 'text-navy-900' : 'text-red-600'}`}>
                          {seatsLeft} / {classItem.maxStudents}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => router.push(`/group-classes/${classItem.id}`)}
                      disabled={seatsLeft === 0}
                    >
                      {seatsLeft > 0 ? 'View Details' : 'Class Full'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-sky-blue-50 border-sky-blue-200">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Want to teach a group class?</h2>
            <p className="text-navy-700 mb-6">Share your expertise with multiple students at once</p>
            <Link href="/register/tutor">
              <Button variant="primary">Become an Instructor</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
