import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Ban, 
  Trash2, 
  RotateCcw,
  Eye,
  Calendar,
  Mail,
  Phone,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: 'buyer' | 'vendor' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'blocked' | 'deleted';
  is_deleted: boolean;
  created_at: string;
  status_updated_at: string;
  admin_notes?: string;
  vendor_profile?: {
    company_name_english: string;
    verification_status: string;
  };
}

interface UserAction {
  id: string;
  action_type: string;
  previous_status: string;
  new_status: string;
  notes: string;
  created_at: string;
  admin: {
    first_name: string;
    last_name: string;
  };
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [adminNotes, setAdminNotes] = useState('');
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading, refetch } = useQuery(
    ['admin-users', statusFilter, userTypeFilter],
    async () => {
      let query = supabase
        .from('users')
        .select(`
          *,
          vendor_profile:vendor_profiles(company_name_english, verification_status)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (userTypeFilter !== 'all') {
        query = query.eq('user_type', userTypeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as User[];
    }
  );

  // Filter users based on search term
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.vendor_profile?.company_name_english?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // User action mutation
  const userActionMutation = useMutation(
    async ({ userId, action, notes }: { userId: string; action: string; notes?: string }) => {
      const { error } = await supabase.rpc('log_user_action', {
        p_user_id: userId,
        p_action_type: action,
        p_notes: notes || null
      });
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
        toast.success('User status updated successfully');
        setShowUserDetails(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update user status');
      }
    }
  );

  // Fetch user actions for details modal
  const fetchUserActions = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_actions')
      .select(`
        *,
        admin:users!user_actions_admin_id_fkey(first_name, last_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setUserActions(data || []);
  };

  const handleUserAction = (userId: string, action: string) => {
    const actionMessages = {
      approve: 'Are you sure you want to approve this user?',
      reject: 'Are you sure you want to reject this user?',
      block: 'Are you sure you want to block this user?',
      unblock: 'Are you sure you want to unblock this user?',
      delete: 'Are you sure you want to delete this user? This is a soft delete.',
      restore: 'Are you sure you want to restore this user?'
    };

    if (window.confirm(actionMessages[action as keyof typeof actionMessages])) {
      userActionMutation.mutate({ userId, action, notes: adminNotes });
    }
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setAdminNotes(user.admin_notes || '');
    setShowUserDetails(true);
    fetchUserActions(user.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-orange-100 text-orange-800';
      case 'deleted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'blocked': return <Ban className="w-4 h-4" />;
      case 'deleted': return <Trash2 className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all users, approve, reject, block, or delete accounts</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="blocked">Blocked</option>
                  <option value="deleted">Deleted</option>
                </select>

                {/* User Type Filter */}
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="buyer">Buyers</option>
                  <option value="vendor">Vendors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Users ({filteredUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={
                          user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.user_type === 'vendor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(user.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(user.status)}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.vendor_profile?.company_name_english || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUserDetails(user)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {user.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleUserAction(user.id, 'approve')}
                                disabled={userActionMutation.isLoading}
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleUserAction(user.id, 'reject')}
                                disabled={userActionMutation.isLoading}
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {user.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700"
                              onClick={() => handleUserAction(user.id, 'block')}
                              disabled={userActionMutation.isLoading}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Block
                            </Button>
                          )}
                          {user.status === 'blocked' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleUserAction(user.id, 'unblock')}
                              disabled={userActionMutation.isLoading}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Unblock
                            </Button>
                          )}
                          {user.status !== 'deleted' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleUserAction(user.id, 'delete')}
                              disabled={userActionMutation.isLoading}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                          {user.status === 'deleted' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleUserAction(user.id, 'restore')}
                              disabled={userActionMutation.isLoading}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowUserDetails(false)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* User Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedUser.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User Type</p>
                        <Badge className={
                          selectedUser.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
                          selectedUser.user_type === 'vendor' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {selectedUser.user_type.charAt(0).toUpperCase() + selectedUser.user_type.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <Badge className={getStatusColor(selectedUser.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(selectedUser.status)}
                            <span className="capitalize">{selectedUser.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registered</p>
                        <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                      </div>
                      {selectedUser.status_updated_at && (
                        <div>
                          <p className="text-sm text-gray-500">Last Status Update</p>
                          <p className="font-medium">{formatDate(selectedUser.status_updated_at)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Company Information (for vendors) */}
                  {selectedUser.user_type === 'vendor' && selectedUser.vendor_profile && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Company Name</p>
                          <p className="font-medium">{selectedUser.vendor_profile.company_name_english}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Verification Status</p>
                          <Badge className={getStatusColor(selectedUser.vendor_profile.verification_status)}>
                            {selectedUser.vendor_profile.verification_status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Admin Notes */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Admin Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes about this user..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Action History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Action History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userActions.map((action) => (
                        <div key={action.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <Badge className={getStatusColor(action.new_status)}>
                              {action.action_type}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Changed from {action.previous_status} to {action.new_status}
                            </p>
                            {action.notes && (
                              <p className="text-sm text-gray-600">{action.notes}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              By {action.admin.first_name} {action.admin.last_name} on {formatDate(action.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
