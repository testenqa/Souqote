import React, { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { NotificationService } from '../../services/notificationService';
import { Notification } from '../../types/notifications';
import { Button } from '../ui/button';
import NotificationDropdown from './NotificationDropdown';
import toast from 'react-hot-toast';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to get priority color
  const getPriorityColor = (priority: Notification['priority']): string => {
    switch (priority) {
      case 'urgent': return '#EF4444'; // Red
      case 'high': return '#F59E0B';   // Amber
      case 'medium': return '#3B82F6'; // Blue
      case 'low': return '#6B7280';    // Gray
      default: return '#6B7280';
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const [notificationsData, unreadCountData] = await Promise.all([
          NotificationService.getUserNotifications(user.id, 5),
          NotificationService.getUnreadCount(user.id),
        ]);
        
        setNotifications(notificationsData);
        setUnreadCount(unreadCountData);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Subscribe to real-time notifications
    const subscription = NotificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast notification for the recipient
        const priorityIcon = newNotification.priority === 'urgent' ? '🚨' : '🔔';
        toast.success(
          `${priorityIcon} ${newNotification.title}\n${newNotification.message.substring(0, 80)}${newNotification.message.length > 80 ? '...' : ''}`,
          {
            duration: 5000,
            style: {
              background: '#fff',
              color: '#333',
              borderLeft: `5px solid ${getPriorityColor(newNotification.priority)}`,
            },
          }
        );
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    
    // Refetch unread count to ensure accuracy
    if (user) {
      const newCount = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(newCount);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    const success = await NotificationService.markAllAsRead(user.id);
    
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-blue-600" />
        ) : (
          <Bell className="h-5 w-5 text-gray-600" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isDropdownOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
