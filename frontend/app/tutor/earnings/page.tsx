'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { format, parseISO, startOfMonth, isWithinInterval } from 'date-fns';

interface Wallet {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
}

interface EarningsTransaction {
  id: string;
  bookingId: string;
  amount: number;
  createdAt: string;
  lessonType?: string;
  studentName?: string;
}

export default function TutorEarningsPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [earnings, setEarnings] = useState<EarningsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch wallet
      const walletResponse = await api.get('/tutor/earnings/wallet');
      const walletData = walletResponse.data.data || walletResponse.data;
      setWallet({
        balance: Number(walletData.balance || 0),
        pendingBalance: Number(walletData.pendingBalance || 0),
        totalEarned: Number(walletData.totalEarned || 0),
      });

      // Fetch completed bookings for earnings history
      const bookingsResponse = await api.get('/tutor/bookings');
      const bookingsData = bookingsResponse.data.data || bookingsResponse.data;
      const completedBookings = Array.isArray(bookingsData)
        ? bookingsData.filter((b: any) => b.status === 'completed')
        : [];
      
      const earningsList = completedBookings.map((b: any) => ({
        id: b.id,
        bookingId: b.id,
        amount: Number(b.tutorPayout || 0),
        createdAt: b.completedAt || b.createdAt,
        lessonType: b.lessonType,
        studentName: b.student
          ? `${b.student.firstName} ${b.student.lastName}`
          : 'Student',
      }));
      
      setEarnings(earningsList);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const thisMonthEarnings = earnings.filter((e) => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    return isWithinInterval(parseISO(e.createdAt), { start: monthStart, end: now });
  }).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="tutor" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
            <p className="text-gray-600">View your earnings and request payouts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : `$${(wallet?.totalEarned || 0).toFixed(2)}`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-aviation-blue">
                {isLoading ? '...' : `$${(wallet?.balance || 0).toFixed(2)}`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-1">Pending Payout</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : `$${(wallet?.pendingBalance || 0).toFixed(2)}`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : `$${thisMonthEarnings.toFixed(2)}`}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings History</h2>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aviation-blue mx-auto"></div>
                  </div>
                ) : earnings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No earnings yet</p>
                    <p className="text-sm text-gray-500">Start teaching to earn money!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {earnings.map((earning) => (
                      <div key={earning.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {earning.lessonType || 'Lesson'} - {earning.studentName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(parseISO(earning.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${earning.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">After platform commission</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div>
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Payout</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                  <p className="text-3xl font-bold text-aviation-blue">
                    {isLoading ? '...' : `$${(wallet?.balance || 0).toFixed(2)}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Payouts are processed within 3-5 business days.
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!wallet || wallet.balance <= 0}
                >
                  Request Payout
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

