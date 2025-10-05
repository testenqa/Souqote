import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  MapPin, 
  Star, 
  Bell, 
  Calendar, 
  Plus,
  Wrench,
  Paintbrush,
  Settings,
  Zap,
  Home as HomeIcon,
  Car,
  MessageSquare,
  Phone,
  Award,
  Shield,
  History,
  Heart,
  CreditCard,
  FileText,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const quickActions = [
    {
      id: 'emergency',
      title: 'Emergency Service',
      subtitle: '60-90 minutes',
      icon: AlertCircle,
      color: 'bg-red-500',
      onClick: () => navigate('/discover?action=emergency')
    },
    {
      id: 'schedule',
      title: 'Schedule Service',
      subtitle: 'Choose your time',
      icon: Calendar,
      color: 'bg-blue-500',
      onClick: () => navigate('/discover?action=schedule')
    },
    {
      id: 'quote',
      title: 'Get Quote',
      subtitle: 'Compare prices',
      icon: Star,
      color: 'bg-green-500',
      onClick: () => navigate('/discover?action=quote')
    }
  ];

  const categories = [
    { id: 'ac', name: 'AC & Cooling', icon: Zap, color: 'bg-blue-500', popular: true },
    { id: 'plumbing', name: 'Plumbing', icon: Wrench, color: 'bg-blue-600', popular: true },
    { id: 'electrical', name: 'Electrical', icon: Settings, color: 'bg-yellow-500', popular: true },
    { id: 'carpentry', name: 'Carpentry', icon: HomeIcon, color: 'bg-amber-600', popular: false },
    { id: 'painting', name: 'Painting', icon: Paintbrush, color: 'bg-green-500', popular: false },
    { id: 'appliances', name: 'Appliances', icon: Settings, color: 'bg-gray-600', popular: false }
  ];

  const recentJobs = [
    {
      id: '1',
      service: 'AC Repair',
      professional: 'Ahmed Hassan',
      date: '2024-01-15',
      status: 'completed',
      rating: 5,
      cost: 450
    },
    {
      id: '2',
      service: 'Plumbing Fix',
      professional: 'Mohammed Ali',
      date: '2023-12-01',
      status: 'completed',
      rating: 4,
      cost: 200
    }
  ];

  const upcomingJobs = [
    {
      id: '3',
      service: 'Electrical Work',
      professional: 'Raj Patel',
      date: '2024-02-01',
      time: '2:00 PM - 4:00 PM',
      status: 'scheduled'
    }
  ];

  const notifications = [
    {
      id: '1',
      title: 'Service Confirmed',
      message: 'Your AC repair is scheduled for tomorrow',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      title: 'Professional En Route',
      message: 'Ahmed is on his way. ETA: 15 min',
      time: '1 hour ago',
      unread: true
    }
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/discover?category=${categoryId}`);
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600 mt-1">What can we help you with today?</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {notifications.filter(n => n.unread).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="What do you need help with? (e.g., AC not cooling, water leak)"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Card 
                      key={action.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                      onClick={action.onClick}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.subtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browse Services</CardTitle>
                <CardDescription>Choose from our most popular categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card 
                      key={category.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <category.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                        {category.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Jobs */}
            {upcomingJobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{job.service}</h3>
                            <p className="text-sm text-gray-600">
                              {job.professional} • {new Date(job.date).toLocaleDateString()} at {job.time}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJobClick(job.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Services</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/account-history')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Wrench className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{job.service}</h3>
                          <p className="text-sm text-gray-600">
                            {job.professional} • {new Date(job.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">AED {job.cost}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{job.rating}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJobClick(job.id)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notifications</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                      }`}
                      onClick={() => navigate('/notifications')}
                    >
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/account-history')}>
                  <History className="h-4 w-4 mr-2" />
                  Job History
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/aftercare')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Warranties
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/account-history?tab=saved')}>
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Pros
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/account-history?tab=addresses')}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/account-history?tab=payments')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
