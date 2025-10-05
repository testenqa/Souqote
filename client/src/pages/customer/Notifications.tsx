import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Clock, 
  MapPin, 
  Star, 
  MessageSquare, 
  Phone, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Award,
  CreditCard,
  Shield,
  RefreshCw,
  Settings,
  Filter,
  CheckCircle2,
  Trash2
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface Notification {
  id: string;
  type: 'booking' | 'eta' | 'reminder' | 'promo' | 'warranty' | 'payment' | 'review';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    bookingId?: string;
    professionalName?: string;
    eta?: string;
    amount?: number;
    promoCode?: string;
  };
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'promo'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your AC repair service has been confirmed for tomorrow at 2:00 PM',
      timestamp: '2 hours ago',
      isRead: false,
      priority: 'high',
      actionUrl: '/tracking',
      metadata: {
        bookingId: 'BK123456',
        professionalName: 'Ahmed Hassan'
      }
    },
    {
      id: '2',
      type: 'eta',
      title: 'Professional En Route',
      message: 'Ahmed Hassan is on his way. ETA: 15 minutes',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'high',
      actionUrl: '/tracking',
      metadata: {
        professionalName: 'Ahmed Hassan',
        eta: '15 min'
      }
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Service Reminder',
      message: 'Your scheduled plumbing service is in 2 hours',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium',
      actionUrl: '/tracking'
    },
    {
      id: '4',
      type: 'promo',
      title: 'Special Offer',
      message: 'Get 20% off your next AC service. Use code COOL20',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low',
      metadata: {
        promoCode: 'COOL20'
      }
    },
    {
      id: '5',
      type: 'warranty',
      title: 'Warranty Reminder',
      message: 'Your AC repair warranty expires in 30 days',
      timestamp: '2 days ago',
      isRead: true,
      priority: 'medium',
      actionUrl: '/aftercare'
    },
    {
      id: '6',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of AED 450 has been processed successfully',
      timestamp: '3 days ago',
      isRead: true,
      priority: 'low',
      metadata: {
        amount: 450
      }
    },
    {
      id: '7',
      type: 'review',
      title: 'Rate Your Experience',
      message: 'How was your service with Ahmed Hassan?',
      timestamp: '4 days ago',
      isRead: true,
      priority: 'low',
      actionUrl: '/completion',
      metadata: {
        professionalName: 'Ahmed Hassan'
      }
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'eta': return Clock;
      case 'reminder': return AlertCircle;
      case 'promo': return Award;
      case 'warranty': return Shield;
      case 'payment': return CreditCard;
      case 'review': return Star;
      default: return Bell;
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

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Navigate if action URL exists
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', name: 'All', count: notifications.length },
              { id: 'unread', name: 'Unread', count: unreadCount },
              { id: 'booking', name: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
              { id: 'promo', name: 'Promotions', count: notifications.filter(n => n.type === 'promo').length }
            ].map((filterOption) => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.id as any)}
                className="flex items-center space-x-2"
              >
                <span>{filterOption.name}</span>
                {filterOption.count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filterOption.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "No notifications match your current filter."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            !notification.isRead ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-semibold ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className={`w-2 h-2 ${getPriorityColor(notification.priority)} rounded-full`} />
                              )}
                            </div>
                            <p className={`text-sm ${
                              !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            
                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {notification.metadata.bookingId && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.metadata.bookingId}
                                  </Badge>
                                )}
                                {notification.metadata.professionalName && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.metadata.professionalName}
                                  </Badge>
                                )}
                                {notification.metadata.eta && (
                                  <Badge variant="outline" className="text-xs">
                                    ETA: {notification.metadata.eta}
                                  </Badge>
                                )}
                                {notification.metadata.amount && (
                                  <Badge variant="outline" className="text-xs">
                                    AED {notification.metadata.amount}
                                  </Badge>
                                )}
                                {notification.metadata.promoCode && (
                                  <Badge variant="default" className="text-xs">
                                    {notification.metadata.promoCode}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">Book Service</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Live Chat</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Phone className="h-6 w-6 mb-2" />
                  <span className="text-sm">Call Support</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="h-6 w-6 mb-2" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
