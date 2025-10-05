import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: statsLoading } = useQuery(
    'admin-stats',
    async () => {
      const [usersResult, rfqsResult, quotesResult, categoriesResult] = await Promise.all([
        supabase.from('users').select('id, user_type, is_verified, created_at'),
        supabase.from('rfqs').select('id, status, created_at'),
        supabase.from('quotes').select('id, status, created_at'),
        supabase.from('categories').select('id, is_active')
      ]);

      const users = usersResult.data || [];
      const rfqs = rfqsResult.data || [];
      const quotes = quotesResult.data || [];
      const categories = categoriesResult.data || [];

      return {
        totalUsers: users.length,
        totalBuyers: users.filter(u => u.user_type === 'buyer').length,
        totalVendors: users.filter(u => u.user_type === 'vendor').length,
        verifiedUsers: users.filter(u => u.is_verified).length,
        totalRFQs: rfqs.length,
        openRFQs: rfqs.filter(r => r.status === 'open').length,
        awardedRFQs: rfqs.filter(r => r.status === 'awarded').length,
        totalQuotes: quotes.length,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length,
        acceptedQuotes: quotes.filter(q => q.status === 'accepted').length,
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.is_active).length,
        recentUsers: users.slice(-5),
        recentRFQs: rfqs.slice(-5),
        recentQuotes: quotes.slice(-5)
      };
    }
  );

  const { data: recentUsers } = useQuery(
    'recent-users',
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    { enabled: !!user && user.user_type === 'admin' }
  );

  const { data: recentRFQs } = useQuery(
    'recent-rfqs',
    async () => {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          buyer:users!rfqs_buyer_id_fkey (
            first_name,
            last_name,
            company_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    { enabled: !!user && user.user_type === 'admin' }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Check if user is admin
  if (user?.user_type !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (statsLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Souqote Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'rfqs', label: 'RFQs' },
              { id: 'categories', label: 'Categories' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {stats?.totalBuyers || 0} buyers • {stats?.totalVendors || 0} vendors
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {stats?.verifiedUsers || 0} verified
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
                <div className="text-2xl font-bold text-green-600">{stats?.totalRFQs || 0}</div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {stats?.openRFQs || 0} open • {stats?.awardedRFQs || 0} awarded
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <div className="text-2xl font-bold text-purple-600">{stats?.totalQuotes || 0}</div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {stats?.pendingQuotes || 0} pending • {stats?.acceptedQuotes || 0} accepted
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <div className="text-2xl font-bold text-orange-600">{stats?.totalCategories || 0}</div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500">
                  {stats?.activeCategories || 0} active
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers?.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          user.user_type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                          user.user_type === 'vendor' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }>
                          {user.user_type}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent RFQs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRFQs?.slice(0, 5).map((rfq) => (
                    <div key={rfq.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">{rfq.title}</p>
                        <p className="text-xs text-gray-500">
                          by {rfq.buyer?.first_name} {rfq.buyer?.last_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          rfq.status === 'open' ? 'bg-green-100 text-green-800' :
                          rfq.status === 'awarded' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {rfq.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(rfq.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {user.first_name[0]}{user.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.company_name && (
                        <p className="text-sm text-gray-500">{user.company_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={
                      user.user_type === 'buyer' ? 'bg-blue-100 text-blue-800' :
                      user.user_type === 'vendor' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {user.user_type}
                    </Badge>
                    <Badge className={
                      user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }>
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Joined {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFQs Tab */}
      {activeTab === 'rfqs' && (
        <Card>
          <CardHeader>
            <CardTitle>RFQ Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRFQs?.map((rfq) => (
                <div key={rfq.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{rfq.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{rfq.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Category: {rfq.category}</span>
                      <span>Location: {rfq.location}</span>
                      {rfq.budget_min && rfq.budget_max && (
                        <span>Budget: {formatCurrency(rfq.budget_min)} - {formatCurrency(rfq.budget_max)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={
                      rfq.status === 'open' ? 'bg-green-100 text-green-800' :
                      rfq.status === 'awarded' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {rfq.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        by {rfq.buyer?.first_name} {rfq.buyer?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(rfq.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle>Category Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Category management features coming soon...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
