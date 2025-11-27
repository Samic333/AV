'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminMessagingPage() {
  const [target, setTarget] = useState<'all' | 'students' | 'instructors' | 'specific'>('all');
  const [specificUserId, setSpecificUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    if (target === 'specific' && !specificUserId.trim()) {
      alert('Please enter a user ID');
      return;
    }

    try {
      setSending(true);
      const recipient = target === 'specific' ? specificUserId : target;
      await api.post('/admin/announcements', {
        target: recipient,
        title,
        message,
      });
      alert('Announcement sent successfully!');
      setTitle('');
      setMessage('');
      setSpecificUserId('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Send Announcement</h1>
          <p className="text-navy-600">Send messages to users on the platform</p>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Users</option>
                <option value="students">All Students</option>
                <option value="instructors">All Instructors</option>
                <option value="specific">Specific User (by ID)</option>
              </select>
            </div>

            {target === 'specific' && (
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={specificUserId}
                  onChange={(e) => setSpecificUserId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter user ID"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                placeholder="Announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-2">Message *</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your announcement message..."
              />
            </div>

            <Button variant="primary" onClick={handleSend} disabled={sending} className="w-full">
              {sending ? 'Sending...' : 'Send Announcement'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

