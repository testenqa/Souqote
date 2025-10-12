import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { User, Building, MapPin, Phone, Mail, Star, Globe, CheckCircle } from 'lucide-react';

interface BuyerProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  user_type: 'buyer' | 'vendor' | 'admin';
  avatar_url?: string;
  bio?: string;
  company_name?: string;
  is_verified: boolean;
  rating: number;
  total_rfqs: number;
  created_at: string;
  // Buyer-specific fields
  position?: string;
  trn_number?: string;
  business_type?: string;
  industry?: string;
  company_size?: string;
  website?: string;
  address?: string;
  city?: string;
  emirate?: string;
  postal_code?: string;
  contact_person?: string;
  alternative_phone?: string;
}

interface BuyerProfileModalProps {
  buyerId: string;
  isOpen: boolean;
  onClose: () => void;
}

const BuyerProfileModal: React.FC<BuyerProfileModalProps> = ({
  buyerId,
  isOpen,
  onClose
}) => {
  const [buyer, setBuyer] = useState<BuyerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyerProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', buyerId)
        .eq('user_type', 'buyer')
        .single();

      if (error) throw error;
      setBuyer(data);
    } catch (err) {
      console.error('Error fetching buyer profile:', err);
      setError('Failed to load buyer profile');
    } finally {
      setLoading(false);
    }
  }, [buyerId]);

  useEffect(() => {
    if (isOpen && buyerId) {
      fetchBuyerProfile();
    }
  }, [isOpen, buyerId, fetchBuyerProfile]);

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
            <h2 className="text-2xl font-bold text-gray-900">Buyer Profile</h2>
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
              <Button onClick={fetchBuyerProfile} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Buyer Profile Content */}
          {buyer && !loading && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {buyer.avatar_url ? (
                        <img
                          src={buyer.avatar_url}
                          alt={`${buyer.first_name} ${buyer.last_name}`}
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
                          {buyer.first_name} {buyer.last_name}
                        </h3>
                        {buyer.is_verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {buyer.position && (
                        <div className="flex items-center space-x-1 mb-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{buyer.position}</span>
                        </div>
                      )}

                      {buyer.company_name && (
                        <div className="flex items-center space-x-1 mb-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{buyer.company_name}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1 mb-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{buyer.email}</span>
                      </div>

                      {buyer.phone && (
                        <div className="flex items-center space-x-1 mb-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{buyer.phone}</span>
                        </div>
                      )}

                      {buyer.address && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{buyer.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(buyer.rating)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {buyer.rating.toFixed(1)} rating
                      </p>
                      <p className="text-sm text-gray-600">
                        {buyer.total_rfqs} RFQs posted
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {buyer.bio && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-gray-700">{buyer.bio}</p>
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
                    {/* Business Details */}
                    <div className="space-y-3">
                      {buyer.business_type && (
                        <div>
                          <span className="text-gray-600 block">Business Type:</span>
                          <span className="text-gray-900">{buyer.business_type}</span>
                        </div>
                      )}
                      {buyer.industry && (
                        <div>
                          <span className="text-gray-600 block">Industry:</span>
                          <span className="text-gray-900">{buyer.industry}</span>
                        </div>
                      )}
                      {buyer.company_size && (
                        <div>
                          <span className="text-gray-600 block">Company Size:</span>
                          <span className="text-gray-900">{buyer.company_size}</span>
                        </div>
                      )}
                      {buyer.trn_number && (
                        <div>
                          <span className="text-gray-600 block">TRN Number:</span>
                          <span className="text-gray-900">{buyer.trn_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Location Details */}
                    <div className="space-y-3">
                      {buyer.city && (
                        <div>
                          <span className="text-gray-600 block">City:</span>
                          <span className="text-gray-900">{buyer.city}</span>
                        </div>
                      )}
                      {buyer.emirate && (
                        <div>
                          <span className="text-gray-600 block">Emirate:</span>
                          <span className="text-gray-900">{buyer.emirate}</span>
                        </div>
                      )}
                      {buyer.postal_code && (
                        <div>
                          <span className="text-gray-600 block">Postal Code:</span>
                          <span className="text-gray-900">{buyer.postal_code}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600 block">Member Since:</span>
                        <span className="text-gray-900">{formatDate(buyer.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              {(buyer.alternative_phone || buyer.contact_person || buyer.website) && (
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Additional Contact Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {buyer.alternative_phone && (
                        <div>
                          <span className="text-gray-600 block">Alternative Phone:</span>
                          <span className="text-gray-900">{buyer.alternative_phone}</span>
                        </div>
                      )}
                      {buyer.contact_person && (
                        <div>
                          <span className="text-gray-600 block">Contact Person:</span>
                          <span className="text-gray-900">{buyer.contact_person}</span>
                        </div>
                      )}
                      {buyer.website && (
                        <div>
                          <span className="text-gray-600 block">Website:</span>
                          <a 
                            href={buyer.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <Globe className="w-4 h-4" />
                            <span>{buyer.website}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
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

export default BuyerProfileModal;
