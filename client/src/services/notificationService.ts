import { supabase } from '../lib/supabase';
import { 
  Notification, 
  NotificationType, 
  NotificationPreferences,
  NOTIFICATION_TEMPLATES 
} from '../types/notifications';
import toast from 'react-hot-toast';

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(
    userId: string,
    type: NotificationType,
    data?: any,
    customTitle?: string,
    customMessage?: string
  ): Promise<Notification | null> {
    try {
      console.log('🔔 Creating notification:', { userId, type, data });
      
      const template = NOTIFICATION_TEMPLATES[type];
      const title = customTitle || template.title;
      let message = customMessage || template.message;

      // Replace placeholders in message
      if (data) {
        message = this.replacePlaceholders(message, data);
      }

      console.log('🔔 Notification details:', { title, message, priority: template.priority });

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          priority: template.priority,
          data: data || {},
          email_sent: false,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating notification:', error);
        return null;
      }

      console.log('✅ Notification created successfully:', notification);

      // Send email if template requires it
      if (template.email) {
        await this.sendEmailNotification(notification);
      }

      // Note: In-app notifications (toasts) are handled by real-time subscription
      // in NotificationBell component. We don't show them here because:
      // 1. The creator of the notification is not the recipient
      // 2. The recipient will see the toast via real-time subscription

      return notification;
    } catch (error) {
      console.error('❌ Error in createNotification:', error);
      return null;
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  }

  /**
   * Get user notification preferences
   */
  static async getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching notification preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getNotificationPreferences:', error);
      return null;
    }
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating notification preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateNotificationPreferences:', error);
      return false;
    }
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, we'll just log it
      console.log('Email notification to be sent:', {
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
      });

      // Update notification to mark email as sent (with error handling)
      try {
        const { error: updateError } = await supabase
          .from('notifications')
          .update({ email_sent: true })
          .eq('id', notification.id);
          
        if (updateError) {
          console.warn('Could not update email_sent status:', updateError);
          // Don't throw error - email notification still "sent" conceptually
        }
      } catch (updateError) {
        console.warn('Error updating email_sent status:', updateError);
        // Don't throw error - email notification still "sent" conceptually
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  /**
   * Show in-app notification toast
   */
  private static showInAppNotification(notification: Notification): void {
    // Show toast notification based on priority
    const toastOptions = {
      duration: notification.priority === 'urgent' ? 8000 : 4000,
    };

    switch (notification.priority) {
      case 'urgent':
        toast.success(notification.title, {
          ...toastOptions,
          style: {
            background: '#dc2626',
            color: 'white',
          },
        });
        break;
      case 'high':
        toast.success(notification.title, toastOptions);
        break;
      case 'medium':
        toast(notification.title, toastOptions);
        break;
      case 'low':
        toast(notification.title, { ...toastOptions, duration: 2000 });
        break;
    }
  }

  /**
   * Replace placeholders in message template
   */
  private static replacePlaceholders(message: string, data: any): string {
    return message.replace(/\{([^}]+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * Subscribe to real-time notifications
   */
  static subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    console.log('🔔 Setting up real-time subscription for user:', userId);
    
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔔 Real-time notification received:', payload);
          callback(payload.new as Notification);
        }
      )
      .subscribe((status) => {
        console.log('🔔 Real-time subscription status:', status);
      });
      
    return subscription;
  }
}
