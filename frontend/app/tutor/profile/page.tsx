'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth-store';

export default function TutorProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: '',
  });

  return (
    <AuthGuard requiredRole="tutor">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="tutor" />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Verification</h1>
              <p className="text-gray-600">Manage your tutor profile and verification status</p>
            </div>

            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Verification Status</h2>
                <Badge variant="warning">Pending</Badge>
              </div>
              <p className="text-gray-600 text-sm">
                Your profile is under review. We'll notify you once it's approved.
              </p>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    placeholder="Tell students about your aviation experience, qualifications, and teaching style..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    placeholder="50.00"
                  />
                </div>

                <div className="flex gap-4">
                  <Button variant="primary">Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

