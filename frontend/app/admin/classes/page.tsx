'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchClasses();
  }, [filter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/classes');
      const data = response.data.data || response.data;
      let classesList = Array.isArray(data) ? data : [];
      
      if (filter !== 'all') {
        classesList = classesList.filter((c: any) => c.status === filter);
      }
      
      setClasses(classesList);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (classId: string) => {
    try {
      await api.put(`/admin/classes/${classId}/approve`);
      fetchClasses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve class');
    }
  };

  const handleReject = async (classId: string) => {
    try {
      await api.put(`/admin/classes/${classId}/reject`);
      fetchClasses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject class');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending_approval: { variant: 'warning', label: 'Pending Approval' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'danger', label: 'Rejected' },
      completed: { variant: 'info', label: 'Completed' },
      cancelled: { variant: 'error', label: 'Cancelled' },
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Group Classes</h1>
          <p className="text-navy-600">Manage and approve group classes</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending_approval' ? 'primary' : 'outline'}
            onClick={() => setFilter('pending_approval')}
          >
            Pending Approval
          </Button>
          <Button
            variant={filter === 'approved' ? 'primary' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : classes.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-navy-600">No classes found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <Card key={classItem.id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy-900 mb-1">
                      {classItem.title}
                    </h3>
                    <p className="text-navy-600 text-sm mb-2 line-clamp-2">
                      {classItem.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600">
                      {classItem.category && (
                        <Badge variant="info">{classItem.category}</Badge>
                      )}
                      <span>
                        📅 {format(parseISO(classItem.scheduledAt), 'MMM d, yyyy h:mm a')}
                      </span>
                      <span>👥 {classItem.currentStudents || 0} / {classItem.maxStudents}</span>
                      <span>💰 ${Number(classItem.pricePerStudent).toFixed(2)}/student</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(classItem.status)}
                    {classItem.status === 'pending_approval' && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(classItem.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(classItem.id)}
                        >
                          Reject
                        </Button>
                      </div>
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

