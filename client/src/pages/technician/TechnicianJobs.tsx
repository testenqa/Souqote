import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Calendar,
  MessageCircle,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Sparkles,
  Home as HomeIcon
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

const TechnicianJobs: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assigned'); // assigned, bids, completed
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for technician jobs
  const assignedJobs = [
    {
      id: '1',
      title: 'Kitchen Leak Repair',
      description: 'Fix leaking pipe under kitchen sink. Water is dripping continuously.',
      category: 'Plumbing',
      location: 'Downtown Dubai',
      budget: 300,
      urgency: 'high',
      preferredDate: '2024-09-15',
      status: 'in_progress',
      customer: {
        name: 'Sarah Ahmed',
        phone: '+971501234567',
        rating: 4.8
      },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
      createdAt: '2024-09-12',
      startDate: '2024-09-13',
      estimatedDuration: '2-3 hours'
    },
    {
      id: '2',
      title: 'Bathroom Renovation',
      description: 'Complete bathroom renovation including tiling, plumbing, and fixtures.',
      category: 'Renovation',
      location: 'Marina, Dubai',
      budget: 2500,
      urgency: 'medium',
      preferredDate: '2024-09-20',
      status: 'assigned',
      customer: {
        name: 'Mohammed Ali',
        phone: '+971501234568',
        rating: 4.9
      },
      images: ['https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400'],
      createdAt: '2024-09-10',
      startDate: '2024-09-18',
      estimatedDuration: '3-4 days'
    }
  ];

  const myBids = [
    {
      id: '1',
      jobId: '3',
      jobTitle: 'Electrical Wiring Repair',
      jobDescription: 'Fix faulty wiring in living room. Lights flickering and some outlets not working.',
      category: 'Electrical',
      location: 'Jumeirah, Dubai',
      budget: 400,
      urgency: 'medium',
      preferredDate: '2024-09-16',
      myBid: 350,
      myMessage: 'I can fix this within 2 hours. I have experience with similar electrical issues.',
      status: 'pending',
      customer: {
        name: 'Fatima Hassan',
        phone: '+971501234569',
        rating: 4.7
      },
      bidDate: '2024-09-12',
      estimatedTime: '2 hours'
    },
    {
      id: '2',
      jobId: '4',
      jobTitle: 'Painting Service',
      jobDescription: 'Paint entire apartment - 2 bedrooms, living room, and kitchen.',
      category: 'Painting',
      location: 'Business Bay, Dubai',
      budget: 800,
      urgency: 'low',
      preferredDate: '2024-09-25',
      myBid: 650,
      myMessage: 'Professional painting with high-quality materials. Can start next week.',
      status: 'rejected',
      customer: {
        name: 'Ahmed Al-Rashid',
        phone: '+971501234570',
        rating: 4.5
      },
      bidDate: '2024-09-11',
      estimatedTime: '2 days'
    }
  ];

  const completedJobs = [
    {
      id: '1',
      title: 'Pipe Replacement',
      description: 'Replaced old pipes in bathroom. Fixed water pressure issues.',
      category: 'Plumbing',
      location: 'Downtown Dubai',
      budget: 200,
      status: 'completed',
      customer: {
        name: 'Sarah Ahmed',
        phone: '+971501234567',
        rating: 4.8
      },
      completedDate: '2024-09-10',
      rating: 5,
      review: 'Excellent work! Ahmed was professional and completed the job quickly.',
      payment: 'Paid'
    }
  ];

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Plumbing': Wrench,
      'Electrical': Zap,
      'Painting': Paintbrush,
      'Carpentry': Hammer,
      'Cleaning': Sparkles,
      'Renovation': HomeIcon
    };
    return icons[category] || Wrench;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'pending': 'bg-gray-100 text-gray-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'assigned': CheckCircle,
      'in_progress': Clock,
      'completed': CheckCircle,
      'cancelled': XCircle,
      'pending': AlertCircle,
      'accepted': CheckCircle,
      'rejected': XCircle
    };
    return icons[status] || AlertCircle;
  };

  const renderAssignedJobs = () => (
    <div className="space-y-4">
      {assignedJobs.map((job) => {
        const CategoryIcon = getCategoryIcon(job.category);
        const StatusIcon = getStatusIcon(job.status);
        return (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getUrgencyColor(job.urgency)}>
                    {job.urgency.toUpperCase()}
                  </Badge>
                  <Badge className={`${getStatusColor(job.status)} ml-2`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {job.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{job.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold">AED {job.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold">{job.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{job.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{job.customer.name}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/messages?job=${job.id}`)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Customer
                </Button>
                {job.status === 'assigned' && (
                  <Button
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => {/* Start job logic */}}
                  >
                    Start Job
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderMyBids = () => (
    <div className="space-y-4">
      {myBids.map((bid) => {
        const CategoryIcon = getCategoryIcon(bid.category);
        const StatusIcon = getStatusIcon(bid.status);
        return (
          <Card key={bid.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{bid.jobTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {bid.location}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getUrgencyColor(bid.urgency)}>
                    {bid.urgency.toUpperCase()}
                  </Badge>
                  <Badge className={`${getStatusColor(bid.status)} ml-2`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {bid.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{bid.jobDescription}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Your Bid</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Your Price</p>
                    <p className="font-semibold text-pink-600">AED {bid.myBid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job Budget</p>
                    <p className="font-semibold">AED {bid.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="font-semibold">{bid.estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bid Date</p>
                    <p className="font-semibold">{bid.bidDate}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Your Message:</strong> {bid.myMessage}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/jobs/${bid.jobId}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Job
                </Button>
                {bid.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Edit bid logic */}}
                  >
                    Edit Bid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderCompletedJobs = () => (
    <div className="space-y-4">
      {completedJobs.map((job) => {
        const CategoryIcon = getCategoryIcon(job.category);
        return (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CategoryIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    COMPLETED
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{job.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Earnings</p>
                  <p className="font-semibold text-green-600">AED {job.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="font-semibold">{job.completedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-semibold">{job.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-semibold text-green-600">{job.payment}</p>
                </div>
              </div>

              {job.review && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Review</h4>
                  <p className="text-gray-700">"{job.review}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Jobs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your assigned jobs, track your bids, and view completed work
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === 'assigned' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('assigned')}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Assigned Jobs ({assignedJobs.length})
            </Button>
            <Button
              variant={activeTab === 'bids' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bids')}
            >
              My Bids ({myBids.length})
            </Button>
            <Button
              variant={activeTab === 'completed' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({completedJobs.length})
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'assigned' && renderAssignedJobs()}
        {activeTab === 'bids' && renderMyBids()}
        {activeTab === 'completed' && renderCompletedJobs()}
      </div>
    </div>
  );
};

export default TechnicianJobs;
