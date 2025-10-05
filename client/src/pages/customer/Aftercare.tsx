import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  Clock, 
  FileText, 
  Download, 
  RefreshCw,
  Star,
  User,
  MapPin,
  Calendar as CalendarIcon,
  Award,
  HelpCircle,
  ExternalLink,
  Plus
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface WarrantyItem {
  id: string;
  service: string;
  professional: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'used';
  description: string;
  remainingDays: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
  category: string;
}

const Aftercare: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'warranty' | 'support' | 'rebook'>('warranty');

  const warrantyItems: WarrantyItem[] = [
    {
      id: '1',
      service: 'AC Repair & Maintenance',
      professional: 'Ahmed Hassan',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'active',
      description: 'AC unit repair with refrigerant recharge and filter replacement',
      remainingDays: 45
    },
    {
      id: '2',
      service: 'Plumbing Fix',
      professional: 'Mohammed Ali',
      startDate: '2023-12-01',
      endDate: '2024-03-01',
      status: 'expired',
      description: 'Kitchen sink leak repair and pipe replacement',
      remainingDays: 0
    },
    {
      id: '3',
      service: 'Electrical Work',
      professional: 'Raj Patel',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      status: 'active',
      description: 'Power outlet installation and wiring repair',
      remainingDays: 78
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'ST-001',
      subject: 'AC not cooling after repair',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-20',
      lastUpdate: '2024-01-20',
      category: 'Warranty Claim'
    },
    {
      id: 'ST-002',
      subject: 'Need to reschedule service',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-15',
      lastUpdate: '2024-01-16',
      category: 'Scheduling'
    }
  ];

  const recentProfessionals = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      rating: 4.9,
      specialty: 'AC & Cooling',
      lastService: '2024-01-15',
      totalJobs: 3
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      rating: 4.8,
      specialty: 'Plumbing',
      lastService: '2023-12-01',
      totalJobs: 2
    }
  ];

  const handleWarrantyClaim = (warrantyId: string) => {
    navigate('/support', { state: { warrantyId, type: 'warranty_claim' } });
  };

  const handleRebookProfessional = (professionalId: string) => {
    navigate('/post-job', { state: { professionalId } });
  };

  const handleCreateTicket = () => {
    navigate('/support', { state: { type: 'new_ticket' } });
  };

  const getWarrantyStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-gray-500';
      case 'used': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Aftercare & Support</h1>
          <p className="text-gray-600 mt-1">Manage warranties, get support, and rebook services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'warranty', name: 'Warranties', icon: Shield },
                { id: 'support', name: 'Support', icon: MessageSquare },
                { id: 'rebook', name: 'Rebook', icon: RefreshCw }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Warranty Tab */}
        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Active Warranties</h2>
              <Badge variant="outline">
                {warrantyItems.filter(item => item.status === 'active').length} Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warrantyItems.map((warranty) => (
                <Card key={warranty.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{warranty.service}</CardTitle>
                      <Badge className={`${getWarrantyStatusColor(warranty.status)} text-white`}>
                        {warranty.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      by {warranty.professional}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{warranty.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Start Date:</span>
                        <span>{new Date(warranty.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">End Date:</span>
                        <span>{new Date(warranty.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Remaining:</span>
                        <span className="font-medium">{warranty.remainingDays} days</span>
                      </div>
                    </div>

                    {warranty.status === 'active' && (
                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleWarrantyClaim(warranty.id)}
                          className="w-full"
                          size="sm"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Claim Warranty
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
              <Button onClick={handleCreateTicket}>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={ticket.status === 'resolved' ? 'default' : 'secondary'}>
                          {ticket.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Support Options */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    <span>Live Chat</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Phone className="h-6 w-6 mb-2" />
                    <span>Call Support</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <ExternalLink className="h-6 w-6 mb-2" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rebook Tab */}
        {activeTab === 'rebook' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Rebook Professionals</h2>
              <Button onClick={() => navigate('/post-job')}>
                <Plus className="h-4 w-4 mr-2" />
                New Service Request
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProfessionals.map((professional) => (
                <Card key={professional.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{professional.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Specialty:</span>
                        <span>{professional.specialty}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Service:</span>
                        <span>{new Date(professional.lastService).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Jobs:</span>
                        <span>{professional.totalJobs}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleRebookProfessional(professional.id)}
                        className="w-full"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Rebook
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aftercare;
