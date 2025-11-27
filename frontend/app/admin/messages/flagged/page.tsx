'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminFlaggedMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedMessages();
  }, []);

  const fetchFlaggedMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/messages/flagged');
      const data = response.data.data || response.data;
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch flagged messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Flagged Messages</h1>
          <p className="text-navy-600">Review messages that contain contact information</p>
        </div>

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
            </div>
          </Card>
        ) : messages.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-navy-600">No flagged messages</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="border-red-200 bg-red-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">
                      From: {message.sender.firstName} {message.sender.lastName}
                    </h3>
                    <p className="text-sm text-navy-600 mb-1">Email: {message.sender.email}</p>
                    {message.flaggedReason && (
                      <Badge variant="danger" className="mt-2">
                        {message.flaggedReason}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-navy-500">
                    {format(parseISO(message.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-navy-900">{message.content}</p>
                </div>
                {message.conversation && (
                  <div className="text-sm text-navy-600">
                    <p>
                      Conversation between: {message.conversation.participant1.firstName}{' '}
                      {message.conversation.participant1.lastName} and{' '}
                      {message.conversation.participant2.firstName}{' '}
                      {message.conversation.participant2.lastName}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

