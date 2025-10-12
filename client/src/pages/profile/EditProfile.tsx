import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { useMutation, useQueryClient } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Building, Phone, MapPin, Globe, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface BuyerProfileData {
  company_name?: string;
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

const EditProfile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<BuyerProfileData>({
    company_name: '',
    position: '',
    trn_number: '',
    business_type: '',
    industry: '',
    company_size: '',
    website: '',
    address: '',
    city: '',
    emirate: '',
    postal_code: '',
    contact_person: '',
    alternative_phone: '',
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        company_name: user.company_name || '',
        position: user.position || '',
        trn_number: user.trn_number || '',
        business_type: user.business_type || '',
        industry: user.industry || '',
        company_size: user.company_size || '',
        website: user.website || '',
        address: user.address || '',
        city: user.city || '',
        emirate: user.emirate || '',
        postal_code: user.postal_code || '',
        contact_person: user.contact_person || '',
        alternative_phone: user.alternative_phone || '',
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation(
    async (profileData: BuyerProfileData) => {
      if (!user) throw new Error('User not found');
      
      // Use the AuthContext's updateProfile function to ensure context is updated
      await updateProfile(profileData);
      return profileData;
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        queryClient.invalidateQueries(['user-profile', user?.id]);
        navigate('/profile');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile');
      },
    }
  );

  const handleInputChange = (field: keyof BuyerProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for required fields
    const newErrors: Record<string, boolean> = {};
    if (!formData.company_name?.trim()) newErrors.company_name = true;
    if (!formData.position?.trim()) newErrors.position = true;
    if (!formData.business_type?.trim()) newErrors.business_type = true;
    if (!formData.industry?.trim()) newErrors.industry = true;
    if (!formData.company_size?.trim()) newErrors.company_size = true;
    if (!formData.address?.trim()) newErrors.address = true;
    if (!formData.city?.trim()) newErrors.city = true;
    if (!formData.emirate?.trim()) newErrors.emirate = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    updateProfileMutation.mutate(formData);
  };

  const businessTypes = [
    'LLC (Limited Liability Company)',
    'Sole Proprietorship',
    'Partnership',
    'Public Joint Stock Company',
    'Private Joint Stock Company',
    'Branch Office',
    'Representative Office',
    'Free Zone Company',
    'Other'
  ];

  const industries = [
    'Construction',
    'Technology',
    'Healthcare',
    'Finance & Banking',
    'Real Estate',
    'Manufacturing',
    'Retail & Wholesale',
    'Hospitality & Tourism',
    'Education',
    'Government',
    'Logistics & Transportation',
    'Energy & Utilities',
    'Consulting',
    'Media & Communications',
    'Agriculture',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const emirates = [
    'Abu Dhabi',
    'Dubai',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
  ];

  if (!user || user.user_type !== 'buyer') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">This page is only available for buyers.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Business Information
          </h1>
          <p className="text-gray-600">
            Update your business details and contact information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Business Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.company_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.position ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Procurement Manager, CEO"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => handleInputChange('business_type', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.business_type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.industry ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.company_size}
                      onChange={(e) => handleInputChange('company_size', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.company_size ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select company size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TRN Number
                    </label>
                    <input
                      type="text"
                      value={formData.trn_number}
                      onChange={(e) => handleInputChange('trn_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter TRN number"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternative Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.alternative_phone}
                      onChange={(e) => handleInputChange('alternative_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter alternative phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) => handleInputChange('contact_person', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Primary contact person name"
                    />
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Business Address</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter complete business address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emirate <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.emirate}
                      onChange={(e) => handleInputChange('emirate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.emirate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select emirate</option>
                      {emirates.map((emirate) => (
                        <option key={emirate} value={emirate}>{emirate}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </div>

              {/* Online Presence */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Online Presence</span>
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.yourcompany.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link to="/profile">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
