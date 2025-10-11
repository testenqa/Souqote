import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Bell, Trash2, Check, Filter, X } from 'lucide-react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { NotificationService } from '../../services/notificationService';
import { Notification, NotificationType, NotificationPriority } from '../../types/notifications';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<NotificationPriority | 'all'>('all');

  // Fetch notifications
  const { data: notifications = [], isLoading, error } = useQuery(
    ['notifications', user?.id],
    () => NotificationService.getUserNotifications(user!.id, 50),
    { enabled: !!user }
  );

  // Get unread count
  const { data: unreadCount = 0 } = useQuery(
    ['notifications-unread', user?.id],
    () => NotificationService.getUnreadCount(user!.id),
    { enabled: !!user }
  );

  // Mark as read mutation
  const markAsReadMutation = useMutation(
    (notificationId: string) => NotificationService.markAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', user?.id]);
        queryClient.invalidateQueries(['notifications-unread', user?.id]);
      },
    }
  );

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(
    () => NotificationService.markAllAsRead(user!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', user?.id]);
        queryClient.invalidateQueries(['notifications-unread', user?.id]);
      },
    }
  );

  // Delete notification mutation
  const deleteNotificationMutation = useMutation(
    (notificationId: string) => NotificationService.deleteNotification(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', user?.id]);
        queryClient.invalidateQueries(['notifications-unread', user?.id]);
      },
    }
  );

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread' && notification.is_read) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false;
    return true;
  });

  const getNotificationIcon = (type: NotificationType, priority: NotificationPriority) => {
    const iconClass = "h-5 w-5";
    
    switch (type) {
      case 'new_quote_received':
      case 'new_rfq_available':
        return <Bell className={`${iconClass} text-green-600`} />;
      case 'quote_status_changed':
      case 'rfq_awarded':
        return <Check className={`${iconClass} text-blue-600`} />;
      case 'rfq_deadline_approaching':
      case 'quote_deadline_reminder':
        return <Bell className={`${iconClass} text-orange-600`} />;
      case 'rfq_expired':
        return <X className={`${iconClass} text-red-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate based on notification type
    if (notification.data?.rfq_id) {
      window.location.href = `/rfqs/${notification.data.rfq_id}`;
    } else if (notification.data?.message_id) {
      window.location.href = '/messages';
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to view notifications</div>;
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading notifications</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'
              }
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isLoading}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          {/* Status Filter */}
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
          </div>

          {/* Type Filter */}
          <div className="flex space-x-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              All Types
            </Button>
            <Button
              variant={typeFilter === 'new_quote_received' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('new_quote_received')}
            >
              New Quotes
            </Button>
            <Button
              variant={typeFilter === 'new_rfq_available' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('new_rfq_available')}
            >
              New RFQs
            </Button>
          </div>

          {/* Priority Filter */}
          <div className="flex space-x-2">
            <Button
              variant={priorityFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter('all')}
            >
              All Priorities
            </Button>
            <Button
              variant={priorityFilter === 'urgent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter('urgent')}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Urgent
            </Button>
            <Button
              variant={priorityFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPriorityFilter('high')}
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              High
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          
                          {notification.email_sent && (
                            <Badge variant="outline" className="text-xs">
                              Email sent
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                          {formatDate(notification.created_at)}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsReadMutation.mutate(notification.id);
                              }}
                              disabled={markAsReadMutation.isLoading}
                            >
                              Mark as Read
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotificationMutation.mutate(notification.id);
                            }}
                            disabled={deleteNotificationMutation.isLoading}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
