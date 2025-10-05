import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Video, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  DollarSign,
  Star,
  MessageSquare
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface ServiceScopingData {
  category: string;
  issue: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredTime: string;
  timeSlot: string;
  accessNotes: string;
  photos: File[];
  videos: File[];
  pricingType: 'fixed' | 'quote';
  budget?: number;
  location: {
    address: string;
    building: string;
    apartment: string;
    floor: string;
    parking: boolean;
    nocRequired: boolean;
  };
}

const ServiceScoping: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ServiceScopingData>({
    category: searchParams.get('category') || '',
    issue: '',
    description: '',
    urgency: 'medium',
    preferredTime: '',
    timeSlot: '',
    accessNotes: '',
    photos: [],
    videos: [],
    pricingType: 'quote',
    location: {
      address: '',
      building: '',
      apartment: '',
      floor: '',
      parking: false,
      nocRequired: false
    }
  });

  const steps = [
    { id: 1, title: 'What\'s the issue?', description: 'Describe your problem' },
    { id: 2, title: 'When do you need it?', description: 'Choose timing' },
    { id: 3, title: 'Add details', description: 'Photos, videos, notes' },
    { id: 4, title: 'Pricing', description: 'Fixed price or get quotes' },
    { id: 5, title: 'Location', description: 'Where should we come?' },
    { id: 6, title: 'Review', description: 'Confirm your request' }
  ];

  const urgencyOptions = [
    { value: 'emergency', label: 'Emergency', description: 'Within 2 hours', color: 'bg-red-500' },
    { value: 'high', label: 'Urgent', description: 'Today', color: 'bg-orange-500' },
    { value: 'medium', label: 'Normal', description: 'Within 2-3 days', color: 'bg-yellow-500' },
    { value: 'low', label: 'Flexible', description: 'This week', color: 'bg-green-500' }
  ];

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically save the data and navigate to provider selection
    console.log('Service scoping data:', formData);
    navigate('/providers', { state: { serviceData: formData } });
  };

  const handleFileUpload = (files: FileList, type: 'photos' | 'videos') => {
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFiles]
    }));
  };

  const removeFile = (index: number, type: 'photos' | 'videos') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's the main issue?
              </label>
              <Input
                value={formData.issue}
                onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                placeholder="e.g., AC not cooling, water leak, power outage"
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the problem in detail
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide more details about the issue, when it started, what you've tried, etc."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How urgent is this?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {urgencyOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      formData.urgency === option.value 
                        ? 'ring-2 ring-pink-500 bg-pink-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, urgency: option.value as any }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${option.color} rounded-full`}></div>
                        <div>
                          <h3 className="font-medium">{option.label}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When would you like the service?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={formData.preferredTime === 'asap' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, preferredTime: 'asap' }))}
                  className="h-12"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  ASAP
                </Button>
                <Button
                  variant={formData.preferredTime === 'schedule' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, preferredTime: 'schedule' }))}
                  className="h-12"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
            {formData.preferredTime === 'schedule' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a time slot
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map((slot) => (
                    <Card
                      key={slot}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.timeSlot === slot 
                          ? 'ring-2 ring-pink-500 bg-pink-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                    >
                      <CardContent className="p-3">
                        <p className="font-medium">{slot}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add photos (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload photos of the issue</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'photos')}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photos
                  </Button>
                </label>
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.photos.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6 text-gray-400" />
                        </div>
                        <button
                          onClick={() => removeFile(index, 'photos')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access notes (optional)
              </label>
              <textarea
                value={formData.accessNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, accessNotes: e.target.value }))}
                placeholder="Any special instructions for accessing your property? (gate code, parking, building access, etc.)"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How would you like to handle pricing?
              </label>
              <div className="space-y-4">
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    formData.pricingType === 'fixed' 
                      ? 'ring-2 ring-pink-500 bg-pink-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, pricingType: 'fixed' }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="font-semibold">Fixed Price</h3>
                        <p className="text-sm text-gray-600">Pay a set amount for standard services</p>
                        <div className="mt-2">
                          <Input
                            type="number"
                            placeholder="Your budget (AED)"
                            value={formData.budget || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                            className="w-32"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    formData.pricingType === 'quote' 
                      ? 'ring-2 ring-pink-500 bg-pink-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, pricingType: 'quote' }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-6 w-6 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">Get Quotes</h3>
                        <p className="text-sm text-gray-600">Compare prices from multiple professionals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <Input
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="Enter your complete address"
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Name
                </label>
                <Input
                  value={formData.location.building}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, building: e.target.value }
                  }))}
                  placeholder="Building name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment Number
                </label>
                <Input
                  value={formData.location.apartment}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, apartment: e.target.value }
                  }))}
                  placeholder="Apt #"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor
              </label>
              <Input
                value={formData.location.floor}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, floor: e.target.value }
                }))}
                placeholder="Floor number"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="parking"
                  checked={formData.location.parking}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, parking: e.target.checked }
                  }))}
                  className="rounded"
                />
                <label htmlFor="parking" className="text-sm text-gray-700">
                  Parking available for the professional
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="noc"
                  checked={formData.location.nocRequired}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, nocRequired: e.target.checked }
                  }))}
                  className="rounded"
                />
                <label htmlFor="noc" className="text-sm text-gray-700">
                  NOC required for building access
                </label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Service Request Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue:</span>
                  <span className="font-medium">{formData.issue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgency:</span>
                  <Badge variant="secondary">
                    {urgencyOptions.find(opt => opt.value === formData.urgency)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timing:</span>
                  <span className="font-medium">
                    {formData.preferredTime === 'asap' ? 'ASAP' : formData.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pricing:</span>
                  <span className="font-medium">
                    {formData.pricingType === 'fixed' ? `Fixed - AED ${formData.budget}` : 'Get Quotes'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{formData.location.address}</span>
                </div>
                {formData.photos.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Photos:</span>
                    <span className="font-medium">{formData.photos.length} uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h1>
                <p className="text-sm text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  index < currentStep 
                    ? 'bg-pink-500' 
                    : index === currentStep - 1 
                    ? 'bg-pink-300' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !formData.issue) ||
              (currentStep === 2 && !formData.preferredTime) ||
              (currentStep === 5 && !formData.location.address)
            }
          >
            {currentStep === steps.length ? 'Submit Request' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceScoping;
