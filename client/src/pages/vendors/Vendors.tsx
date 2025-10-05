import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Vendors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [minRating, setMinRating] = useState('');

  const { data: vendors, isLoading, error } = useQuery(
    ['vendors', searchTerm, selectedSpecialty, minRating],
    async () => {
      let query = supabase
        .from('users')
        .select('*')
        .eq('user_type', 'vendor')
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
      }

      if (selectedSpecialty) {
        query = query.contains('specialties', [selectedSpecialty]);
      }

      if (minRating) {
        query = query.gte('rating', Number(minRating));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as User[];
    }
  );

  const { data: specialties } = useQuery(
    'specialties',
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('specialties')
        .eq('user_type', 'vendor')
        .not('specialties', 'is', null);
      
      if (error) throw error;
      
      // Extract unique specialties
      const allSpecialties = data.flatMap(user => user.specialties || []);
      return Array.from(new Set(allSpecialties)).sort();
    }
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading vendors</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verified Vendors</h1>
        <p className="text-gray-600">Find trusted vendors for your business needs on Souqote</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Vendors
            </label>
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              {specialties?.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setMinRating('');
              }}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors?.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {vendor.first_name[0]}{vendor.last_name[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {vendor.first_name} {vendor.last_name}
                  </CardTitle>
                  {vendor.company_name && (
                    <p className="text-sm text-gray-600">{vendor.company_name}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {vendor.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {vendor.bio}
                </p>
              )}
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(vendor.rating)}
                    <span className="text-sm font-medium ml-1">
                      {vendor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Quotes Submitted:</span>
                  <span className="text-sm font-medium">{vendor.total_quotes}</span>
                </div>

                {vendor.specialties && vendor.specialties.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Specialties:</span>
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {vendor.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{vendor.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {vendor.languages && vendor.languages.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Languages:</span>
                    <div className="flex flex-wrap gap-1">
                      {vendor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {vendor.is_verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <Link to={`/vendors/${vendor.id}`}>
                  <Button size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vendors?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No vendors found</div>
          <p className="text-gray-500">
            {searchTerm || selectedSpecialty || minRating
              ? 'Try adjusting your search criteria'
              : 'No verified vendors are currently available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Vendors;
