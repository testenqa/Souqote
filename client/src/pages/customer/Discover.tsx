import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Star, 
  MapPin, 
  Filter,
  Zap,
  Wrench,
  Paintbrush,
  Home as HomeIcon,
  Settings,
  Car,
  Sparkles,
  AlertTriangle,
  Calendar,
  Phone
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);

  const categories = [
    { 
      id: 'ac', 
      name: 'AC & Cooling', 
      icon: Zap, 
      color: 'bg-blue-500',
      description: 'AC repair, installation, maintenance',
      popular: true
    },
    { 
      id: 'plumbing', 
      name: 'Plumbing', 
      icon: Wrench, 
      color: 'bg-blue-600',
      description: 'Leaks, blockages, installations',
      popular: true
    },
    { 
      id: 'electrical', 
      name: 'Electrical', 
      icon: Settings, 
      color: 'bg-yellow-500',
      description: 'Wiring, outlets, lighting',
      popular: true
    },
    { 
      id: 'carpentry', 
      name: 'Carpentry', 
      icon: HomeIcon, 
      color: 'bg-amber-600',
      description: 'Furniture, doors, windows',
      popular: false
    },
    { 
      id: 'painting', 
      name: 'Painting', 
      icon: Paintbrush, 
      color: 'bg-green-500',
      description: 'Interior, exterior, touch-ups',
      popular: false
    },
    { 
      id: 'appliances', 
      name: 'Appliances', 
      icon: Settings, 
      color: 'bg-gray-600',
      description: 'Washing machine, dishwasher, oven',
      popular: false
    },
    { 
      id: 'handyman', 
      name: 'Handyman by Hour', 
      icon: Clock, 
      color: 'bg-purple-500',
      description: 'General repairs and maintenance',
      popular: true
    }
  ];

  const quickActions = [
    {
      id: 'emergency',
      title: 'Emergency Service',
      subtitle: '60-90 minutes',
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: 'Urgent repairs when you need them most'
    },
    {
      id: 'schedule',
      title: 'Schedule Later',
      subtitle: 'Choose your time',
      icon: Calendar,
      color: 'bg-blue-500',
      description: 'Book for a convenient time slot'
    },
    {
      id: 'quote',
      title: 'Get Free Quote',
      subtitle: 'No obligation',
      icon: Star,
      color: 'bg-green-500',
      description: 'Compare prices from multiple pros'
    }
  ];

  const suggestedServices = [
    'AC not cooling',
    'Water leak under sink',
    'Power outlet not working',
    'Door handle broken',
    'Paint touch up needed',
    'Washing machine not draining',
    'Light switch replacement',
    'Faucet dripping'
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/post-job?category=${categoryId}`);
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'emergency':
        setShowEmergency(true);
        break;
      case 'schedule':
        navigate('/post-job?type=schedule');
        break;
      case 'quote':
        navigate('/post-job?type=quote');
        break;
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/post-job?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Find a Service</h1>
          <p className="text-gray-600 mt-1">What do you need help with today?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Describe your problem (e.g., AC not cooling, water leak)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 h-12 text-lg"
            />
            <Button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              Search
            </Button>
          </div>

          {/* Suggested Services */}
          {searchTerm && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Suggested services:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedServices
                  .filter(service => 
                    service.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((service, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-pink-50 hover:border-pink-300"
                      onClick={() => {
                        setSearchTerm(service);
                        handleSearch();
                      }}
                    >
                      {service}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                onClick={() => handleQuickAction(action.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Browse Categories</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md ${
                  selectedCategory === category.id ? 'ring-2 ring-pink-500' : ''
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  {category.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Modal */}
        {showEmergency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Emergency Service
                </CardTitle>
                <CardDescription>
                  We'll connect you with the nearest available professional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Response Time:</strong> 60-90 minutes<br/>
                    <strong>Emergency Fee:</strong> AED 50<br/>
                    <strong>Available:</strong> 24/7
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => {
                      setShowEmergency(false);
                      navigate('/post-job?type=emergency');
                    }}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEmergency(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
