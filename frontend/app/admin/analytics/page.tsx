'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/analytics?days=${dateRange}`);
      const data = response.data.data || response.data;
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Analytics Dashboard</h1>
          <p className="text-navy-600">Platform usage and user analytics</p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-navy-700">Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </Card>

        {loading ? (
          <Card className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">User Locations</h2>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-navy-600">World map visualization - Coming soon</p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">User Signups Over Time</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-navy-600">Line chart - Coming soon</p>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Bookings Over Time</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-navy-600">Bar chart - Coming soon</p>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Revenue Trends</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-navy-600">Line chart - Coming soon</p>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-navy-900 mb-4">Users by Country</h2>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-navy-600">Pie/Bar chart - Coming soon</p>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Platform Activity Heatmap</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-navy-600">Calendar heatmap - Coming soon</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

