'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      const data = response.data.data || response.data;
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Admin Dashboard</h1>
          <p className="text-navy-600">Manage the AviatorTutor platform and community</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : stats?.totalUsers || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Registered Instructors</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : stats?.totalTutors || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Registered Students</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : stats?.totalStudents || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🎓</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : stats?.totalBookings || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : `$${(stats?.totalRevenue || 0).toFixed(2)}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Transaction Volume</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : `$${(stats?.totalTransactionVolume || 0).toFixed(2)}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-navy-900">
                  {loading ? '...' : `$${(stats?.totalExpenses || 0).toFixed(2)}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📉</span>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-600 mb-1">Profit</p>
                <p className={`text-3xl font-bold ${(stats?.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {loading ? '...' : `$${(stats?.profit || 0).toFixed(2)}`}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </Card>
        </div>

        {/* User Distribution by Country */}
        {stats?.usersByCountry && stats.usersByCountry.length > 0 && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">User Distribution by Country</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Country</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Total Users</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Students</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Instructors</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.usersByCountry.map((item: any) => (
                    <tr key={item.country} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-navy-900">{item.country}</td>
                      <td className="py-3 px-4 text-navy-600">{item.count}</td>
                      <td className="py-3 px-4 text-navy-600">{item.students || 'N/A'}</td>
                      <td className="py-3 px-4 text-navy-600">{item.instructors || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hover>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-sky-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">Pending Instructors</h3>
                <p className="text-sm text-navy-600">
                  {loading ? '...' : `${stats?.pendingTutors || 0} pending approval`}
                </p>
              </div>
            </div>
            <Link href="/admin/tutors">
              <Button variant="outline" className="w-full">Review Applications</Button>
            </Link>
          </Card>

          <Card hover>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-aviation-amber rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">All Bookings</h3>
                <p className="text-sm text-navy-600">View and manage bookings</p>
              </div>
            </div>
            <Link href="/admin/bookings">
              <Button variant="primary" className="w-full">View Bookings</Button>
            </Link>
          </Card>

          <Card hover>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-aviation-teal rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">Financials</h3>
                <p className="text-sm text-navy-600">Manage expenses and view financials</p>
              </div>
            </div>
            <Link href="/admin/financials">
              <Button variant="outline" className="w-full">View Financials</Button>
            </Link>
          </Card>

          <Card hover>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">User Management</h3>
                <p className="text-sm text-navy-600">Search and manage users</p>
              </div>
            </div>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">Manage Users</Button>
            </Link>
          </Card>

          <Card hover>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📢</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">Send Announcement</h3>
                <p className="text-sm text-navy-600">Send messages to users</p>
              </div>
            </div>
            <Link href="/admin/messaging">
              <Button variant="outline" className="w-full">Send Announcement</Button>
            </Link>
          </Card>

          <Card hover>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">Flagged Messages</h3>
                <p className="text-sm text-navy-600">Review flagged conversations</p>
              </div>
            </div>
            <Link href="/admin/messages/flagged">
              <Button variant="outline" className="w-full">View Flagged</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
