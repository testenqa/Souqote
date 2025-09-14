import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Star,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Sparkles,
  Home as HomeIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, budget, urgency
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  const categories = [
    { id: 'plumbing', name: 'Plumbing', icon: Wrench, color: 'bg-blue-500' },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'bg-yellow-500' },
    { id: 'painting', name: 'Painting', icon: Paintbrush, color: 'bg-green-500' },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'bg-orange-500' },
    { id: 'cleaning', name: 'Cleaning', icon: Sparkles, color: 'bg-purple-500' },
    { id: 'renovation', name: 'Renovation', icon: HomeIcon, color: 'bg-red-500' },
  ];

  // Mock jobs data
  const jobs = [
    {
      id: '1',
      title: 'Fix leaking kitchen faucet',
      description: 'The kitchen faucet has been leaking for the past week. Water drips constantly from the spout and there\'s also a leak under the sink.',
      category: 'Plumbing',
      location: 'Downtown Dubai, UAE',
      budget: 500,
      urgency: 'Medium',
      preferredDate: '2024-09-15',
      postedDate: '2024-09-12',
      bidsCount: 3,
      customer: {
        name: 'Sarah Ahmed',
        rating: 4.8,
        totalJobs: 12
      },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
    },
    {
      id: '2',
      title: 'Install ceiling fan in living room',
      description: 'Need to install a new ceiling fan in the living room. Electrical outlet is already available, just need proper installation.',
      category: 'Electrical',
      location: 'Marina, Dubai',
      budget: 300,
      urgency: 'Low',
      preferredDate: '2024-09-20',
      postedDate: '2024-09-11',
      bidsCount: 5,
      customer: {
        name: 'Mohammed Ali',
        rating: 4.9,
        totalJobs: 8
      },
      images: ['https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400']
    },
    {
      id: '3',
      title: 'Paint bedroom walls',
      description: 'Need to paint 2 bedroom walls with a light blue color. Walls are already prepared, just need painting.',
      category: 'Painting',
      location: 'Jumeirah, Dubai',
      budget: 800,
      urgency: 'High',
      preferredDate: '2024-09-14',
      postedDate: '2024-09-12',
      bidsCount: 2,
      customer: {
        name: 'Fatima Hassan',
        rating: 4.7,
        totalJobs: 15
      },
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400']
    },
    {
      id: '4',
      title: 'Repair wooden cabinet door',
      description: 'The kitchen cabinet door is loose and needs repair. The hinge seems to be broken and needs replacement.',
      category: 'Carpentry',
      location: 'Business Bay, Dubai',
      budget: 200,
      urgency: 'Medium',
      preferredDate: '2024-09-16',
      postedDate: '2024-09-10',
      bidsCount: 4,
      customer: {
        name: 'Ahmed Al-Rashid',
        rating: 4.6,
        totalJobs: 6
      },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        break;
      case 'budget':
        comparison = a.budget - b.budget;
        break;
      case 'urgency':
        const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        comparison = urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(cat => cat.name === category)?.icon || Wrench;
  };

  const getCategoryColor = (category: string) => {
    return categories.find(cat => cat.name === category)?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Jobs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse available jobs and submit your bids to get hired
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className="bg-pink-600 hover:bg-pink-700"
            >
              All Jobs
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="date">Date Posted</option>
              <option value="budget">Budget</option>
              <option value="urgency">Urgency</option>
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

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedJobs.map((job) => {
            const CategoryIcon = getCategoryIcon(job.category);
            const categoryColor = getCategoryColor(job.category);
            
            return (
              <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 ${categoryColor} rounded-full flex items-center justify-center`}>
                      <CategoryIcon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={getUrgencyColor(job.urgency)}>
                      {job.urgency}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-pink-600 transition-colors">
                    {job.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-2">
                    {job.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Job Images */}
                  {job.images.length > 0 && (
                    <div className="h-32 overflow-hidden rounded-lg">
                      <img
                        src={job.images[0]}
                        alt={job.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{job.preferredDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-pink-600">AED {job.budget}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {job.customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.customer.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-gray-600">{job.customer.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{job.bidsCount} bids</p>
                      <p className="text-xs text-gray-500">{job.postedDate}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-pink-600 hover:bg-pink-700 flex-1"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      Submit Bid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Jobs Found */}
        {sortedJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new jobs.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Jobs;