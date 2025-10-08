import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { AlertCircle, Building, FileText, Calendar, Hash } from 'lucide-react';
import { VendorOnboardingStep1, CompanyType, IssuingAuthority } from '../../../types';

interface Step1CompanyInfoProps {
  data: VendorOnboardingStep1;
  updateData: (data: Partial<VendorOnboardingStep1>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step1CompanyInfo: React.FC<Step1CompanyInfoProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleInputChange = (field: keyof VendorOnboardingStep1, value: any) => {
    updateData({ [field]: value });
  };

  const isStepValid = () => {
    return (
      data.company_name_english.trim() !== '' &&
      data.trade_license_number.trim() !== '' &&
      data.issuing_authority &&
      data.license_expiry_date &&
      data.company_type
    );
  };

  const handleNext = () => {
    if (isStepValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">UAE Compliance Required</h3>
            <p className="text-sm text-blue-700 mt-1">
              All information must match your official trade license. This ensures compliance with UAE regulations and builds trust with buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company_name_english" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Company Name (English) *</span>
          </Label>
          <Input
            id="company_name_english"
            value={data.company_name_english}
            onChange={(e) => handleInputChange('company_name_english', e.target.value)}
            placeholder="e.g., ABC Technical Services LLC"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Must match your trade license exactly</p>
        </div>

        <div>
          <Label htmlFor="company_name_arabic" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Company Name (Arabic)</span>
          </Label>
          <Input
            id="company_name_arabic"
            value={data.company_name_arabic || ''}
            onChange={(e) => handleInputChange('company_name_arabic', e.target.value)}
            placeholder="اسم الشركة بالعربية"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Optional - Arabic name if available</p>
        </div>
      </div>

      {/* Trade License Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trade_license_number" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Trade License Number *</span>
          </Label>
          <Input
            id="trade_license_number"
            value={data.trade_license_number}
            onChange={(e) => handleInputChange('trade_license_number', e.target.value)}
            placeholder="e.g., 1234567"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">As shown on your trade license</p>
        </div>

        <div>
          <Label htmlFor="issuing_authority" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Issuing Authority *</span>
          </Label>
          <Select
            value={data.issuing_authority}
            onValueChange={(value) => handleInputChange('issuing_authority', value as IssuingAuthority)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select issuing authority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DED">Dubai Economy & Tourism (DED)</SelectItem>
              <SelectItem value="DMCC">Dubai Multi Commodities Centre (DMCC)</SelectItem>
              <SelectItem value="DIFC">Dubai International Financial Centre (DIFC)</SelectItem>
              <SelectItem value="JAFZA">Jebel Ali Free Zone (JAFZA)</SelectItem>
              <SelectItem value="ADGM">Abu Dhabi Global Market (ADGM)</SelectItem>
              <SelectItem value="SHAMS">Sharjah Media City (SHAMS)</SelectItem>
              <SelectItem value="RAK_ICC">Ras Al Khaimah International Corporate Centre</SelectItem>
              <SelectItem value="Fujairah_Creative_City">Fujairah Creative City</SelectItem>
              <SelectItem value="Ministry_of_Economy">Ministry of Economy</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* License Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="license_activity">License Activity / Business Type</Label>
          <Input
            id="license_activity"
            value={data.license_activity || ''}
            onChange={(e) => handleInputChange('license_activity', e.target.value)}
            placeholder="e.g., Technical Services, Manpower Supply"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Main business activity as per license</p>
        </div>

        <div>
          <Label htmlFor="company_type" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Company Type *</span>
          </Label>
          <Select
            value={data.company_type}
            onValueChange={(value) => handleInputChange('company_type', value as CompanyType)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
              <SelectItem value="Sole_Proprietorship">Sole Proprietorship</SelectItem>
              <SelectItem value="Branch">Branch Office</SelectItem>
              <SelectItem value="Free_Zone">Free Zone Company</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="license_expiry_date" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>License Expiry Date *</span>
          </Label>
          <Input
            id="license_expiry_date"
            type="date"
            value={data.license_expiry_date}
            onChange={(e) => handleInputChange('license_expiry_date', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">License must be active and valid</p>
        </div>

        <div>
          <Label htmlFor="establishment_date" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Establishment Date</span>
          </Label>
          <Input
            id="establishment_date"
            type="date"
            value={data.establishment_date || ''}
            onChange={(e) => handleInputChange('establishment_date', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">When the company was established</p>
        </div>
      </div>

      {/* Tax Registration */}
      <div>
        <Label htmlFor="tax_registration_number" className="flex items-center space-x-2">
          <Hash className="w-4 h-4" />
          <span>Tax Registration Number (TRN)</span>
        </Label>
        <Input
          id="tax_registration_number"
          value={data.tax_registration_number || ''}
          onChange={(e) => handleInputChange('tax_registration_number', e.target.value)}
          placeholder="e.g., 100000000000003"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          VAT registration number issued by Federal Tax Authority (FTA)
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={true} // First step, no previous
        >
          Previous
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Business Location
        </Button>
      </div>
    </div>
  );
};

export default Step1CompanyInfo;
