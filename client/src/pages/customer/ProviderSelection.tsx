import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  Shield, 
  Award, 
  Phone, 
  MessageSquare,
  CheckCircle,
  X,
  Filter,
  SortAsc,
  SortDesc,
  User,
  Calendar,
  DollarSign,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  responseTime: string;
  price: number;
  eta: string;
  specialties: string[];
  languages: string[];
  verified: boolean;
  warranty: boolean;
  distance: number;
  bio: string;
  recentReviews: {
    rating: number;
    comment: string;
    date: string;
  }[];
}

const ProviderSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceData = location.state?.serviceData;
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'eta' | 'distance'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterRating, setFilterRating] = useState(0);
  const [showAutoMatch, setShowAutoMatch] = useState(true);

  // Mock data - in real app, this would come from API
  const mockProviders: Provider[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      avatar: '/avatars/ahmed.jpg',
      rating: 4.9,
      totalJobs: 150,
      completedJobs: 147,
      responseTime: '15 min',
      price: 120,
      eta: '45 min',
      specialties: ['AC Repair', 'Electrical'],
      languages: ['Arabic', 'English', 'Hindi'],
      verified: true,
      warranty: true,
      distance: 2.5,
      bio: 'Professional AC technician with 8 years experience in Dubai',
      recentReviews: [
        { rating: 5, comment: 'Excellent work, very professional', date: '2 days ago' },
        { rating: 5, comment: 'Fixed my AC quickly and efficiently', date: '1 week ago' }
      ]
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      avatar: '/avatars/mohammed.jpg',
      rating: 4.8,
      totalJobs: 200,
      completedJobs: 195,
      responseTime: '20 min',
      price: 100,
      eta: '30 min',
      specialties: ['Plumbing', 'General Handyman'],
      languages: ['Arabic', 'English'],
      verified: true,
      warranty: true,
      distance: 1.8,
      bio: 'Experienced plumber specializing in residential repairs',
      recentReviews: [
        { rating: 4, comment: 'Good service, reasonable price', date: '3 days ago' },
        { rating: 5, comment: 'Very satisfied with the work', date: '1 week ago' }
      ]
    },
    {
      id: '3',
      name: 'Raj Patel',
      avatar: '/avatars/raj.jpg',
      rating: 4.7,
      totalJobs: 120,
      completedJobs: 118,
      responseTime: '25 min',
      price: 90,
      eta: '60 min',
      specialties: ['Electrical', 'Appliance Repair'],
      languages: ['English', 'Hindi', 'Tamil'],
      verified: true,
      warranty: false,
      distance: 3.2,
      bio: 'Certified electrician with expertise in home electrical systems',
      recentReviews: [
        { rating: 5, comment: 'Professional and knowledgeable', date: '1 day ago' },
        { rating: 4, comment: 'Good work, would recommend', date: '5 days ago' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setProviders(mockProviders);
  }, []);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleAutoMatch = () => {
    // Auto-select the best provider based on rating, price, and ETA
    const bestProvider = providers
      .filter(p => p.verified && p.rating >= 4.5)
      .sort((a, b) => {
        const scoreA = (a.rating * 0.4) + ((1000 - a.price) / 10 * 0.3) + ((60 - parseInt(a.eta)) / 60 * 0.3);
        const scoreB = (b.rating * 0.4) + ((1000 - b.price) / 10 * 0.3) + ((60 - parseInt(b.eta)) / 60 * 0.3);
        return scoreB - scoreA;
      })[0];
    
    if (bestProvider) {
      setSelectedProviders([bestProvider.id]);
      setShowAutoMatch(false);
    }
  };

  const handleContinue = () => {
    if (selectedProviders.length > 0) {
      navigate('/booking', { 
        state: { 
          serviceData, 
          selectedProviders: providers.filter(p => selectedProviders.includes(p.id))
        } 
      });
    }
  };

  const sortedProviders = [...providers].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'eta':
        comparison = parseInt(a.eta) - parseInt(b.eta);
        break;
      case 'distance':
        comparison = a.distance - b.distance;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredProviders = sortedProviders.filter(provider => 
    provider.rating >= filterRating
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Choose Your Professional</h1>
              <p className="text-gray-600 mt-1">
                {serviceData?.issue} • {serviceData?.urgency} priority
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                  <option value="eta">ETA</option>
                  <option value="distance">Distance</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Auto Match Section */}
        {showAutoMatch && (
          <Card className="mb-6 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Auto-Match Available</h3>
                    <p className="text-sm text-gray-600">
                      We found the best professional for your job based on rating, price, and availability
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAutoMatch} size="sm">
                    Auto-Match
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAutoMatch(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Minimum Rating:</span>
            <div className="flex space-x-2">
              {[0, 4, 4.5, 4.8].map((rating) => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRating(rating)}
                >
                  {rating === 0 ? 'All' : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Providers List */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <Card 
              key={provider.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedProviders.includes(provider.id) 
                  ? 'ring-2 ring-pink-500 bg-pink-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleProviderSelect(provider.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    {provider.verified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Provider Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{provider.rating}</span>
                            <span className="text-sm text-gray-500">({provider.completedJobs} jobs)</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{provider.eta}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{provider.distance} km</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{provider.bio}</p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">AED {provider.price}</div>
                        <div className="text-sm text-gray-500">Response: {provider.responseTime}</div>
                      </div>
                    </div>

                    {/* Specialties and Languages */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {provider.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {provider.warranty && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Warranty
                        </Badge>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Languages: </span>
                      <span className="text-xs text-gray-700">{provider.languages.join(', ')}</span>
                    </div>

                    {/* Recent Reviews */}
                    {provider.recentReviews.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">Recent Review</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "{provider.recentReviews[0].comment}"
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {provider.recentReviews[0].date}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex items-center">
                    {selectedProviders.includes(provider.id) ? (
                      <CheckCircle className="h-6 w-6 text-pink-500" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        {selectedProviders.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedProviders.length} professional{selectedProviders.length > 1 ? 's' : ''} selected
              </div>
              <Button onClick={handleContinue} size="lg" className="px-8">
                Continue to Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderSelection;
