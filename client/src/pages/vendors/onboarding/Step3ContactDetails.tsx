import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { User, Mail, Phone, Globe, Linkedin } from 'lucide-react';
import { VendorOnboardingStep3 } from '../../../types';

interface Step3ContactDetailsProps {
  data: VendorOnboardingStep3;
  updateData: (data: Partial<VendorOnboardingStep3>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step3ContactDetails: React.FC<Step3ContactDetailsProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleInputChange = (field: keyof VendorOnboardingStep3, value: any) => {
    updateData({ [field]: value });
  };

  const isStepValid = () => {
    return (
      data.authorized_person_name.trim() !== '' &&
      data.business_email.trim() !== '' &&
      data.business_phone.trim() !== ''
    );
  };

  const handleNext = () => {
    if (isStepValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="authorized_person_name" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Authorized Person Name *</span>
          </Label>
          <Input
            id="authorized_person_name"
            value={data.authorized_person_name}
            onChange={(e) => handleInputChange('authorized_person_name', e.target.value)}
            placeholder="e.g., Ahmed Al Mansoori"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={data.designation || ''}
            onChange={(e) => handleInputChange('designation', e.target.value)}
            placeholder="e.g., General Manager"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_email" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Business Email *</span>
          </Label>
          <Input
            id="business_email"
            type="email"
            value={data.business_email}
            onChange={(e) => handleInputChange('business_email', e.target.value)}
            placeholder="info@company.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="business_phone" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Business Phone *</span>
          </Label>
          <Input
            id="business_phone"
            value={data.business_phone}
            onChange={(e) => handleInputChange('business_phone', e.target.value)}
            placeholder="+971 4 123 4567"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
          <Input
            id="whatsapp_number"
            value={data.whatsapp_number || ''}
            onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
            placeholder="+971 50 123 4567"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="company_website" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Company Website</span>
          </Label>
          <Input
            id="company_website"
            value={data.company_website || ''}
            onChange={(e) => handleInputChange('company_website', e.target.value)}
            placeholder="https://www.company.com"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="linkedin_url" className="flex items-center space-x-2">
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn Profile</span>
        </Label>
        <Input
          id="linkedin_url"
          value={data.linkedin_url || ''}
          onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
          placeholder="https://linkedin.com/company/..."
          className="mt-1"
        />
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous: Business Location
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Ownership Info
        </Button>
      </div>
    </div>
  );
};

export default Step3ContactDetails;
