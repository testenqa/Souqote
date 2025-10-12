import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { User, Building, MapPin, Phone, Mail, Star, Award, CheckCircle } from 'lucide-react';

interface VendorProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  phone: string;
  avatar_url?: string;
  bio?: string;
  business_license?: string;
  tax_id?: string;
  languages?: string[];
  specialties?: string[];
  availability?: string;
  is_verified: boolean;
  rating: number;
  total_rfqs: number;
  total_quotes: number;
  created_at: string;
  location?: string;
}

interface VendorProfileModalProps {
  vendorId: string;
  isOpen: boolean;
  onClose: () => void;
}

const VendorProfileModal: React.FC<VendorProfileModalProps> = ({
  vendorId,
  isOpen,
  onClose
}) => {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', vendorId)
        .eq('user_type', 'vendor')
        .single();

      if (error) throw error;
      setVendor(data);
    } catch (err) {
      console.error('Error fetching vendor profile:', err);
      setError('Failed to load vendor profile');
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorProfile();
    }
  }, [isOpen, vendorId, fetchVendorProfile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vendor Profile</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchVendorProfile} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Vendor Profile Content */}
          {vendor && !loading && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {vendor.avatar_url ? (
                        <img
                          src={vendor.avatar_url}
                          alt={`${vendor.first_name} ${vendor.last_name}`}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Basic Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {vendor.first_name} {vendor.last_name}
                        </h3>
                        {vendor.is_verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {vendor.company_name && (
                        <div className="flex items-center space-x-1 mb-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{vendor.company_name}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1 mb-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{vendor.email}</span>
                      </div>

                      <div className="flex items-center space-x-1 mb-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{vendor.phone}</span>
                      </div>

                      {vendor.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{vendor.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(vendor.rating)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {vendor.rating.toFixed(1)} rating
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {vendor.bio && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-gray-700">{vendor.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Business Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Statistics */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">RFQs Responded:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {vendor.total_rfqs}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quotes Submitted:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {vendor.total_quotes}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="text-gray-900">{formatDate(vendor.created_at)}</span>
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-3">
                      {vendor.business_license && (
                        <div>
                          <span className="text-gray-600 block">Business License:</span>
                          <span className="text-gray-900">{vendor.business_license}</span>
                        </div>
                      )}
                      {vendor.tax_id && (
                        <div>
                          <span className="text-gray-600 block">Tax ID:</span>
                          <span className="text-gray-900">{vendor.tax_id}</span>
                        </div>
                      )}
                      {vendor.availability && (
                        <div>
                          <span className="text-gray-600 block">Availability:</span>
                          <span className="text-gray-900">{vendor.availability}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specialties & Languages */}
              {(vendor.specialties && vendor.specialties.length > 0) || 
               (vendor.languages && vendor.languages.length > 0) ? (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Specialties & Languages
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Specialties */}
                      {vendor.specialties && vendor.specialties.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Specialties:</h5>
                          <div className="flex flex-wrap gap-2">
                            {vendor.specialties.map((specialty, index) => (
                              <Badge key={index} className="bg-purple-100 text-purple-800">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {vendor.languages && vendor.languages.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Languages:</h5>
                          <div className="flex flex-wrap gap-2">
                            {vendor.languages.map((language, index) => (
                              <Badge key={index} className="bg-blue-100 text-blue-800">
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileModal;
