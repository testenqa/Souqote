import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle, Circle, AlertCircle, Building, MapPin, User, Users, Briefcase, CreditCard, FileText, Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

// Import step components
import Step1CompanyInfo from './onboarding/Step1CompanyInfo';
import Step2BusinessLocation from './onboarding/Step2BusinessLocation';
import Step3ContactDetails from './onboarding/Step3ContactDetails';
import Step4OwnershipInfo from './onboarding/Step4OwnershipInfo';
import Step5BusinessOperations from './onboarding/Step5BusinessOperations';
import Step6BankingInfo from './onboarding/Step6BankingInfo';
import Step7Documents from './onboarding/Step7Documents';
import Step8Compliance from './onboarding/Step8Compliance';

import { VendorOnboardingData } from '../../types';

const VendorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VendorOnboardingData>({
    step1: {
      company_name_english: '',
      company_name_arabic: '',
      trade_license_number: '',
      issuing_authority: 'DED',
      license_activity: '',
      license_expiry_date: '',
      establishment_date: '',
      company_type: 'LLC',
      tax_registration_number: ''
    },
    step2: {
      registered_office_address: '',
      emirate: 'Dubai',
      branch_locations: [],
      google_maps_url: '',
      makani_number: ''
    },
    step3: {
      authorized_person_name: '',
      designation: '',
      business_email: '',
      business_phone: '',
      whatsapp_number: '',
      company_website: '',
      linkedin_url: '',
      social_media_links: []
    },
    step4: {
      company_owner_names: [],
      owner_nationalities: [],
      manager_name: '',
      authorized_signatory_name: ''
    },
    step5: {
      business_category: 'Technical_Services',
      main_services_offered: [],
      trade_license_activity_codes: [],
      years_experience_uae: 0,
      major_clients: [],
      staff_strength: 0,
      certifications: [],
      insurance_details: '',
      health_safety_compliance: false,
      labour_supply_approval_number: ''
    },
    step6: {
      bank_name: '',
      iban: '',
      account_name: ''
    },
    step7: {
      documents: [],
      document_types: []
    },
    step8: {
      free_zone_mainland_indicator: '',
      chamber_of_commerce_number: '',
      mohre_workers_count: 0,
      preferred_work_locations: [],
      languages_spoken: [],
      response_sla_hours: 24,
      availability_hours: '',
      uae_labour_law_compliance: false,
      mohre_requirements_compliance: false,
      vat_compliance: false
    }
  });

  // Redirect if not a vendor
  useEffect(() => {
    if (user && user.user_type !== 'vendor') {
      navigate('/');
      toast.error('Only vendors can access this page');
    }
  }, [user, navigate]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const steps = [
    {
      id: 1,
      title: 'Company Information',
      description: 'Basic company details and trade license',
      icon: Building,
      component: Step1CompanyInfo
    },
    {
      id: 2,
      title: 'Business Location',
      description: 'Office address and locations',
      icon: MapPin,
      component: Step2BusinessLocation
    },
    {
      id: 3,
      title: 'Contact Details',
      description: 'Authorized person and contact information',
      icon: User,
      component: Step3ContactDetails
    },
    {
      id: 4,
      title: 'Ownership Info',
      description: 'Company owners and management',
      icon: Users,
      component: Step4OwnershipInfo
    },
    {
      id: 5,
      title: 'Business Operations',
      description: 'Services, capabilities, and experience',
      icon: Briefcase,
      component: Step5BusinessOperations
    },
    {
      id: 6,
      title: 'Banking Information',
      description: 'Payment and banking details',
      icon: CreditCard,
      component: Step6BankingInfo
    },
    {
      id: 7,
      title: 'Documents',
      description: 'Upload required documents',
      icon: FileText,
      component: Step7Documents
    },
    {
      id: 8,
      title: 'Compliance & Final',
      description: 'Compliance checks and final details',
      icon: Shield,
      component: Step8Compliance
    }
  ];

  const updateFormData = (step: keyof VendorOnboardingData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting vendor profile:', formData);
      
      // Prepare the vendor profile data
      const vendorProfileData = {
        user_id: user.id,
        // Step 1: Company Information
        company_name_english: formData.step1.company_name_english,
        company_name_arabic: formData.step1.company_name_arabic || null,
        trade_license_number: formData.step1.trade_license_number,
        issuing_authority: formData.step1.issuing_authority,
        license_activity: formData.step1.license_activity || null,
        license_expiry_date: formData.step1.license_expiry_date,
        establishment_date: formData.step1.establishment_date || null,
        company_type: formData.step1.company_type,
        tax_registration_number: formData.step1.tax_registration_number || null,
        // Step 2: Business Location
        registered_office_address: formData.step2.registered_office_address,
        emirate: formData.step2.emirate,
        branch_locations: formData.step2.branch_locations || [],
        google_maps_url: formData.step2.google_maps_url || null,
        makani_number: formData.step2.makani_number || null,
        // Step 3: Contact Details
        authorized_person_name: formData.step3.authorized_person_name,
        designation: formData.step3.designation || null,
        business_email: formData.step3.business_email,
        business_phone: formData.step3.business_phone,
        whatsapp_number: formData.step3.whatsapp_number || null,
        company_website: formData.step3.company_website || null,
        linkedin_url: formData.step3.linkedin_url || null,
        social_media_links: formData.step3.social_media_links || [],
        // Step 4: Ownership Info
        company_owner_names: formData.step4.company_owner_names || [],
        owner_nationalities: formData.step4.owner_nationalities || [],
        manager_name: formData.step4.manager_name || null,
        authorized_signatory_name: formData.step4.authorized_signatory_name || null,
        // Step 5: Business Operations
        business_category: formData.step5.business_category,
        main_services_offered: formData.step5.main_services_offered || [],
        trade_license_activity_codes: formData.step5.trade_license_activity_codes || [],
        years_experience_uae: formData.step5.years_experience_uae || null,
        major_clients: formData.step5.major_clients || [],
        staff_strength: formData.step5.staff_strength || null,
        certifications: formData.step5.certifications || [],
        insurance_details: formData.step5.insurance_details || null,
        health_safety_compliance: formData.step5.health_safety_compliance,
        labour_supply_approval_number: formData.step5.labour_supply_approval_number || null,
        // Step 6: Banking Info
        bank_name: formData.step6.bank_name || null,
        iban: formData.step6.iban || null,
        account_name: formData.step6.account_name || null,
        // Step 8: Compliance
        free_zone_mainland_indicator: formData.step8.free_zone_mainland_indicator || null,
        chamber_of_commerce_number: formData.step8.chamber_of_commerce_number || null,
        mohre_workers_count: formData.step8.mohre_workers_count || null,
        preferred_work_locations: formData.step8.preferred_work_locations || [],
        languages_spoken: formData.step8.languages_spoken || [],
        response_sla_hours: formData.step8.response_sla_hours || 24,
        availability_hours: formData.step8.availability_hours || null,
        uae_labour_law_compliance: formData.step8.uae_labour_law_compliance,
        mohre_requirements_compliance: formData.step8.mohre_requirements_compliance,
        vat_compliance: formData.step8.vat_compliance,
        // Default values
        verification_status: 'pending',
        is_profile_complete: true,
        profile_completion_percentage: 100
      };

      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('vendor_profiles')
          .update(vendorProfileData)
          .eq('user_id', user.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('vendor_profiles')
          .insert([vendorProfileData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success('Vendor profile created successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error submitting profile:', error);
      toast.error(error.message || 'Failed to create vendor profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  if (!user || user.user_type !== 'vendor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Vendor Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set up your vendor profile to start bidding on RFQs. This process ensures compliance with UAE regulations and helps buyers trust your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Profile Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step) => {
                  const status = getStepStatus(step.id);
                  const Icon = step.icon;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        status === 'current' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => goToStep(step.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : status === 'current' ? (
                          <Circle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className={`text-sm font-medium ${
                            status === 'current' ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            Step {step.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {React.createElement(steps[currentStep - 1]?.icon, { className: "w-5 h-5" })}
                      <span>{steps[currentStep - 1]?.title}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {steps[currentStep - 1]?.description}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Step {currentStep} of {steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    data={formData[`step${currentStep}` as keyof VendorOnboardingData] as any}
                    updateData={(data: any) => updateFormData(`step${currentStep}` as keyof VendorOnboardingData, data)}
                    onNext={nextStep}
                    onPrev={prevStep}
                    isLastStep={currentStep === steps.length}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;
