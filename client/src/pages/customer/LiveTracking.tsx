import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  User,
  Car,
  Navigation,
  Shield,
  Star,
  Camera,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface TrackingData {
  bookingId: string;
  professional: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    rating: number;
    vehicle: string;
    plateNumber: string;
  };
  status: 'accepted' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  location: {
    current: { lat: number; lng: number; address: string };
    destination: { lat: number; lng: number; address: string };
  };
  eta: string;
  estimatedDuration: string;
  workStages: {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
    description: string;
    estimatedTime: string;
  }[];
  messages: {
    id: string;
    sender: 'customer' | 'professional';
    message: string;
    timestamp: string;
    type: 'text' | 'image' | 'status';
  }[];
  otp: string;
  workSummary?: {
    description: string;
    partsUsed: string[];
    beforePhotos: string[];
    afterPhotos: string[];
    totalCost: number;
    adjustments: number;
  };
}

const LiveTracking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  
  const [trackingData, setTrackingData] = useState<TrackingData>({
    bookingId: 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    professional: {
      id: '1',
      name: 'Ahmed Hassan',
      avatar: '/avatars/ahmed.jpg',
      phone: '+971501234567',
      rating: 4.9,
      vehicle: 'Toyota Camry',
      plateNumber: 'ABC-1234'
    },
    status: 'en_route',
    location: {
      current: { lat: 25.2048, lng: 55.2708, address: 'Dubai Marina' },
      destination: { lat: 25.2048, lng: 55.2708, address: 'Your Location' }
    },
    eta: '15 min',
    estimatedDuration: '2 hours',
    workStages: [
      { id: '1', name: 'Arrival & Assessment', status: 'pending', description: 'Professional arrives and assesses the issue', estimatedTime: '15 min' },
      { id: '2', name: 'Diagnosis', status: 'pending', description: 'Identify the root cause of the problem', estimatedTime: '30 min' },
      { id: '3', name: 'Repair Work', status: 'pending', description: 'Perform the necessary repairs', estimatedTime: '60 min' },
      { id: '4', name: 'Testing & Cleanup', status: 'pending', description: 'Test the repair and clean up the area', estimatedTime: '15 min' }
    ],
    messages: [
      { id: '1', sender: 'professional', message: 'Hi! I\'m on my way to your location. ETA 15 minutes.', timestamp: '2:30 PM', type: 'text' },
      { id: '2', sender: 'professional', message: 'I\'ve arrived at the building. Please provide the OTP for access.', timestamp: '2:45 PM', type: 'status' }
    ],
    otp: '1234',
    workSummary: undefined
  });

  const [newMessage, setNewMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update ETA
      setTrackingData(prev => ({
        ...prev,
        eta: Math.max(0, parseInt(prev.eta) - 1) + ' min'
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'customer' as const,
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text' as const
      };
      
      setTrackingData(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
      
      setNewMessage('');
    }
  };

  const handleOtpSubmit = () => {
    if (otpInput === trackingData.otp) {
      setShowOtpModal(false);
      setTrackingData(prev => ({
        ...prev,
        status: 'arrived',
        workStages: prev.workStages.map((stage, index) => 
          index === 0 ? { ...stage, status: 'in_progress' } : stage
        )
      }));
    }
  };

  const handleStageComplete = (stageId: string) => {
    setTrackingData(prev => ({
      ...prev,
      workStages: prev.workStages.map(stage => 
        stage.id === stageId 
          ? { ...stage, status: 'completed' }
          : stage
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-500';
      case 'en_route': return 'bg-yellow-500';
      case 'arrived': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'en_route': return 'En Route';
      case 'arrived': return 'Arrived';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Live Tracking</h1>
              <p className="text-sm text-gray-600">Booking #{trackingData.bookingId}</p>
            </div>
            <Badge className={`${getStatusColor(trackingData.status)} text-white`}>
              {getStatusText(trackingData.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Professional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{trackingData.professional.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{trackingData.professional.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{trackingData.professional.vehicle} ({trackingData.professional.plateNumber})</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & ETA */}
            <Card>
              <CardHeader>
                <CardTitle>Location & ETA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Professional Location</p>
                      <p className="text-sm text-gray-600">{trackingData.location.current.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Your Location</p>
                      <p className="text-sm text-gray-600">{trackingData.location.destination.address}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-blue-900">
                        ETA: {trackingData.eta}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Estimated work duration: {trackingData.estimatedDuration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Stages */}
            <Card>
              <CardHeader>
                <CardTitle>Work Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.workStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {stage.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : stage.status === 'in_progress' ? (
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{stage.name}</h3>
                          <span className="text-sm text-gray-500">{stage.estimatedTime}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                        {stage.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleStageComplete(stage.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {trackingData.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === 'customer'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </Button>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue:</span>
                  <span className="font-medium">{bookingData?.serviceData?.issue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Urgency:</span>
                  <Badge variant="secondary">{bookingData?.serviceData?.urgency}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">{bookingData?.serviceData?.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">AED {bookingData?.total || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* OTP Access */}
            {trackingData.status === 'en_route' && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">Building Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 mb-4">
                    Your professional has arrived. Please provide the OTP for building access.
                  </p>
                  <Button 
                    onClick={() => setShowOtpModal(true)}
                    className="w-full"
                  >
                    Enter OTP: {trackingData.otp}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Building Access OTP</CardTitle>
              <CardDescription>
                Enter the OTP to allow the professional access to your building
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpInput(e.target.value)}
                className="text-center text-lg tracking-widest"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleOtpSubmit}
                  className="flex-1"
                  disabled={otpInput !== trackingData.otp}
                >
                  Confirm Access
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowOtpModal(false)}
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

export default LiveTracking;
