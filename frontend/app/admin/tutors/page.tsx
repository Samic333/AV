'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTutors();
  }, [filter]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/tutors');
      const data = response.data.data || response.data;
      let tutorsList = Array.isArray(data) ? data : [];
      
      if (filter !== 'all') {
        tutorsList = tutorsList.filter((t: any) => t.status === filter);
      }
      
      setTutors(tutorsList);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (tutorId: string) => {
    try {
      await api.put(`/admin/tutors/${tutorId}/approve`);
      fetchTutors();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve tutor');
    }
  };

  const handleReject = async (tutorId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await api.put(`/admin/tutors/${tutorId}/reject`, { reason });
      fetchTutors();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject tutor');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Tutors</h1>
          <p className="text-navy-600">Manage tutor applications and profiles</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending Approval
          </Button>
          <Button
            variant={filter === 'approved' ? 'primary' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'rejected' ? 'primary' : 'outline'}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : tutors.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-lg text-navy-600 mb-2">No tutors found</p>
            <p className="text-sm text-navy-500">Tutor applications will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {tutors.map((tutor) => (
              <Card key={tutor.id}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-1">
                      {tutor.user?.firstName} {tutor.user?.lastName}
                    </h3>
                    <p className="text-navy-600 text-sm mb-2">{tutor.user?.email}</p>
                    <div className="flex items-center gap-4 text-sm text-navy-600">
                      <span>💰 ${Number(tutor.hourlyRate || 0).toFixed(2)}/hour</span>
                      {tutor.createdAt && (
                        <span>📅 Joined {format(parseISO(tutor.createdAt), 'MMM d, yyyy')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        tutor.status === 'approved'
                          ? 'success'
                          : tutor.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {tutor.status}
                    </Badge>
                    {tutor.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(tutor.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(tutor.id)}
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

