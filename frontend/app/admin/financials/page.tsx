'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

export default function AdminFinancialsPage() {
  const [stats, setStats] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, [viewMode, selectedPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('view', viewMode);
      if (viewMode === 'monthly') {
        params.append('period', selectedPeriod);
      } else {
        params.append('year', selectedPeriod.split('-')[0]);
      }
      
      const [statsResponse, expensesResponse, transactionsResponse] = await Promise.all([
        api.get(`/admin/financials/summary?${params.toString()}`),
        api.get(`/admin/financials/expenses?${params.toString()}`),
        api.get(`/admin/payments/transactions?${params.toString()}`),
      ]);
      
      setStats(statsResponse.data.data || statsResponse.data);
      setExpenses(expensesResponse.data.data || expensesResponse.data || []);
      setTransactions(transactionsResponse.data.data || transactionsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      await api.post('/admin/financials/expenses', {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
      });
      alert('Expense added successfully');
      setShowAddExpense(false);
      setNewExpense({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 mb-2">Financial Management</h1>
            <p className="text-navy-600">View revenue, expenses, and profit</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddExpense(!showAddExpense)}>
            {showAddExpense ? 'Cancel' : 'Add Expense'}
          </Button>
        </div>

        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'monthly' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={viewMode === 'yearly' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('yearly')}
              >
                Yearly
              </Button>
            </div>
            {viewMode === 'monthly' ? (
              <input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <input
                type="number"
                value={selectedPeriod.split('-')[0]}
                onChange={(e) => setSelectedPeriod(`${e.target.value}-01`)}
                min="2020"
                max={new Date().getFullYear()}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none w-32"
                placeholder="Year"
              />
            )}
          </div>
        </Card>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <p className="text-sm text-navy-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              {loading ? '...' : `$${(stats?.totalRevenue || 0).toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">Platform fees</p>
          </Card>
          <Card>
            <p className="text-sm text-navy-600 mb-1">Transaction Volume</p>
            <p className="text-3xl font-bold text-navy-900">
              {loading ? '...' : `$${(stats?.totalTransactionVolume || 0).toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">Total transactions</p>
          </Card>
          <Card>
            <p className="text-sm text-navy-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">
              {loading ? '...' : `$${(stats?.totalExpenses || 0).toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">All expenses</p>
          </Card>
          <Card>
            <p className="text-sm text-navy-600 mb-1">Profit</p>
            <p className={`text-3xl font-bold ${(stats?.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? '...' : `$${(stats?.profit || 0).toFixed(2)}`}
            </p>
            <p className="text-xs text-navy-500 mt-1">Revenue - Expenses</p>
          </Card>
        </div>

        {/* Finance Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Revenue Breakdown</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-navy-600">Chart visualization - Coming soon</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Expenses by Category</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-navy-600">Chart visualization - Coming soon</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Profit Trends</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-navy-600">Line chart - Coming soon</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Payouts Tracking</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-navy-600">Chart visualization - Coming soon</p>
            </div>
          </Card>
        </div>

        {/* Transaction List */}
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-navy-900">Transactions</h2>
            <Button variant="outline" size="sm">Export CSV</Button>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-navy-600">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 20).map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-navy-600">
                        {format(parseISO(transaction.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-navy-900">{transaction.description || 'Transaction'}</td>
                      <td className="py-3 px-4 text-navy-600">{transaction.type}</td>
                      <td className="py-3 px-4 font-semibold text-navy-900">
                        ${Number(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Add Expense Form */}
        {showAddExpense && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Add Expense</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Server costs, Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Amount (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Infrastructure, Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button variant="primary" onClick={handleAddExpense}>
                Add Expense
              </Button>
            </div>
          </Card>
        )}

        {/* Expenses List */}
        <Card>
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Expenses</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-navy-600">No expenses recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0">
                  <div>
                    <p className="font-semibold text-navy-900">{expense.description}</p>
                    {expense.category && (
                      <p className="text-sm text-navy-600">Category: {expense.category}</p>
                    )}
                    <p className="text-sm text-navy-500">
                      {format(parseISO(expense.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-red-600">
                    ${Number(expense.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

