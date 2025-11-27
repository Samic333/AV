'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO, startOfMonth, isWithinInterval } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'payment' | 'payout' | 'refund' | 'commission';
  createdAt: string;
  bookingId?: string;
  description?: string;
}

export default function StudentPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    totalLessons: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/payments/history');
      const data = response.data.data || response.data;
      const transactionsList = Array.isArray(data) ? data : [];
      setTransactions(transactionsList);

      // Calculate stats
      const now = new Date();
      const monthStart = startOfMonth(now);
      const payments = transactionsList.filter((t: Transaction) => t.type === 'payment');
      const totalSpent = payments.reduce(
        (sum: number, t: Transaction) => sum + (t.status === 'completed' ? Number(t.amount) : 0),
        0
      );
      const thisMonth = payments
        .filter((t: Transaction) =>
          isWithinInterval(parseISO(t.createdAt), { start: monthStart, end: now })
        )
        .reduce(
          (sum: number, t: Transaction) => sum + (t.status === 'completed' ? Number(t.amount) : 0),
          0
        );

      setStats({
        totalSpent,
        thisMonth,
        totalLessons: payments.filter((t: Transaction) => t.status === 'completed').length,
      });
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const paymentTransactions = transactions.filter((t) => t.type === 'payment');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="student" />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
            <p className="text-gray-600">View your payment history and invoices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : `$${stats.totalSpent.toFixed(2)}`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : `$${stats.thisMonth.toFixed(2)}`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-600 mb-1">Total Lessons</p>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? '...' : stats.totalLessons}
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aviation-blue mx-auto"></div>
              </div>
            ) : paymentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No payment history yet</p>
                <Link href="/tutors">
                  <Button variant="outline">Browse Tutors</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentTransactions.map((transaction) => (
                  <div key={transaction.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description || 'Lesson Payment'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(transaction.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${Number(transaction.amount).toFixed(2)}
                        </p>
                        <Badge variant={getStatusBadgeVariant(transaction.status)} className="mt-1">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

