import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  MessageCircle, 
  Send,
  AlertCircle
} from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

interface BidFormProps {
  jobId: string;
  onSubmit: (bidData: BidData) => void;
  isSubmitting?: boolean;
}

interface BidData {
  price: number;
  estimatedTime: string;
  message: string;
}

const BidForm: React.FC<BidFormProps> = ({ jobId, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState<BidData>({
    price: 0,
    estimatedTime: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Please provide estimated time';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
  };

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-600">
          <MessageCircle className="h-5 w-5" />
          Submit Your Bid
        </CardTitle>
        <CardDescription>
          Provide your quote and details to get hired for this job
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Price (AED) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="price"
                type="number"
                value={formData.price || ''}
                onChange={handleInputChange}
                placeholder="500"
                className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Time *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleInputChange}
                placeholder="e.g., 2-3 hours"
                className={`pl-10 ${errors.estimatedTime ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.estimatedTime && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.estimatedTime}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Customer *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Explain your approach, experience, and why you're the best fit for this job..."
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            {isSubmitting ? (
              'Submitting Bid...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Bid
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BidForm;
