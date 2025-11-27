'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function ExamPrepPage() {
  const user = useAuthStore((state) => state.user);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    examType: '',
    description: '',
    budget: '',
    preferredSchedule: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/exam-prep/requests');
      const data = response.data.data || response.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch exam prep requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!user) {
      alert('Please log in to create a request');
      return;
    }

    try {
      await api.post('/exam-prep/requests', {
        examType: newRequest.examType,
        description: newRequest.description,
        budget: newRequest.budget ? parseFloat(newRequest.budget) : null,
        preferredSchedule: newRequest.preferredSchedule || null,
      });
      alert('Request created successfully! Instructors can now bid on it.');
      setShowRequestForm(false);
      setNewRequest({ examType: '', description: '', budget: '', preferredSchedule: '' });
      fetchRequests();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create request');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Exam Prep Marketplace</h1>
          <p className="text-xl text-navy-700 max-w-3xl mx-auto">
            Post your exam preparation needs and get competitive bids from qualified instructors
          </p>
        </div>

        {user && user.role === 'student' && (
          <div className="mb-8 text-center">
            <Button variant="primary" onClick={() => setShowRequestForm(!showRequestForm)}>
              {showRequestForm ? 'Cancel' : 'Post Exam Prep Request'}
            </Button>
          </div>
        )}

        {showRequestForm && (
          <Card className="mb-8 bg-sky-blue-50">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Create Exam Prep Request</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Exam Type *</label>
                <select
                  value={newRequest.examType}
                  onChange={(e) => setNewRequest({ ...newRequest, examType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select exam type</option>
                  <option value="ATPL Module 1">ATPL Module 1</option>
                  <option value="ATPL Module 2">ATPL Module 2</option>
                  <option value="EASA Test">EASA Test</option>
                  <option value="ICAO English">ICAO English</option>
                  <option value="IFR Recurrent">IFR Recurrent</option>
                  <option value="Sim Check">Sim Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  placeholder="Describe what you need help with..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Budget (USD)</label>
                  <input
                    type="number"
                    value={newRequest.budget}
                    onChange={(e) => setNewRequest({ ...newRequest, budget: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">Preferred Schedule</label>
                  <input
                    type="text"
                    value={newRequest.preferredSchedule}
                    onChange={(e) => setNewRequest({ ...newRequest, preferredSchedule: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Weekends, Evenings"
                  />
                </div>
              </div>
              <Button variant="primary" onClick={handleCreateRequest}>
                Post Request
              </Button>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-navy-700 mb-4">No exam prep requests yet.</p>
            {user && user.role === 'student' && (
              <Button variant="primary" onClick={() => setShowRequestForm(true)}>
                Be the First to Post
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} hover>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Badge variant="info" className="mb-2">{request.examType}</Badge>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">
                      {request.examType} Preparation Request
                    </h3>
                    <p className="text-navy-700 mb-4">{request.description}</p>
                    <div className="flex gap-4 text-sm text-navy-600">
                      {request.budget && (
                        <span>Budget: ${Number(request.budget).toFixed(2)}</span>
                      )}
                      {request.preferredSchedule && (
                        <span>Schedule: {request.preferredSchedule}</span>
                      )}
                      <span>Posted: {format(parseISO(request.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <Badge variant={request.status === 'open' ? 'success' : 'default'}>
                    {request.status}
                  </Badge>
                </div>
                {request.bids && request.bids.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-navy-700 mb-2">
                      {request.bids.length} Bid{request.bids.length > 1 ? 's' : ''}
                    </p>
                    {request.bids.slice(0, 3).map((bid: any) => (
                      <div key={bid.id} className="bg-sky-blue-50 p-3 rounded mb-2">
                        <p className="font-semibold text-navy-900">${Number(bid.price).toFixed(2)}</p>
                        {bid.message && <p className="text-sm text-navy-700">{bid.message}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {user && user.role === 'tutor' && request.status === 'open' && (
                  <Button variant="outline" className="mt-4">
                    Place Bid
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

