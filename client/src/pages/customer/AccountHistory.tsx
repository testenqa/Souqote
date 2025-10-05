import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Download, 
  Eye, 
  Filter, 
  Search,
  FileText,
  CreditCard,
  User,
  Settings,
  Heart,
  Bookmark,
  History,
  Receipt,
  Award,
  MessageSquare,
  Phone,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface JobHistory {
  id: string;
  service: string;
  professional: string;
  date: string;
  status: 'completed' | 'cancelled' | 'in_progress';
  rating: number;
  totalCost: number;
  location: string;
  description: string;
  invoiceUrl: string;
}

interface SavedProfessional {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  lastService: string;
  totalJobs: number;
}

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  building: string;
  apartment: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'tabby' | 'tamara';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const AccountHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'jobs' | 'invoices' | 'saved' | 'addresses' | 'payments'>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const jobHistory: JobHistory[] = [
    {
      id: '1',
      service: 'AC Repair & Maintenance',
      professional: 'Ahmed Hassan',
      date: '2024-01-15',
      status: 'completed',
      rating: 5,
      totalCost: 450,
      location: 'Dubai Marina, Building A, Apt 1205',
      description: 'AC unit repair with refrigerant recharge and filter replacement',
      invoiceUrl: '/invoices/inv-001.pdf'
    },
    {
      id: '2',
      service: 'Plumbing Fix',
      professional: 'Mohammed Ali',
      date: '2023-12-01',
      status: 'completed',
      rating: 4,
      totalCost: 200,
      location: 'JBR, Building B, Apt 801',
      description: 'Kitchen sink leak repair and pipe replacement',
      invoiceUrl: '/invoices/inv-002.pdf'
    },
    {
      id: '3',
      service: 'Electrical Work',
      professional: 'Raj Patel',
      date: '2024-02-01',
      status: 'in_progress',
      rating: 0,
      totalCost: 300,
      location: 'Downtown Dubai, Building C, Apt 1502',
      description: 'Power outlet installation and wiring repair',
      invoiceUrl: '/invoices/inv-003.pdf'
    }
  ];

  const savedProfessionals: SavedProfessional[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      specialty: 'AC & Cooling',
      rating: 4.9,
      avatar: '/avatars/ahmed.jpg',
      lastService: '2024-01-15',
      totalJobs: 3
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      specialty: 'Plumbing',
      rating: 4.8,
      avatar: '/avatars/mohammed.jpg',
      lastService: '2023-12-01',
      totalJobs: 2
    }
  ];

  const savedAddresses: SavedAddress[] = [
    {
      id: '1',
      name: 'Home',
      address: 'Dubai Marina, Building A, Apt 1205',
      building: 'Building A',
      apartment: '1205',
      isDefault: true
    },
    {
      id: '2',
      name: 'Office',
      address: 'Downtown Dubai, Building C, Apt 1502',
      building: 'Building C',
      apartment: '1502',
      isDefault: false
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'apple_pay',
      last4: '',
      expiry: '',
      isDefault: false
    }
  ];

  const filteredJobs = jobHistory.filter(job => {
    const matchesSearch = job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.professional.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    // Simulate download
    console.log('Downloading invoice:', invoiceUrl);
  };

  const handleRebookProfessional = (professionalId: string) => {
    navigate('/post-job', { state: { professionalId } });
  };

  const handleEditAddress = (addressId: string) => {
    navigate('/addresses/edit', { state: { addressId } });
  };

  const handleAddPaymentMethod = () => {
    navigate('/payments/add');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Account & History</h1>
          <p className="text-gray-600 mt-1">Manage your jobs, invoices, and saved information</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'jobs', name: 'Job History', icon: History },
                { id: 'invoices', name: 'Invoices', icon: Receipt },
                { id: 'saved', name: 'Saved Pros', icon: Heart },
                { id: 'addresses', name: 'Addresses', icon: MapPin },
                { id: 'payments', name: 'Payments', icon: CreditCard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Job History Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.service}</h3>
                          <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{job.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{job.professional}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(job.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          {job.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{job.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold">AED {job.totalCost}</div>
                          <div className="text-sm text-gray-500">Total Cost</div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJob(job.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(job.invoiceUrl)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>

            <div className="space-y-4">
              {jobHistory.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{job.service}</h3>
                        <p className="text-sm text-gray-600">
                          {job.professional} • {new Date(job.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">AED {job.totalCost}</div>
                          <div className="text-sm text-gray-500">Total</div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleDownloadInvoice(job.invoiceUrl)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Professionals Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Saved Professionals</h2>
              <Button onClick={() => navigate('/handymen')}>
                <Plus className="h-4 w-4 mr-2" />
                Find More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProfessionals.map((professional) => (
                <Card key={professional.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{professional.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Specialty:</span>
                        <span>{professional.specialty}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Service:</span>
                        <span>{new Date(professional.lastService).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Jobs:</span>
                        <span>{professional.totalJobs}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleRebookProfessional(professional.id)}
                        className="w-full"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Rebook
                      </Button>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
              <Button onClick={() => navigate('/addresses/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedAddresses.map((address) => (
                <Card key={address.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{address.name}</h3>
                          {address.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{address.address}</p>
                        <div className="text-sm text-gray-500">
                          <div>Building: {address.building}</div>
                          <div>Apartment: {address.apartment}</div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAddress(address.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
              <Button onClick={handleAddPaymentMethod}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="font-semibold">
                            {method.type === 'card' ? 'Credit Card' : method.type}
                          </h3>
                          {method.last4 && (
                            <p className="text-sm text-gray-600">**** **** **** {method.last4}</p>
                          )}
                          {method.expiry && (
                            <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                          )}
                        </div>
                        {method.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountHistory;
