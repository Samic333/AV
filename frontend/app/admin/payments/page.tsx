'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalVolume: 0,
    pendingPayouts: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/payments/transactions');
      const data = response.data.data || response.data;
      setTransactions(Array.isArray(data) ? data : []);

      // Calculate stats
      const payments = Array.isArray(data) ? data.filter((t: any) => t.type === 'payment') : [];
      const totalRevenue = payments.reduce(
        (sum: number, t: any) => sum + Number(t.platformFee || 0),
        0
      );
      const totalVolume = payments.reduce(
        (sum: number, t: any) => sum + Number(t.amount || 0),
        0
      );

      setStats({
        totalRevenue,
        totalVolume,
        pendingPayouts: 0, // Would need separate endpoint
      });
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { variant: 'success', label: 'Completed' },
      pending: { variant: 'warning', label: 'Pending' },
      failed: { variant: 'danger', label: 'Failed' },
      refunded: { variant: 'info', label: 'Refunded' },
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Payments</h1>
          <p className="text-navy-600">Overview of transactions, tutor payouts, and platform revenue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-navy-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              {loading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">Platform fees</p>
          </Card>
          <Card>
            <p className="text-sm text-navy-600 mb-1">Transaction Volume</p>
            <p className="text-3xl font-bold text-navy-900">
              {loading ? '...' : `$${stats.totalVolume.toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">Total processed</p>
          </Card>
          <Card>
            <p className="text-sm text-navy-600 mb-1">Pending Payouts</p>
            <p className="text-3xl font-bold text-yellow-600">
              {loading ? '...' : `$${stats.pendingPayouts.toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">Awaiting processing</p>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-navy-900">All Transactions</h2>
            <Button variant="outline" size="sm">Export CSV</Button>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-navy-600">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Platform Fee</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 50).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-navy-600">
                        {format(parseISO(transaction.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-navy-900">
                        {transaction.user
                          ? `${transaction.user.firstName} ${transaction.user.lastName}`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-navy-600">{transaction.type}</td>
                      <td className="py-3 px-4 font-semibold text-navy-900">
                        ${Number(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-navy-600">
                        ${Number(transaction.platformFee || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(transaction.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

