import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Users } from 'lucide-react';
import { VendorOnboardingStep4 } from '../../../types';

interface Step4OwnershipInfoProps {
  data: VendorOnboardingStep4;
  updateData: (data: Partial<VendorOnboardingStep4>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step4OwnershipInfo: React.FC<Step4OwnershipInfoProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleInputChange = (field: keyof VendorOnboardingStep4, value: any) => {
    updateData({ [field]: value });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This information is optional and helps with business verification. 
          Only provide information that is publicly available on your trade license.
        </p>
      </div>

      <div>
        <Label htmlFor="manager_name" className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Manager Name</span>
        </Label>
        <Input
          id="manager_name"
          value={data.manager_name || ''}
          onChange={(e) => handleInputChange('manager_name', e.target.value)}
          placeholder="As per trade license"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="authorized_signatory_name">Authorized Signatory Name</Label>
        <Input
          id="authorized_signatory_name"
          value={data.authorized_signatory_name || ''}
          onChange={(e) => handleInputChange('authorized_signatory_name', e.target.value)}
          placeholder="Person authorized to sign contracts"
          className="mt-1"
        />
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous: Contact Details
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Business Operations
        </Button>
      </div>
    </div>
  );
};

export default Step4OwnershipInfo;
