'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    country: '',
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchAllUsers();
  }, [filters]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.country) params.append('country', filters.country);
      
      const response = await api.get(`/admin/users?${params.toString()}`);
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchAllUsers();
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    try {
      await api.post(`/admin/users/bulk-action`, {
        userIds: selectedUsers,
        action,
      });
      setSelectedUsers([]);
      fetchAllUsers();
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">User Management</h1>
          <p className="text-navy-600">Search and manage platform users</p>
        </div>

        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by name or email..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
              />
              <Button variant="primary" onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="tutor">Instructors</option>
                <option value="admin">Admins</option>
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <input
                type="text"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                placeholder="Filter by country..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-navy-600">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('suspend')}>
                  Suspend Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('activate')}>
                  Activate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        </Card>

        {loading ? (
          <Card className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </Card>
        ) : users.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(users.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Country</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-navy-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 px-4 text-navy-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'tutor' ? 'info' : 'default'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-navy-600">{user.country || 'N/A'}</td>
                      <td className="py-3 px-4">
                        {user.deletedAt ? (
                          <Badge variant="danger">Suspended</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <p className="text-navy-600">No users found</p>
          </Card>
        )}
      </div>
    </div>
  );
}

