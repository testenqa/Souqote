import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Briefcase, Users, Calendar } from 'lucide-react';
import { VendorOnboardingStep5, BusinessCategory } from '../../../types';

interface Step5BusinessOperationsProps {
  data: VendorOnboardingStep5;
  updateData: (data: Partial<VendorOnboardingStep5>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step5BusinessOperations: React.FC<Step5BusinessOperationsProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleInputChange = (field: keyof VendorOnboardingStep5, value: any) => {
    updateData({ [field]: value });
  };

  const isStepValid = () => {
    return data.business_category && data.years_experience_uae !== undefined;
  };

  const handleNext = () => {
    if (isStepValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="business_category" className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4" />
          <span>Business Category *</span>
        </Label>
        <Select
          value={data.business_category}
          onValueChange={(value) => handleInputChange('business_category', value as BusinessCategory)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your main business category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Manpower_Supply">Manpower Supply</SelectItem>
            <SelectItem value="MEP_Services">MEP Services</SelectItem>
            <SelectItem value="Civil_Works">Civil Works</SelectItem>
            <SelectItem value="Facility_Management">Facility Management</SelectItem>
            <SelectItem value="HVAC">HVAC Services</SelectItem>
            <SelectItem value="Plumbing">Plumbing</SelectItem>
            <SelectItem value="Electrical">Electrical Services</SelectItem>
            <SelectItem value="Building_Maintenance">Building Maintenance</SelectItem>
            <SelectItem value="Technical_Services">Technical Services</SelectItem>
            <SelectItem value="Engineering_Consultancy">Engineering Consultancy</SelectItem>
            <SelectItem value="IT_Services">IT Services</SelectItem>
            <SelectItem value="Security_Services">Security Services</SelectItem>
            <SelectItem value="Cleaning_Services">Cleaning Services</SelectItem>
            <SelectItem value="Landscaping">Landscaping</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="years_experience_uae" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Years of Experience in UAE *</span>
          </Label>
          <Input
            id="years_experience_uae"
            type="number"
            min="0"
            value={data.years_experience_uae || 0}
            onChange={(e) => handleInputChange('years_experience_uae', parseInt(e.target.value) || 0)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="staff_strength" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Staff Strength (Approx)</span>
          </Label>
          <Input
            id="staff_strength"
            type="number"
            min="0"
            value={data.staff_strength || 0}
            onChange={(e) => handleInputChange('staff_strength', parseInt(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="insurance_details">Insurance Details</Label>
        <textarea
          id="insurance_details"
          value={data.insurance_details || ''}
          onChange={(e) => handleInputChange('insurance_details', e.target.value)}
          placeholder="Workmen Compensation, Public Liability, etc."
          rows={3}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous: Ownership Info
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Banking Info
        </Button>
      </div>
    </div>
  );
};

export default Step5BusinessOperations;
