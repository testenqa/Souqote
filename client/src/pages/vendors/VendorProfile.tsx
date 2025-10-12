import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { User, Quote, VendorProfile as VendorProfileType } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Building, MapPin, Phone, Mail, Globe, Users, Award, Shield, Calendar, FileText, CheckCircle } from 'lucide-react';

const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: vendor, isLoading: vendorLoading } = useQuery(
    ['vendor', id],
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('user_type', 'vendor')
        .single();
      
      if (error) throw error;
      return data as User;
    },
    { enabled: !!id }
  );

  const { data: vendorProfile, isLoading: profileLoading } = useQuery(
    ['vendor-profile', id],
    async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', id)
        .single();
      
      if (error) throw error;
      return data as VendorProfileType;
    },
    { enabled: !!id }
  );

  const { data: recentQuotes, isLoading: quotesLoading } = useQuery(
    ['vendor-quotes', id],
    async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          rfq:rfqs (
            id,
            title,
            category,
            status
          )
        `)
        .eq('vendor_id', id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Quote[];
    },
    { enabled: !!id }
  );

  const { data: reviews, isLoading: reviewsLoading } = useQuery(
    ['vendor-reviews', id],
    async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey (
            id,
            first_name,
            last_name,
            company_name
          ),
          rfq:rfqs (
            id,
            title
          )
        `)
        .eq('reviewee_id', id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    { enabled: !!id }
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

  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (vendorLoading || profileLoading) return <LoadingSpinner />;
  if (!vendor) return <div className="text-red-500">Vendor not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/vendors" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Vendors
        </Link>
      </div>

      {/* Debug section removed - issue identified and resolved */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor Profile */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-2xl">
                    {vendor.first_name?.[0] || vendor.company_name?.[0] || 'V'}{vendor.last_name?.[0] || ''}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {`${vendor.first_name || ''} ${vendor.last_name || ''}`.trim() || vendor.company_name || 'Vendor'}
                    </h1>
                    {vendor.is_verified && (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  {vendor.company_name && vendor.first_name && (
                    <p className="text-lg text-gray-600 mb-2">{vendor.company_name}</p>
                  )}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(vendor.rating)}
                      <span className="text-sm font-medium ml-1">
                        {vendor.rating.toFixed(1)} ({vendor.total_quotes} quotes)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {vendor.bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{vendor.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendor.specialties && vendor.specialties.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {vendor.languages && vendor.languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {vendor.business_license && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {vendor.business_license && (
                      <p>Business License: {vendor.business_license}</p>
                    )}
                    {vendor.tax_id && (
                      <p>Tax ID: {vendor.tax_id}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Vendor Profile Information */}
          {vendorProfile ? (
            <>
              {/* Company Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Company Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Company Name (English)</span>
                        <p className="font-medium">{vendorProfile.company_name_english}</p>
                      </div>
                      {vendorProfile.company_name_arabic && (
                        <div>
                          <span className="text-sm text-gray-500">Company Name (Arabic)</span>
                          <p className="font-medium">{vendorProfile.company_name_arabic}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">Trade License Number</span>
                        <p className="font-medium">{vendorProfile.trade_license_number}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Issuing Authority</span>
                        <p className="font-medium">{vendorProfile.issuing_authority}</p>
                      </div>
                      {vendorProfile.license_activity && (
                        <div>
                          <span className="text-sm text-gray-500">License Activity</span>
                          <p className="font-medium">{vendorProfile.license_activity}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Company Type</span>
                        <p className="font-medium">{vendorProfile.company_type}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">License Expiry Date</span>
                        <p className="font-medium">{new Date(vendorProfile.license_expiry_date).toLocaleDateString()}</p>
                      </div>
                      {vendorProfile.establishment_date && (
                        <div>
                          <span className="text-sm text-gray-500">Establishment Date</span>
                          <p className="font-medium">{new Date(vendorProfile.establishment_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {vendorProfile.tax_registration_number && (
                        <div>
                          <span className="text-sm text-gray-500">Tax Registration Number</span>
                          <p className="font-medium">{vendorProfile.tax_registration_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Location */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Business Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Registered Office Address</span>
                      <p className="font-medium">{vendorProfile.registered_office_address}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Emirate</span>
                        <p className="font-medium">{vendorProfile.emirate}</p>
                      </div>
                      {vendorProfile.makani_number && (
                        <div>
                          <span className="text-sm text-gray-500">Makani Number</span>
                          <p className="font-medium">{vendorProfile.makani_number}</p>
                        </div>
                      )}
                    </div>
                    {vendorProfile.google_maps_url && (
                      <div>
                        <span className="text-sm text-gray-500">Google Maps</span>
                        <a 
                          href={vendorProfile.google_maps_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    )}
                    {vendorProfile.branch_locations && vendorProfile.branch_locations.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Branch Locations</span>
                        <ul className="mt-1 space-y-1">
                          {vendorProfile.branch_locations.map((location, index) => (
                            <li key={index} className="font-medium">• {location}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Authorized Person</span>
                        <p className="font-medium">{vendorProfile.authorized_person_name}</p>
                      </div>
                      {vendorProfile.designation && (
                        <div>
                          <span className="text-sm text-gray-500">Designation</span>
                          <p className="font-medium">{vendorProfile.designation}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">Business Email</span>
                        <p className="font-medium">{vendorProfile.business_email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Business Phone</span>
                        <p className="font-medium">{vendorProfile.business_phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {vendorProfile.whatsapp_number && (
                        <div>
                          <span className="text-sm text-gray-500">WhatsApp</span>
                          <p className="font-medium">{vendorProfile.whatsapp_number}</p>
                        </div>
                      )}
                      {vendorProfile.company_website && (
                        <div>
                          <span className="text-sm text-gray-500">Website</span>
                          <a 
                            href={vendorProfile.company_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {vendorProfile.company_website}
                          </a>
                        </div>
                      )}
                      {vendorProfile.linkedin_url && (
                        <div>
                          <span className="text-sm text-gray-500">LinkedIn</span>
                          <a 
                            href={vendorProfile.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            View LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Operations */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Business Operations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-500">Business Category</span>
                        <p className="font-medium">{vendorProfile.business_category}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Main Services Offered</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {vendorProfile.main_services_offered.map((service, index) => (
                            <Badge key={index} variant="secondary">{service}</Badge>
                          ))}
                        </div>
                      </div>
                      {vendorProfile.years_experience_uae && (
                        <div>
                          <span className="text-sm text-gray-500">Years of Experience in UAE</span>
                          <p className="font-medium">{vendorProfile.years_experience_uae} years</p>
                        </div>
                      )}
                      {vendorProfile.staff_strength && (
                        <div>
                          <span className="text-sm text-gray-500">Staff Strength</span>
                          <p className="font-medium">{vendorProfile.staff_strength} employees</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {vendorProfile.certifications && vendorProfile.certifications.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-500">Certifications</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {vendorProfile.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {vendorProfile.major_clients && vendorProfile.major_clients.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-500">Major Clients</span>
                          <ul className="mt-1 space-y-1">
                            {vendorProfile.major_clients.map((client, index) => (
                              <li key={index} className="font-medium">• {client}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance & Legal */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Compliance & Legal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">UAE Labour Law Compliance: {vendorProfile.uae_labour_law_compliance ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">MOHRE Requirements: {vendorProfile.mohre_requirements_compliance ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">VAT Compliance: {vendorProfile.vat_compliance ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {vendorProfile.insurance_details && (
                        <div>
                          <span className="text-sm text-gray-500">Insurance Details</span>
                          <p className="font-medium">{vendorProfile.insurance_details}</p>
                        </div>
                      )}
                      {vendorProfile.chamber_of_commerce_number && (
                        <div>
                          <span className="text-sm text-gray-500">Chamber of Commerce Number</span>
                          <p className="font-medium">{vendorProfile.chamber_of_commerce_number}</p>
                        </div>
                      )}
                      {vendorProfile.mohre_workers_count && (
                        <div>
                          <span className="text-sm text-gray-500">MOHRE Workers Count</span>
                          <p className="font-medium">{vendorProfile.mohre_workers_count}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* No Detailed Profile - Show Message */
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Detailed Profile Not Available</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Detailed Profile Not Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This vendor hasn't completed their detailed profile setup. 
                    The vendor needs to complete the vendor onboarding process to show comprehensive business information.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">For the Vendor:</h4>
                    <p className="text-blue-800 text-sm">
                      Please complete your vendor profile by going to the vendor onboarding section 
                      to provide detailed business information including company details, 
                      business location, contact information, and compliance status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Quotes */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <LoadingSpinner />
              ) : recentQuotes && recentQuotes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {quote.rfq?.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {quote.rfq?.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(quote.price, quote.currency)}
                          </div>
                          <Badge className={
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {quote.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{quote.message}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Delivery: {quote.delivery_time}</span>
                        <span>{formatDate(quote.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No quotes submitted yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <LoadingSpinner />
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.reviewer?.first_name} {review.reviewer?.last_name}
                          </h4>
                          {review.reviewer?.company_name && (
                            <p className="text-sm text-gray-600">
                              {review.reviewer.company_name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm font-medium">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                      )}
                      <div className="text-xs text-gray-500">
                        For: {review.rfq?.title} • {formatDate(review.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Email:</span>
                  <p className="font-medium">{vendor.email}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Phone:</span>
                  <p className="font-medium">{vendor.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Member Since:</span>
                  <p className="font-medium">{formatDate(vendor.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Quotes:</span>
                  <span className="font-medium">{vendor.total_quotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Average Rating:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(vendor.rating)}
                    <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Response Rate:</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
