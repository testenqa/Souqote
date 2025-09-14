import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Shield, 
  Award, 
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Sparkles,
  Home as HomeIcon,
  Calendar,
  MessageCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const HandymanProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock handyman data
  const handyman = {
    id: id || '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    phone: '+971501234568',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Professional plumber with 5 years experience in Dubai. I specialize in kitchen and bathroom plumbing, leak repairs, and pipe installations. I take pride in delivering quality work and ensuring customer satisfaction.',
    specialties: ['Plumbing', 'Pipe Repair', 'Kitchen Installation', 'Bathroom Renovation'],
    yearsExperience: 5,
    hourlyRate: 150,
    rating: 4.9,
    totalJobs: 156,
    responseTime: '2 hours',
    isVerified: true,
    location: 'Downtown Dubai',
    languages: ['English', 'Arabic'],
    tradeLicense: 'DL-2023-001',
    insuranceDocument: 'INS-2023-001',
    availability: 'Available now',
    completedJobs: 156,
    averageRating: 4.9,
    lastActive: '2 hours ago',
    joinDate: '2023-01-15',
    portfolio: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    ]
  };

  const reviews = [
    {
      id: '1',
      customerName: 'Sarah Ahmed',
      rating: 5,
      comment: 'Excellent work! Ahmed fixed our kitchen leak quickly and professionally. Highly recommended.',
      date: '2024-09-10',
      jobTitle: 'Kitchen Leak Repair'
    },
    {
      id: '2',
      customerName: 'Mohammed Ali',
      rating: 5,
      comment: 'Very professional and clean work. Ahmed installed new bathroom fixtures perfectly.',
      date: '2024-09-08',
      jobTitle: 'Bathroom Installation'
    },
    {
      id: '3',
      customerName: 'Fatima Hassan',
      rating: 4,
      comment: 'Good work overall, arrived on time and completed the job as promised.',
      date: '2024-09-05',
      jobTitle: 'Pipe Replacement'
    }
  ];

  const getSpecialtyIcon = (specialty: string) => {
    const icons: { [key: string]: any } = {
      'Plumbing': Wrench,
      'Electrical': Zap,
      'Painting': Paintbrush,
      'Carpentry': Hammer,
      'Cleaning': Sparkles,
      'Renovation': HomeIcon
    };
    return icons[specialty] || Wrench;
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: { [key: string]: string } = {
      'Plumbing': 'bg-blue-500',
      'Electrical': 'bg-yellow-500',
      'Painting': 'bg-green-500',
      'Carpentry': 'bg-orange-500',
      'Cleaning': 'bg-purple-500',
      'Renovation': 'bg-red-500'
    };
    return colors[specialty] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/handymen')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Handymen
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <img
                src={handyman.avatar}
                alt={handyman.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{handyman.name}</h1>
                  {handyman.isVerified && (
                    <Shield className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {handyman.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    {handyman.rating} ({handyman.totalJobs} jobs)
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {handyman.availability}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-pink-600">AED {handyman.hourlyRate}/hour</p>
              <p className="text-sm text-gray-600">Hourly Rate</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {handyman.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{handyman.bio}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">{handyman.yearsExperience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="font-semibold">{handyman.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Jobs</p>
                    <p className="font-semibold">{handyman.completedJobs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold">{new Date(handyman.joinDate).getFullYear()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {handyman.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {handyman.specialties.map((specialty, index) => {
                    const SpecialtyIcon = getSpecialtyIcon(specialty);
                    const specialtyColor = getSpecialtyColor(specialty);
                    return (
                      <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                        <div className={`w-12 h-12 ${specialtyColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                          <SpecialtyIcon className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-sm">{specialty}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {handyman.portfolio.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>Recent work examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {handyman.portfolio.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {reviews.length} reviews • {handyman.rating} average rating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.customerName}</p>
                        <p className="text-sm text-gray-600">{review.jobTitle}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Hire */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Hire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`tel:${handyman.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {handyman.phone}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`mailto:${handyman.email}`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={() => navigate(`/post-job?handyman=${handyman.id}`)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Hire {handyman.name}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Identity Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Trade License: {handyman.tradeLicense}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Insurance: {handyman.insuranceDocument}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-semibold">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">On-time Completion</span>
                  <span className="font-semibold">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Repeat Customers</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Active</span>
                  <span className="font-semibold">{handyman.lastActive}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandymanProfile;
