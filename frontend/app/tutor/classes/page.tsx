'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function TutorClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchClasses();
  }, [statusFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/classes');
      const responseData = response.data.data || response.data;
      let classesList = Array.isArray(responseData) ? responseData : [];
      
      if (statusFilter !== 'all') {
        classesList = classesList.filter((c: any) => c.status === statusFilter);
      }
      
      setClasses(classesList);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (classId: string) => {
    if (!confirm('Are you sure you want to cancel this class?')) {
      return;
    }

    try {
      await api.delete(`/tutor/classes/${classId}`);
      fetchClasses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel class');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending_approval: { variant: 'warning', label: 'Pending Approval' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'error', label: 'Rejected' },
      completed: { variant: 'info', label: 'Completed' },
      cancelled: { variant: 'error', label: 'Cancelled' },
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-navy-900 mb-2">Group Classes</h1>
                <p className="text-navy-600">Manage your group classes</p>
              </div>
              <Link href="/tutor/classes/new">
                <Button variant="primary">Create New Class</Button>
              </Link>
            </div>

            <div className="mb-6 flex gap-4">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending_approval' ? 'primary' : 'outline'}
                onClick={() => setStatusFilter('pending_approval')}
              >
                Pending Approval
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'primary' : 'outline'}
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'primary' : 'outline'}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
              </div>
            ) : classes.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-navy-700 mb-4">No group classes found.</p>
                <Link href="/tutor/classes/new">
                  <Button variant="primary">Create Your First Class</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                  <Card key={classItem.id} hover className="flex flex-col">
                    <div className="mb-4">
                      {classItem.category && (
                        <Badge variant="info" className="mb-2">
                          {classItem.category}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold text-navy-900 mb-2">{classItem.title}</h3>
                      <p className="text-navy-700 text-sm mb-4 line-clamp-3">{classItem.description}</p>
                      <div className="space-y-1 text-sm text-navy-600">
                        <p>
                          <span className="font-semibold">Date:</span>{' '}
                          {format(parseISO(classItem.scheduledAt), 'MMM d, yyyy h:mm a')}
                        </p>
                        <p>
                          <span className="font-semibold">Duration:</span> {classItem.durationMinutes} min
                        </p>
                        <p>
                          <span className="font-semibold">Students:</span> {classItem.currentStudents} / {classItem.maxStudents}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-sm text-navy-600">Price per student</p>
                          <p className="text-xl font-bold text-sky-blue-600">
                            ${Number(classItem.pricePerStudent).toFixed(2)}
                          </p>
                        </div>
                        {getStatusBadge(classItem.status)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => router.push(`/tutor/classes/${classItem.id}`)}
                        >
                          View Details
                        </Button>
                        {classItem.status !== 'completed' && classItem.status !== 'cancelled' && (
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleCancel(classItem.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
      </div>
    </div>
  );
}
