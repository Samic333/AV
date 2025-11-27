'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  booking?: {
    id: string;
    lessonType?: string;
    scheduledAt: string;
    tutor?: {
      user?: {
        firstName: string;
        lastName: string;
      };
    };
  };
  classEnrollmentId?: string;
}

export default function StudentPaymentsPage() {
  const router = useRouter();
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
  const pendingPayments = paymentTransactions.filter((t) => t.status === 'pending');

  return (
    <div className="min-h-screen bg-sky-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Payments</h1>
          <p className="text-navy-600">View your payment history and invoices</p>
        </div>

        {/* Pending Payments Alert */}
        {pendingPayments.length > 0 && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">
                  {pendingPayments.length} Pending Payment{pendingPayments.length > 1 ? 's' : ''}
                </h3>
                <p className="text-navy-700 text-sm">
                  You have {pendingPayments.length} payment{pendingPayments.length > 1 ? 's' : ''} waiting to be completed.
                </p>
              </div>
              <Button variant="primary" onClick={() => window.location.href = '/student/payments#pending'}>
                Complete Payment
              </Button>
            </div>
          </Card>
        )}

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
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Payment History</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
              </div>
            ) : paymentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-navy-600 mb-4">No payment history yet</p>
                <Link href="/tutors">
                  <Button variant="outline">Find Instructor</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentTransactions.map((transaction) => {
                  const instructorName = transaction.booking?.tutor?.user
                    ? `${transaction.booking.tutor.user.firstName} ${transaction.booking.tutor.user.lastName}`
                    : 'N/A';
                  const lessonType = transaction.booking?.lessonType || 'Lesson';
                  const lessonDate = transaction.booking?.scheduledAt
                    ? format(parseISO(transaction.booking.scheduledAt), 'MMM d, yyyy')
                    : null;

                  return (
                    <div key={transaction.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-navy-900 mb-1">
                            {transaction.description || lessonType}
                          </p>
                          <div className="space-y-1 text-sm text-navy-600">
                            {instructorName !== 'N/A' && (
                              <p>Instructor: {instructorName}</p>
                            )}
                            {lessonDate && <p>Date: {lessonDate}</p>}
                            <p>Payment Date: {format(parseISO(transaction.createdAt), 'MMM d, yyyy h:mm a')}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-navy-900 text-lg">
                            ${Number(transaction.amount).toFixed(2)}
                          </p>
                          <Badge variant={getStatusBadgeVariant(transaction.status)} className="mt-1">
                            {transaction.status}
                          </Badge>
                          {transaction.status === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                router.push(`/student/payments?complete=${transaction.id}`);
                              }}
                            >
                              Complete Payment
                            </Button>
                          )}
                          {transaction.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                router.push(`/student/payments?retry=${transaction.id}`);
                              }}
                            >
                              Retry Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
      </div>
    </div>
  );
}

