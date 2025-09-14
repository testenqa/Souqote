import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users,
  CheckCircle,
  X,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

const MyJobs: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock jobs data
  const jobs = [
    {
      id: '1',
      title: 'Fix leaking kitchen faucet',
      description: 'The kitchen faucet has been leaking for the past week. Water drips constantly from the spout.',
      category: 'Plumbing',
      location: 'Downtown Dubai, UAE',
      budget: 500,
      urgency: 'Medium',
      preferredDate: '2024-09-15',
      postedDate: '2024-09-12',
      status: 'open', // open, in-progress, completed, cancelled
      bidsCount: 3,
      selectedBid: null,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
    },
    {
      id: '2',
      title: 'Install ceiling fan in living room',
      description: 'Need to install a new ceiling fan in the living room. Electrical outlet is already available.',
      category: 'Electrical',
      location: 'Marina, Dubai',
      budget: 300,
      urgency: 'Low',
      preferredDate: '2024-09-20',
      postedDate: '2024-09-11',
      status: 'in-progress',
      bidsCount: 5,
      selectedBid: {
        technician: 'Ahmed Hassan',
        price: 280,
        estimatedTime: '2-3 hours'
      },
      images: ['https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400']
    },
    {
      id: '3',
      title: 'Paint bedroom walls',
      description: 'Need to paint 2 bedroom walls with a light blue color. Walls are already prepared.',
      category: 'Painting',
      location: 'Jumeirah, Dubai',
      budget: 800,
      urgency: 'High',
      preferredDate: '2024-09-14',
      postedDate: '2024-09-12',
      status: 'completed',
      bidsCount: 2,
      selectedBid: {
        technician: 'Sarah Johnson',
        price: 750,
        estimatedTime: '4-5 hours'
      },
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400']
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Open for Bids';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-600">Manage your posted jobs and track their progress</p>
          </div>
          <Button
            onClick={() => navigate('/post-job')}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open for Bids</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>
                        {getStatusLabel(job.status)}
                      </Badge>
                      <Badge className={getUrgencyColor(job.urgency)}>
                        {job.urgency} Priority
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {job.preferredDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        AED {job.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.bidsCount} bids
                      </span>
                    </div>
                  </div>
                  
                  {job.images.length > 0 && (
                    <img
                      src={job.images[0]}
                      alt={job.title}
                      className="w-20 h-20 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>

                {/* Selected Bid Info */}
                {job.selectedBid && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                      <span className="font-medium text-pink-800">Selected Technician</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{job.selectedBid.technician}</p>
                        <p className="text-sm text-gray-600">Estimated time: {job.selectedBid.estimatedTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-pink-600">AED {job.selectedBid.price}</p>
                        <p className="text-sm text-gray-600">Final price</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    
                    {job.bidsCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        View Bids ({job.bidsCount})
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === 'open' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel Job
                      </Button>
                    )}
                    
                    {job.status === 'in-progress' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Jobs Found */}
        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {jobs.length === 0 ? 'No Jobs Posted Yet' : 'No Jobs Found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {jobs.length === 0 
                  ? 'Start by posting your first job to get bids from qualified technicians.'
                  : 'Try adjusting your search criteria or status filter.'
                }
              </p>
              {jobs.length === 0 && (
                <Button
                  onClick={() => navigate('/post-job')}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyJobs;