import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Clock, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  Plus,
  Minus,
  Info,
  AlertCircle,
  Building,
  Car,
  Key
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface BookingData {
  serviceData: any;
  selectedProviders: any[];
  selectedTimeSlot: string;
  address: {
    fullAddress: string;
    building: string;
    apartment: string;
    floor: string;
    parking: boolean;
    nocRequired: boolean;
    accessInstructions: string;
  };
  addOns: {
    materials: boolean;
    disposal: boolean;
    extendedWarranty: boolean;
  };
  promoCode: string;
  paymentMethod: 'card' | 'apple_pay' | 'tabby' | 'tamara' | 'cash';
  tip: number;
  notes: string;
}

const BookingCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceData, selectedProviders } = location.state || {};
  
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceData,
    selectedProviders,
    selectedTimeSlot: '',
    address: {
      fullAddress: serviceData?.location?.address || '',
      building: serviceData?.location?.building || '',
      apartment: serviceData?.location?.apartment || '',
      floor: serviceData?.location?.floor || '',
      parking: serviceData?.location?.parking || false,
      nocRequired: serviceData?.location?.nocRequired || false,
      accessInstructions: serviceData?.accessNotes || ''
    },
    addOns: {
      materials: false,
      disposal: false,
      extendedWarranty: false
    },
    promoCode: '',
    paymentMethod: 'card',
    tip: 0,
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [promoApplied, setPromoApplied] = useState(false);

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM'
  ];

  const addOns = [
    {
      id: 'materials',
      name: 'Materials & Supplies',
      description: 'Professional will bring required materials',
      price: 50,
      icon: Plus
    },
    {
      id: 'disposal',
      name: 'Waste Disposal',
      description: 'Dispose of old parts and waste materials',
      price: 25,
      icon: Minus
    },
    {
      id: 'extendedWarranty',
      name: 'Extended Warranty',
      description: '90-day warranty on all work',
      price: 30,
      icon: Shield
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: Smartphone,
      description: 'Pay with Touch ID or Face ID'
    },
    {
      id: 'tabby',
      name: 'Tabby',
      icon: Clock,
      description: 'Pay in 4 interest-free installments'
    },
    {
      id: 'tamara',
      name: 'Tamara',
      icon: Clock,
      description: 'Buy now, pay later'
    },
    {
      id: 'cash',
      name: 'Cash on Service',
      icon: CreditCard,
      description: 'Pay when the professional arrives'
    }
  ];

  const calculateTotal = () => {
    const basePrice = selectedProviders?.[0]?.price || 0;
    const addOnsTotal = Object.entries(bookingData.addOns)
      .filter(([_, selected]) => selected)
      .reduce((total, [key, _]) => {
        const addOn = addOns.find(a => a.id === key);
        return total + (addOn?.price || 0);
      }, 0);
    
    const subtotal = basePrice + addOnsTotal;
    const vat = subtotal * 0.05; // 5% VAT
    const total = subtotal + vat + bookingData.tip;
    
    return { subtotal, vat, total };
  };

  const handlePromoCode = () => {
    // Mock promo code validation
    if (bookingData.promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    }
  };

  const handleBooking = () => {
    // Here you would typically process the booking
    console.log('Booking data:', bookingData);
    navigate('/tracking', { state: { bookingData } });
  };

  const { subtotal, vat, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-1">Review and confirm your service request</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{serviceData?.issue}</h3>
                    <p className="text-sm text-gray-600">{serviceData?.description}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge variant="secondary">
                      {serviceData?.urgency} Priority
                    </Badge>
                    <span className="text-gray-600">
                      {serviceData?.preferredTime === 'asap' ? 'ASAP' : serviceData?.timeSlot}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Professional */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Professional</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProviders?.[0] && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">
                        {selectedProviders[0].name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedProviders[0].name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>⭐ {selectedProviders[0].rating}</span>
                        <span>•</span>
                        <span>{selectedProviders[0].completedJobs} jobs completed</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Time Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={bookingData.selectedTimeSlot === slot ? 'default' : 'outline'}
                      onClick={() => setBookingData(prev => ({ ...prev, selectedTimeSlot: slot }))}
                      className="h-12"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {slot}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Address Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <Input
                    value={bookingData.address.fullAddress}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      address: { ...prev.address, fullAddress: e.target.value }
                    }))}
                    placeholder="Enter complete address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building Name
                    </label>
                    <Input
                      value={bookingData.address.building}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        address: { ...prev.address, building: e.target.value }
                      }))}
                      placeholder="Building name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apartment Number
                    </label>
                    <Input
                      value={bookingData.address.apartment}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        address: { ...prev.address, apartment: e.target.value }
                      }))}
                      placeholder="Apt #"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <Input
                    value={bookingData.address.floor}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      address: { ...prev.address, floor: e.target.value }
                    }))}
                    placeholder="Floor number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Instructions
                  </label>
                  <textarea
                    value={bookingData.address.accessInstructions}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      address: { ...prev.address, accessInstructions: e.target.value }
                    }))}
                    placeholder="Gate code, parking instructions, building access details..."
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="parking"
                      checked={bookingData.address.parking}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        address: { ...prev.address, parking: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="parking" className="text-sm text-gray-700">
                      <Car className="h-4 w-4 inline mr-1" />
                      Parking available for professional
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="noc"
                      checked={bookingData.address.nocRequired}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        address: { ...prev.address, nocRequired: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="noc" className="text-sm text-gray-700">
                      <Building className="h-4 w-4 inline mr-1" />
                      NOC required for building access
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle>Add-ons (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        bookingData.addOns[addOn.id as keyof typeof bookingData.addOns]
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingData(prev => ({
                        ...prev,
                        addOns: {
                          ...prev.addOns,
                          [addOn.id]: !prev.addOns[addOn.id as keyof typeof prev.addOns]
                        }
                      }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <addOn.icon className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium">{addOn.name}</h3>
                            <p className="text-sm text-gray-600">{addOn.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">AED {addOn.price}</div>
                          {bookingData.addOns[addOn.id as keyof typeof bookingData.addOns] && (
                            <CheckCircle className="h-5 w-5 text-pink-500 mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
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
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        bookingData.paymentMethod === method.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                    >
                      <div className="flex items-center space-x-3">
                        <method.icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {bookingData.paymentMethod === method.id && (
                          <CheckCircle className="h-5 w-5 text-pink-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special instructions or requirements..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>AED {selectedProviders?.[0]?.price || 0}</span>
                  </div>
                  {Object.entries(bookingData.addOns)
                    .filter(([_, selected]) => selected)
                    .map(([key, _]) => {
                      const addOn = addOns.find(a => a.id === key);
                      return (
                        <div key={key} className="flex justify-between text-sm">
                          <span>{addOn?.name}</span>
                          <span>AED {addOn?.price}</span>
                        </div>
                      );
                    })}
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>AED {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (5%)</span>
                    <span>AED {vat.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Promo Discount</span>
                      <span>-AED 10</span>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Promo code"
                      value={bookingData.promoCode}
                      onChange={(e) => setBookingData(prev => ({ ...prev, promoCode: e.target.value }))}
                      className="flex-1"
                    />
                    <Button onClick={handlePromoCode} size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Tip */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip (Optional)
                  </label>
                  <div className="flex space-x-2">
                    {[0, 10, 20, 50].map((amount) => (
                      <Button
                        key={amount}
                        variant={bookingData.tip === amount ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBookingData(prev => ({ ...prev, tip: amount }))}
                      >
                        {amount === 0 ? 'None' : `AED ${amount}`}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full"
                  size="lg"
                  disabled={!bookingData.selectedTimeSlot}
                >
                  Confirm Booking
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  By confirming, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
