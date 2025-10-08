import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { MapPin, Plus, X, ExternalLink } from 'lucide-react';
import { VendorOnboardingStep2, Emirates } from '../../../types';

interface Step2BusinessLocationProps {
  data: VendorOnboardingStep2;
  updateData: (data: Partial<VendorOnboardingStep2>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step2BusinessLocation: React.FC<Step2BusinessLocationProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const [newBranchLocation, setNewBranchLocation] = useState('');

  const handleInputChange = (field: keyof VendorOnboardingStep2, value: any) => {
    updateData({ [field]: value });
  };

  const addBranchLocation = () => {
    if (newBranchLocation.trim() && !data.branch_locations?.includes(newBranchLocation.trim())) {
      const updatedLocations = [...(data.branch_locations || []), newBranchLocation.trim()];
      handleInputChange('branch_locations', updatedLocations);
      setNewBranchLocation('');
    }
  };

  const removeBranchLocation = (location: string) => {
    const updatedLocations = data.branch_locations?.filter(loc => loc !== location) || [];
    handleInputChange('branch_locations', updatedLocations);
  };

  const isStepValid = () => {
    return (
      data.registered_office_address.trim() !== '' &&
      data.emirate
    );
  };

  const handleNext = () => {
    if (isStepValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Office Address */}
      <div>
        <Label htmlFor="registered_office_address" className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Registered Office Address *</span>
        </Label>
        <textarea
          id="registered_office_address"
          value={data.registered_office_address}
          onChange={(e) => handleInputChange('registered_office_address', e.target.value)}
          placeholder="Enter complete address including building name, floor, area, city"
          rows={3}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Must match the address on your trade license</p>
      </div>

      {/* Emirate */}
      <div>
        <Label htmlFor="emirate" className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Emirate *</span>
        </Label>
        <Select
          value={data.emirate}
          onValueChange={(value) => handleInputChange('emirate', value as Emirates)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select emirate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dubai">Dubai</SelectItem>
            <SelectItem value="Abu_Dhabi">Abu Dhabi</SelectItem>
            <SelectItem value="Sharjah">Sharjah</SelectItem>
            <SelectItem value="Ajman">Ajman</SelectItem>
            <SelectItem value="Umm_Al_Quwain">Umm Al Quwain</SelectItem>
            <SelectItem value="Ras_Al_Khaimah">Ras Al Khaimah</SelectItem>
            <SelectItem value="Fujairah">Fujairah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Branch Locations */}
      <div>
        <Label className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Branch Locations (Optional)</span>
        </Label>
        <div className="mt-1 space-y-2">
          {data.branch_locations?.map((location, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={location}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeBranchLocation(location)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center space-x-2">
            <Input
              value={newBranchLocation}
              onChange={(e) => setNewBranchLocation(e.target.value)}
              placeholder="Add branch location"
              onKeyPress={(e) => e.key === 'Enter' && addBranchLocation()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBranchLocation}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Add any additional office or branch locations</p>
      </div>

      {/* Google Maps & Makani */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="google_maps_url" className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4" />
            <span>Google Maps Link</span>
          </Label>
          <Input
            id="google_maps_url"
            value={data.google_maps_url || ''}
            onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
            placeholder="https://maps.google.com/..."
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Optional - helps with location verification</p>
        </div>

        <div>
          <Label htmlFor="makani_number">Makani Number</Label>
          <Input
            id="makani_number"
            value={data.makani_number || ''}
            onChange={(e) => handleInputChange('makani_number', e.target.value)}
            placeholder="e.g., 12345 67890"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Optional - UAE government location code</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
        >
          Previous: Company Info
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Contact Details
        </Button>
      </div>
    </div>
  );
};

export default Step2BusinessLocation;
