'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users?role=student');
      const data = response.data.data || response.data;
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchStudents();
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/search?q=${encodeURIComponent(searchQuery)}&role=student`);
      const data = response.data.data || response.data;
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to search students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = searchQuery
    ? students.filter(
        (s) =>
          s.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Students</h1>
          <p className="text-navy-600">Manage student accounts and activity</p>
        </div>

        <Card className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name or email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-navy-600">No students found</p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Country</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-navy-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-3 px-4 text-navy-600">{student.email}</td>
                      <td className="py-3 px-4 text-navy-600">{student.country || 'N/A'}</td>
                      <td className="py-3 px-4 text-navy-600">
                        {student.createdAt
                          ? format(parseISO(student.createdAt), 'MMM d, yyyy')
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {student.deletedAt ? (
                          <Badge variant="error">Suspended</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

