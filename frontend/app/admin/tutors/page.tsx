'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminTutorsPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutors</h1>
              <p className="text-gray-600">Manage tutor applications and profiles</p>
            </div>

            <div className="mb-6 flex gap-4">
              <Button variant="outline" className="bg-white">All</Button>
              <Button variant="outline">Pending Approval</Button>
              <Button variant="outline">Approved</Button>
              <Button variant="outline">Rejected</Button>
            </div>

            <div className="space-y-4">
              {/* Placeholder for tutors */}
              <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      John Doe
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">john.doe@example.com</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>💰 $50/hour</span>
                      <span>📅 Joined Dec 1, 2024</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="warning">Pending</Badge>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">Approve</Button>
                      <Button variant="danger" size="sm">Reject</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="text-center py-12">
                <p className="text-lg text-gray-600 mb-2">No tutors found</p>
                <p className="text-sm text-gray-500">Tutor applications will appear here</p>
              </Card>
            </div>
          </div>
      </div>
    </div>
  );
}


