import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Settings, 
  Building, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Shield
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const queryClient = useQueryClient();

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

  // Fetch vendor profiles for verification
  const { data: vendorProfiles, isLoading: vendorProfilesLoading } = useQuery(
    'vendor-profiles',
    async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          user:users!vendor_profiles_user_id_fkey (
            first_name,
            last_name,
            email,
            phone,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    { enabled: !!user && user.user_type === 'admin' }
  );

  // Vendor verification mutation
  const verifyVendorMutation = useMutation(
    async ({ vendorId, status, notes }: { vendorId: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('vendor_profiles')
        .update({ 
          verification_status: status,
          verification_notes: notes,
          verified_at: status === 'verified' ? new Date().toISOString() : null,
          verified_by: user?.id
        })
        .eq('id', vendorId);
      
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vendor-profiles']);
        toast.success('Vendor verification status updated successfully');
        setShowVendorDetails(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update verification status');
      }
    }
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

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleVendorVerification = (vendorId: string, status: string) => {
    const actionMessages = {
      verified: 'Are you sure you want to verify this vendor?',
      rejected: 'Are you sure you want to reject this vendor?',
      under_review: 'Are you sure you want to mark this vendor as under review?'
    };

    if (window.confirm(actionMessages[status as keyof typeof actionMessages])) {
      verifyVendorMutation.mutate({ vendorId, status });
    }
  };

  const openVendorDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
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
              { id: 'vendors', label: 'Vendor Verification' },
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Link to="/admin/users">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
              </div>
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
        </div>
      )}

      {/* Vendor Verification Tab */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Vendor Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendorProfilesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : vendorProfiles && vendorProfiles.length > 0 ? (
                <div className="space-y-4">
                  {vendorProfiles.map((vendor) => (
                    <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {vendor.company_name_english}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {vendor.user?.first_name} {vendor.user?.last_name} ({vendor.user?.email})
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                {vendor.business_category?.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {vendor.emirate?.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                Submitted: {formatDate(vendor.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getVerificationStatusColor(vendor.verification_status)}>
                            <div className="flex items-center space-x-1">
                              {getVerificationStatusIcon(vendor.verification_status)}
                              <span className="capitalize">{vendor.verification_status?.replace('_', ' ')}</span>
                            </div>
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openVendorDetails(vendor)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {vendor.verification_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleVendorVerification(vendor.id, 'verified')}
                                  disabled={verifyVendorMutation.isLoading}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleVendorVerification(vendor.id, 'rejected')}
                                  disabled={verifyVendorMutation.isLoading}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No vendor profiles found for verification.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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

      {/* Vendor Details Modal */}
      {showVendorDetails && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vendor Profile Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowVendorDetails(false)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>Company Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name (English)</p>
                      <p className="font-medium">{selectedVendor.company_name_english}</p>
                    </div>
                    {selectedVendor.company_name_arabic && (
                      <div>
                        <p className="text-sm text-gray-500">Company Name (Arabic)</p>
                        <p className="font-medium">{selectedVendor.company_name_arabic}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Trade License Number</p>
                      <p className="font-medium">{selectedVendor.trade_license_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Issuing Authority</p>
                      <p className="font-medium">{selectedVendor.issuing_authority}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Type</p>
                      <p className="font-medium">{selectedVendor.company_type?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Expiry</p>
                      <p className="font-medium">{formatDate(selectedVendor.license_expiry_date)}</p>
                    </div>
                    {selectedVendor.tax_registration_number && (
                      <div>
                        <p className="text-sm text-gray-500">Tax Registration Number (TRN)</p>
                        <p className="font-medium">{selectedVendor.tax_registration_number}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Business Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Business Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Registered Office Address</p>
                      <p className="font-medium">{selectedVendor.registered_office_address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Emirate</p>
                      <p className="font-medium">{selectedVendor.emirate?.replace('_', ' ')}</p>
                    </div>
                    {selectedVendor.makani_number && (
                      <div>
                        <p className="text-sm text-gray-500">Makani Number</p>
                        <p className="font-medium">{selectedVendor.makani_number}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>Contact Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Authorized Person</p>
                      <p className="font-medium">{selectedVendor.authorized_person_name}</p>
                      {selectedVendor.designation && (
                        <p className="text-sm text-gray-600">{selectedVendor.designation}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Email</p>
                      <p className="font-medium">{selectedVendor.business_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Phone</p>
                      <p className="font-medium">{selectedVendor.business_phone}</p>
                    </div>
                    {selectedVendor.whatsapp_number && (
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <p className="font-medium">{selectedVendor.whatsapp_number}</p>
                      </div>
                    )}
                    {selectedVendor.company_website && (
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={selectedVendor.company_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {selectedVendor.company_website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Business Operations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>Business Operations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Business Category</p>
                      <p className="font-medium">{selectedVendor.business_category?.replace('_', ' ')}</p>
                    </div>
                    {selectedVendor.years_experience_uae && (
                      <div>
                        <p className="text-sm text-gray-500">Years of Experience in UAE</p>
                        <p className="font-medium">{selectedVendor.years_experience_uae} years</p>
                      </div>
                    )}
                    {selectedVendor.staff_strength && (
                      <div>
                        <p className="text-sm text-gray-500">Staff Strength</p>
                        <p className="font-medium">{selectedVendor.staff_strength} employees</p>
                      </div>
                    )}
                    {selectedVendor.main_services_offered && selectedVendor.main_services_offered.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Main Services Offered</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedVendor.main_services_offered.map((service: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Verification Sources */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Verification Sources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Government Portals</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-blue-900">Trade License Validity</p>
                            <p className="text-sm text-blue-700">DED & Freezone Portals</p>
                          </div>
                          <a 
                            href="https://ded.ae/DED_FZLookup" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Verify →
                          </a>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-green-900">VAT TRN Verification</p>
                            <p className="text-sm text-green-700">Federal Tax Authority</p>
                          </div>
                          <a 
                            href="https://tax.gov.ae/trn-verify.aspx" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Verify →
                          </a>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <p className="font-medium text-purple-900">Chamber Registration</p>
                            <p className="text-sm text-purple-700">Dubai Chamber Portal</p>
                          </div>
                          <a 
                            href="https://www.dubaichamber.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            Verify →
                          </a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Certifications & Social Proof</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium text-orange-900">ISO / HSE Certificates</p>
                            <p className="text-sm text-orange-700">Cross-check with issuing body</p>
                          </div>
                          <span className="text-orange-600 text-sm font-medium">
                            Manual Check
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                          <div>
                            <p className="font-medium text-indigo-900">Social Proof</p>
                            <p className="text-sm text-indigo-700">Website, LinkedIn, Google Business</p>
                          </div>
                          <span className="text-indigo-600 text-sm font-medium">
                            Manual Check
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">MOHRE Registration</p>
                            <p className="text-sm text-gray-700">Ministry of Human Resources</p>
                          </div>
                          <a 
                            href="https://www.mohre.gov.ae/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Verify →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Verification Notes</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Use the above portals to verify the company details. Cross-check trade license numbers, 
                          VAT TRN, and other credentials. Document any discrepancies or concerns in the verification notes.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                {selectedVendor.verification_status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleVendorVerification(selectedVendor.id, 'rejected')}
                      disabled={verifyVendorMutation.isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleVendorVerification(selectedVendor.id, 'verified')}
                      disabled={verifyVendorMutation.isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
