'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Mock conversations - structure ready for API integration
interface Conversation {
  id: string;
  studentName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    studentName: 'Jane Smith',
    lastMessage: 'Thanks for the lesson today!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
  },
];

export default function TutorMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const conversations = mockConversations; // TODO: Replace with API call

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="tutor" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Chat with your students</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conv.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{conv.studentName}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-aviation-blue text-white text-xs rounded-full px-2 py-0.5">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">{conv.lastMessageTime}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {conversations.find((c) => c.id === selectedConversation)?.studentName}
                      </h3>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">
                          Message functionality coming soon. This will connect to the messages API.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

