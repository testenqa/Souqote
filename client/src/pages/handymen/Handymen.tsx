import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Sparkles,
  Home as HomeIcon,
  SortAsc,
  SortDesc,
  Shield,
  Award,
  Phone,
  Mail
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

const Handymen: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, experience, price
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  const specialties = [
    { id: 'plumbing', name: 'Plumbing', icon: Wrench, color: 'bg-blue-500' },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'bg-yellow-500' },
    { id: 'painting', name: 'Painting', icon: Paintbrush, color: 'bg-green-500' },
    { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'bg-orange-500' },
    { id: 'cleaning', name: 'Cleaning', icon: Sparkles, color: 'bg-purple-500' },
    { id: 'renovation', name: 'Renovation', icon: HomeIcon, color: 'bg-red-500' },
  ];

  // Mock handymen data
  const handymen = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+971501234568',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      bio: 'Professional plumber with 5 years experience in Dubai. Specialized in kitchen and bathroom plumbing, leak repairs, and pipe installations.',
      specialties: ['Plumbing', 'Pipe Repair', 'Kitchen Installation'],
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
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+971501234569',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      bio: 'Licensed electrician specializing in home installations and repairs. 3 years of experience with modern electrical systems.',
      specialties: ['Electrical', 'Wiring', 'Lighting Installation'],
      yearsExperience: 3,
      hourlyRate: 120,
      rating: 4.8,
      totalJobs: 89,
      responseTime: '1 hour',
      isVerified: true,
      location: 'Marina, Dubai',
      languages: ['English'],
      tradeLicense: 'DL-2023-002',
      insuranceDocument: 'INS-2023-002',
      availability: 'Available tomorrow',
      completedJobs: 89,
      averageRating: 4.8,
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Mohammed Al-Rashid',
      email: 'mohammed@example.com',
      phone: '+971501234570',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      bio: 'Master carpenter with 7 years experience. Expert in furniture making, repairs, and custom woodwork projects.',
      specialties: ['Carpentry', 'Furniture Repair', 'Custom Woodwork'],
      yearsExperience: 7,
      hourlyRate: 180,
      rating: 4.7,
      totalJobs: 203,
      responseTime: '30 minutes',
      isVerified: true,
      location: 'Jumeirah, Dubai',
      languages: ['Arabic', 'English'],
      tradeLicense: 'DL-2023-003',
      insuranceDocument: 'INS-2023-003',
      availability: 'Available now',
      completedJobs: 203,
      averageRating: 4.7,
      lastActive: '30 minutes ago'
    },
    {
      id: '4',
      name: 'Fatima Al-Zahra',
      email: 'fatima@example.com',
      phone: '+971501234571',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      bio: 'Professional painter with 4 years experience. Specialized in interior and exterior painting, color consultation, and decorative finishes.',
      specialties: ['Painting', 'Color Consultation', 'Decorative Finishes'],
      yearsExperience: 4,
      hourlyRate: 100,
      rating: 4.9,
      totalJobs: 124,
      responseTime: '1 hour',
      isVerified: true,
      location: 'Business Bay, Dubai',
      languages: ['Arabic', 'English', 'Urdu'],
      tradeLicense: 'DL-2023-004',
      insuranceDocument: 'INS-2023-004',
      availability: 'Available this week',
      completedJobs: 124,
      averageRating: 4.9,
      lastActive: '1 hour ago'
    }
  ];

  const filteredHandymen = handymen.filter(handyman => {
    const matchesSearch = handyman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         handyman.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         handyman.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = !selectedSpecialty || handyman.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  const sortedHandymen = [...filteredHandymen].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'experience':
        comparison = a.yearsExperience - b.yearsExperience;
        break;
      case 'price':
        comparison = a.hourlyRate - b.hourlyRate;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getSpecialtyIcon = (specialty: string) => {
    return specialties.find(s => s.name === specialty)?.icon || Wrench;
  };

  const getSpecialtyColor = (specialty: string) => {
    return specialties.find(s => s.name === specialty)?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Handymen
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse verified professionals and choose the best handyman for your project
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search handymen by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>

          {/* Specialty Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedSpecialty === '' ? 'default' : 'outline'}
              onClick={() => setSelectedSpecialty('')}
              className="bg-pink-600 hover:bg-pink-700"
            >
              All Specialties
            </Button>
            {specialties.map((specialty) => (
              <Button
                key={specialty.id}
                variant={selectedSpecialty === specialty.name ? 'default' : 'outline'}
                onClick={() => setSelectedSpecialty(specialty.name)}
                className="flex items-center gap-2"
              >
                <specialty.icon className="h-4 w-4" />
                {specialty.name}
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
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="price">Hourly Rate</option>
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

        {/* Handymen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHandymen.map((handyman) => (
            <Card key={handyman.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={handyman.avatar}
                      alt={handyman.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{handyman.name}</h3>
                        {handyman.isVerified && (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{handyman.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="font-semibold">{handyman.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{handyman.totalJobs} jobs</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm line-clamp-2 mb-3">{handyman.bio}</p>
                
                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {handyman.specialties.slice(0, 3).map((specialty, index) => {
                    const SpecialtyIcon = getSpecialtyIcon(specialty);
                    const specialtyColor = getSpecialtyColor(specialty);
                    return (
                      <Badge key={index} variant="outline" className="text-xs">
                        <SpecialtyIcon className="h-3 w-3 mr-1" />
                        {specialty}
                      </Badge>
                    );
                  })}
                  {handyman.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{handyman.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Experience</p>
                    <p className="font-semibold">{handyman.yearsExperience} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hourly Rate</p>
                    <p className="font-semibold">AED {handyman.hourlyRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Response Time</p>
                    <p className="font-semibold">{handyman.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Availability</p>
                    <p className="font-semibold text-green-600">{handyman.availability}</p>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {handyman.languages.map((language, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/handymen/${handyman.id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700 flex-1"
                    onClick={() => navigate(`/post-job?handyman=${handyman.id}`)}
                  >
                    Hire Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Handymen Found */}
        {sortedHandymen.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Handymen Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new professionals.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('');
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

export default Handymen;
