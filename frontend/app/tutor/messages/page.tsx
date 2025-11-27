'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TutorMessagesPage() {
  return (
    <AuthGuard requiredRole="tutor">
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
                  <div className="space-y-2">
                    {/* Placeholder for conversations */}
                    <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                      <p className="font-medium text-gray-900">Jane Smith</p>
                      <p className="text-sm text-gray-600 truncate">Thanks for the lesson...</p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Select a conversation</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Select a conversation to start messaging</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

