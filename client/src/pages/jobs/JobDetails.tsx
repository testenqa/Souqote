import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  CheckCircle,
  MessageCircle,
  Phone,
  Award,
  TrendingUp,
  Shield,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [sortBy, setSortBy] = useState('price'); // price, rating, experience
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [selectedBid, setSelectedBid] = useState<string | null>(null);

  // Mock job data
  const job = {
    id: id || '1',
    title: 'Fix leaking kitchen faucet',
    description: 'The kitchen faucet has been leaking for the past week. Water drips constantly from the spout and there\'s also a leak under the sink. Need someone to diagnose and fix the issue.',
    category: 'Plumbing',
    location: 'Downtown Dubai, UAE',
    budget: '500',
    urgency: 'Medium',
    preferredDate: '2024-09-15',
    status: 'open', // open, in-progress, completed
    postedDate: '2024-09-12',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400'
    ]
  };

  // Mock bids data
  const bids = [
    {
      id: '1',
      technician: {
        id: '1',
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        rating: 4.9,
        totalJobs: 156,
        experience: '5 years',
        verified: true,
        responseTime: '2 hours'
      },
      price: 450,
      estimatedTime: '2-3 hours',
      message: 'I have extensive experience with kitchen faucet repairs. I can fix both the spout leak and the under-sink leak. Available tomorrow morning.',
      submittedAt: '2024-09-12T10:30:00Z',
      status: 'pending'
    },
    {
      id: '2',
      technician: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        rating: 4.8,
        totalJobs: 89,
        experience: '3 years',
        verified: true,
        responseTime: '1 hour'
      },
      price: 380,
      estimatedTime: '1-2 hours',
      message: 'Specialized in plumbing repairs. I can diagnose the issue quickly and provide a permanent solution. Same-day service available.',
      submittedAt: '2024-09-12T11:15:00Z',
      status: 'pending'
    },
    {
      id: '3',
      technician: {
        id: '3',
        name: 'Mohammed Al-Rashid',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        rating: 4.7,
        totalJobs: 203,
        experience: '7 years',
        verified: true,
        responseTime: '30 minutes'
      },
      price: 520,
      estimatedTime: '3-4 hours',
      message: 'Licensed plumber with 7 years experience. I\'ll provide a detailed diagnosis and fix all issues. Includes 6-month warranty.',
      submittedAt: '2024-09-12T12:00:00Z',
      status: 'pending'
    }
  ];

  const sortedBids = [...bids].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'rating':
        comparison = a.technician.rating - b.technician.rating;
        break;
      case 'experience':
        comparison = a.technician.totalJobs - b.technician.totalJobs;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSelectBid = (bidId: string) => {
    setSelectedBid(bidId);
    // Here you would typically make an API call to accept the bid
    console.log('Selected bid:', bidId);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/my-jobs')}
            className="mb-4"
          >
            ← Back to My Jobs
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {job.preferredDate}
                </span>
                <Badge className={getUrgencyColor(job.urgency)}>
                  {job.urgency} Priority
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-600">AED {job.budget}</p>
              <p className="text-sm text-gray-600">Budget</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline">{job.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="text-sm">{job.postedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Open for Bids</Badge>
                </div>
              </CardContent>
            </Card>

            {job.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {job.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Job photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bids Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Bids ({bids.length})
              </h2>
              
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {sortedBids.map((bid) => (
                <Card key={bid.id} className={`transition-all duration-200 ${
                  selectedBid === bid.id ? 'ring-2 ring-pink-500 bg-pink-50' : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={bid.technician.avatar}
                          alt={bid.technician.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{bid.technician.name}</h3>
                            {bid.technician.verified && (
                              <Shield className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              {bid.technician.rating}
                            </span>
                            <span>{bid.technician.totalJobs} jobs completed</span>
                            <span>{bid.technician.experience} experience</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-pink-600">AED {bid.price}</p>
                        <p className="text-sm text-gray-600">{bid.estimatedTime}</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{bid.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Responds in {bid.technician.responseTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {bid.technician.totalJobs} completed
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>

                        <Button
                          onClick={() => handleSelectBid(bid.id)}
                          className="bg-pink-600 hover:bg-pink-700"
                          disabled={selectedBid === bid.id}
                        >
                          {selectedBid === bid.id ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Selected
                            </>
                          ) : (
                            'Select This Bid'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {bids.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bids Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Your job has been posted and technicians will start bidding soon.
                  </p>
                  <Button variant="outline">Share Job</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;