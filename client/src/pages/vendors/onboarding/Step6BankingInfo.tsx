import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { CreditCard, Building } from 'lucide-react';
import { VendorOnboardingStep6 } from '../../../types';

interface Step6BankingInfoProps {
  data: VendorOnboardingStep6;
  updateData: (data: Partial<VendorOnboardingStep6>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step6BankingInfo: React.FC<Step6BankingInfoProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleInputChange = (field: keyof VendorOnboardingStep6, value: any) => {
    updateData({ [field]: value });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Secure Information:</strong> Banking details are encrypted and only used for payment processing. 
          This information is required for invoice payments.
        </p>
      </div>

      <div>
        <Label htmlFor="bank_name" className="flex items-center space-x-2">
          <Building className="w-4 h-4" />
          <span>Bank Name</span>
        </Label>
        <Input
          id="bank_name"
          value={data.bank_name || ''}
          onChange={(e) => handleInputChange('bank_name', e.target.value)}
          placeholder="e.g., Emirates NBD, ADCB, FAB"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="iban" className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4" />
          <span>IBAN</span>
        </Label>
        <Input
          id="iban"
          value={data.iban || ''}
          onChange={(e) => handleInputChange('iban', e.target.value)}
          placeholder="AE07 0331 2345 6789 0123 456"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">International Bank Account Number</p>
      </div>

      <div>
        <Label htmlFor="account_name">Account Name</Label>
        <Input
          id="account_name"
          value={data.account_name || ''}
          onChange={(e) => handleInputChange('account_name', e.target.value)}
          placeholder="Must match your company legal name"
          className="mt-1"
        />
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous: Business Operations
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Documents
        </Button>
      </div>
    </div>
  );
};

export default Step6BankingInfo;
