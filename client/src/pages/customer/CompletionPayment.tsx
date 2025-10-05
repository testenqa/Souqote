import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Star, 
  Camera, 
  FileText, 
  Download, 
  ThumbsUp, 
  ThumbsDown,
  CreditCard,
  Smartphone,
  Clock,
  Shield,
  Award,
  MessageSquare,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  Receipt,
  Share2
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface WorkSummary {
  description: string;
  partsUsed: string[];
  beforePhotos: string[];
  afterPhotos: string[];
  totalCost: number;
  adjustments: number;
  professional: {
    name: string;
    rating: number;
    avatar: string;
  };
  warranty: {
    duration: number;
    startDate: string;
    endDate: string;
  };
}

const CompletionPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trackingData = location.state?.trackingData;
  
  const [workSummary, setWorkSummary] = useState<WorkSummary>({
    description: 'AC unit was not cooling properly due to a refrigerant leak. Replaced the faulty valve and recharged the system. Also cleaned the filters and checked the electrical connections.',
    partsUsed: [
      'Refrigerant R-410A (2kg)',
      'Expansion Valve',
      'Filter Drier',
      'Electrical Connectors'
    ],
    beforePhotos: ['/photos/before1.jpg', '/photos/before2.jpg'],
    afterPhotos: ['/photos/after1.jpg', '/photos/after2.jpg'],
    totalCost: 450,
    adjustments: 25,
    professional: {
      name: 'Ahmed Hassan',
      rating: 4.9,
      avatar: '/avatars/ahmed.jpg'
    },
    warranty: {
      duration: 90,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [tip, setTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const tipOptions = [0, 20, 50, 100];
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'apple_pay', name: 'Apple Pay', icon: Smartphone },
    { id: 'tabby', name: 'Tabby', icon: Clock },
    { id: 'tamara', name: 'Tamara', icon: Clock }
  ];

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentCompleted(true);
    }, 2000);
  };

  const handleSubmitReview = () => {
    // Submit review logic
    console.log('Review submitted:', { rating, review });
    navigate('/customer/dashboard');
  };

  const finalTotal = workSummary.totalCost + workSummary.adjustments + tip;
  const vat = finalTotal * 0.05;
  const grandTotal = finalTotal + vat;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Completed</h1>
              <p className="text-gray-600 mt-1">Review the work and complete payment</p>
            </div>
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Work Summary</CardTitle>
                <CardDescription>
                  Details of the work performed by {workSummary.professional.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Work Description</h3>
                  <p className="text-gray-700">{workSummary.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Parts Used</h3>
                  <div className="space-y-1">
                    {workSummary.partsUsed.map((part, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{part}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before/After Photos */}
                <div>
                  <h3 className="font-semibold mb-2">Before & After Photos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Before</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {workSummary.beforePhotos.map((photo, index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">After</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {workSummary.afterPhotos.map((photo, index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warranty Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-green-900">Warranty Included</h3>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {workSummary.warranty.duration}-day warranty valid until {workSummary.warranty.endDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Review Section */}
            <Card>
              <CardHeader>
                <CardTitle>Rate Your Experience</CardTitle>
                <CardDescription>
                  Help other customers by sharing your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {workSummary.professional.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{workSummary.professional.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{workSummary.professional.rating}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write a Review (Optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share details about your experience..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Professional
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    On Time
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Quality Work
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>AED {workSummary.totalCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Adjustments</span>
                  <span>AED {workSummary.adjustments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>AED {finalTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (5%)</span>
                  <span>AED {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tip</span>
                  <span>AED {tip}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>AED {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tip Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Add Tip (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {tipOptions.map((amount) => (
                    <Button
                      key={amount}
                      variant={tip === amount ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTip(amount)}
                    >
                      {amount === 0 ? 'No Tip' : `AED ${amount}`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        paymentMethod === method.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium">{method.name}</span>
                        {paymentMethod === method.id && (
                          <CheckCircle className="h-4 w-4 text-pink-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!paymentCompleted ? (
                <Button 
                  onClick={() => setShowPayment(true)}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay AED {grandTotal.toFixed(2)}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={handleSubmitReview}
                    className="w-full"
                    size="lg"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    Submit Review
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Professional
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Again
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Experience
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>
                Total Amount: AED {grandTotal.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>AED {workSummary.totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adjustments:</span>
                    <span>AED {workSummary.adjustments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (5%):</span>
                    <span>AED {vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip:</span>
                    <span>AED {tip}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total:</span>
                    <span>AED {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handlePayment}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPayment(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompletionPayment;
