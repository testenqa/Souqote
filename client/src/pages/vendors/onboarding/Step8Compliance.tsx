import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { VendorOnboardingStep8 } from '../../../types';

interface Step8ComplianceProps {
  data: VendorOnboardingStep8;
  updateData: (data: Partial<VendorOnboardingStep8>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step8Compliance: React.FC<Step8ComplianceProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleInputChange = (field: keyof VendorOnboardingStep8, value: any) => {
    updateData({ [field]: value });
  };

  const handleCheckboxChange = (field: keyof VendorOnboardingStep8, checked: boolean) => {
    updateData({ [field]: checked });
  };

  const isStepValid = () => {
    return (
      data.uae_labour_law_compliance &&
      data.mohre_requirements_compliance &&
      data.vat_compliance
    );
  };

  const handleSubmit = () => {
    if (isStepValid()) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-900">Final Step - Compliance</h3>
            <p className="text-sm text-green-700 mt-1">
              Confirm your compliance with UAE regulations to complete your vendor profile setup.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="response_sla_hours" className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Response SLA (Hours)</span>
        </Label>
        <Input
          id="response_sla_hours"
          type="number"
          min="1"
          value={data.response_sla_hours}
          onChange={(e) => handleInputChange('response_sla_hours', parseInt(e.target.value) || 24)}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">How quickly you respond to RFQs (in hours)</p>
      </div>

      <div>
        <Label htmlFor="availability_hours">Availability Hours</Label>
        <Input
          id="availability_hours"
          value={data.availability_hours || ''}
          onChange={(e) => handleInputChange('availability_hours', e.target.value)}
          placeholder="e.g., 8:00 AM - 6:00 PM, Sunday - Thursday"
          className="mt-1"
        />
      </div>

      {/* Compliance Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Compliance Confirmations</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="uae_labour_law_compliance"
              checked={data.uae_labour_law_compliance}
              onCheckedChange={(checked) => handleCheckboxChange('uae_labour_law_compliance', checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="uae_labour_law_compliance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                UAE Labour Law Compliance *
              </Label>
              <p className="text-xs text-gray-500">
                We comply with UAE Labour Law and maintain proper employment records
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="mohre_requirements_compliance"
              checked={data.mohre_requirements_compliance}
              onCheckedChange={(checked) => handleCheckboxChange('mohre_requirements_compliance', checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="mohre_requirements_compliance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                MOHRE Requirements Compliance *
              </Label>
              <p className="text-xs text-gray-500">
                We comply with Ministry of Human Resources and Emiratisation requirements
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="vat_compliance"
              checked={data.vat_compliance}
              onCheckedChange={(checked) => handleCheckboxChange('vat_compliance', checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="vat_compliance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                VAT Compliance *
              </Label>
              <p className="text-xs text-gray-500">
                We are registered for VAT and comply with Federal Tax Authority requirements
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isStepValid() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-900">Compliance Required</h3>
              <p className="text-sm text-red-700 mt-1">
                Please confirm all compliance requirements to complete your vendor profile.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous: Documents
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isStepValid() || isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Creating Profile...' : 'Complete Vendor Profile'}
        </Button>
      </div>
    </div>
  );
};

export default Step8Compliance;
