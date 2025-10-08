import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CreditCard, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { VendorProfile } from '../../types';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'company'>('personal');

  // Fetch vendor profile if user is a vendor
  const { data: profileData, isLoading } = useQuery(
    ['vendor-profile', user?.id],
    async () => {
      if (!user || user.user_type !== 'vendor') return null;
      
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    { enabled: !!user && user.user_type === 'vendor' }
  );

  useEffect(() => {
    if (profileData) {
      setVendorProfile(profileData);
    }
  }, [profileData]);

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('profile')}
          </h1>
          <p className="text-gray-600">
            Manage your account information and business profile
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('personal')}
                className={`${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </button>
              {user.user_type === 'vendor' && (
                <button
                  onClick={() => setActiveTab('company')}
                  className={`${
                    activeTab === 'company'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Building className="w-5 h-5" />
                  <span>Company Information</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="font-medium mt-1">{user.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="font-medium mt-1">{user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium mt-1">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium mt-1">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <div className="mt-1">
                      <Badge>
                        {user.user_type === 'buyer' ? 'Buyer' : 
                         user.user_type === 'vendor' ? 'Vendor' : 'Admin'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium mt-1">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Information Tab */}
          {activeTab === 'company' && user.user_type === 'vendor' && (
            <>
              {isLoading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </CardContent>
                </Card>
              ) : vendorProfile ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Building className="w-5 h-5" />
                          <span>Company Details</span>
                        </CardTitle>
                        <Badge className={getVerificationStatusColor(vendorProfile.verification_status)}>
                          <div className="flex items-center space-x-1">
                            {getVerificationStatusIcon(vendorProfile.verification_status)}
                            <span className="capitalize">{vendorProfile.verification_status.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Company Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Company Name (English)</p>
                            <p className="font-medium">{vendorProfile.company_name_english}</p>
                          </div>
                          {vendorProfile.company_name_arabic && (
                            <div>
                              <p className="text-sm text-gray-500">Company Name (Arabic)</p>
                              <p className="font-medium">{vendorProfile.company_name_arabic}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Trade License Number</p>
                            <p className="font-medium">{vendorProfile.trade_license_number}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Issuing Authority</p>
                            <p className="font-medium">{vendorProfile.issuing_authority}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Company Type</p>
                            <p className="font-medium">{vendorProfile.company_type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">License Expiry</p>
                            <p className="font-medium">{formatDate(vendorProfile.license_expiry_date)}</p>
                          </div>
                          {vendorProfile.tax_registration_number && (
                            <div>
                              <p className="text-sm text-gray-500">Tax Registration Number (TRN)</p>
                              <p className="font-medium">{vendorProfile.tax_registration_number}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business Location */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <MapPin className="w-5 h-5" />
                          <span>Business Location</span>
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-500">Registered Office Address</p>
                            <p className="font-medium">{vendorProfile.registered_office_address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Emirate</p>
                            <p className="font-medium">{vendorProfile.emirate.replace('_', ' ')}</p>
                          </div>
                          {vendorProfile.makani_number && (
                            <div>
                              <p className="text-sm text-gray-500">Makani Number</p>
                              <p className="font-medium">{vendorProfile.makani_number}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <Phone className="w-5 h-5" />
                          <span>Contact Details</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Authorized Person</p>
                            <p className="font-medium">{vendorProfile.authorized_person_name}</p>
                            {vendorProfile.designation && (
                              <p className="text-sm text-gray-600">{vendorProfile.designation}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Business Email</p>
                            <p className="font-medium">{vendorProfile.business_email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Business Phone</p>
                            <p className="font-medium">{vendorProfile.business_phone}</p>
                          </div>
                          {vendorProfile.whatsapp_number && (
                            <div>
                              <p className="text-sm text-gray-500">WhatsApp</p>
                              <p className="font-medium">{vendorProfile.whatsapp_number}</p>
                            </div>
                          )}
                          {vendorProfile.company_website && (
                            <div>
                              <p className="text-sm text-gray-500">Website</p>
                              <a 
                                href={vendorProfile.company_website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <span>{vendorProfile.company_website}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business Operations */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <Building className="w-5 h-5" />
                          <span>Business Operations</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Business Category</p>
                            <p className="font-medium">{vendorProfile.business_category.replace('_', ' ')}</p>
                          </div>
                          {vendorProfile.years_experience_uae && (
                            <div>
                              <p className="text-sm text-gray-500">Years of Experience in UAE</p>
                              <p className="font-medium">{vendorProfile.years_experience_uae} years</p>
                            </div>
                          )}
                          {vendorProfile.staff_strength && (
                            <div>
                              <p className="text-sm text-gray-500">Staff Strength</p>
                              <p className="font-medium">{vendorProfile.staff_strength} employees</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Response SLA</p>
                            <p className="font-medium">{vendorProfile.response_sla_hours} hours</p>
                          </div>
                        </div>
                        
                        {vendorProfile.main_services_offered && vendorProfile.main_services_offered.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Main Services Offered</p>
                            <div className="flex flex-wrap gap-2">
                              {vendorProfile.main_services_offered.map((service, index) => (
                                <Badge key={index} variant="outline">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Banking Information */}
                      {(vendorProfile.bank_name || vendorProfile.iban) && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <CreditCard className="w-5 h-5" />
                            <span>Banking Information</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendorProfile.bank_name && (
                              <div>
                                <p className="text-sm text-gray-500">Bank Name</p>
                                <p className="font-medium">{vendorProfile.bank_name}</p>
                              </div>
                            )}
                            {vendorProfile.iban && (
                              <div>
                                <p className="text-sm text-gray-500">IBAN</p>
                                <p className="font-medium">{vendorProfile.iban}</p>
                              </div>
                            )}
                            {vendorProfile.account_name && (
                              <div>
                                <p className="text-sm text-gray-500">Account Name</p>
                                <p className="font-medium">{vendorProfile.account_name}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Compliance Status */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <Shield className="w-5 h-5" />
                          <span>Compliance Status</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            {vendorProfile.uae_labour_law_compliance ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="text-sm">UAE Labour Law</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {vendorProfile.mohre_requirements_compliance ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="text-sm">MOHRE Requirements</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {vendorProfile.vat_compliance ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="text-sm">VAT Compliance</span>
                          </div>
                        </div>
                      </div>

                      {/* Profile Completion */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Completion</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Completion Status</span>
                            <span className="font-medium">{vendorProfile.profile_completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                vendorProfile.profile_completion_percentage >= 80 
                                  ? 'bg-green-600' 
                                  : vendorProfile.profile_completion_percentage >= 60 
                                  ? 'bg-yellow-600' 
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${vendorProfile.profile_completion_percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {vendorProfile.is_profile_complete 
                              ? 'Profile is complete and ready for quote submission'
                              : 'Complete your profile to start bidding on RFQs'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="w-5 h-5" />
                        <span>Company Profile</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Building className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Complete Your Vendor Profile
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Set up your business profile to start bidding on RFQs and connect with buyers.
                          </p>
                          <Link to="/vendor-onboarding">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Start Profile Setup
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
