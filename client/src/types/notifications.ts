export type NotificationType = 
  | 'new_quote_received'      // Buyer: New quote on their RFQ
  | 'rfq_deadline_approaching' // Buyer: RFQ deadline soon (24/48h)
  | 'rfq_expired'             // Buyer: RFQ deadline passed
  | 'new_rfq_available'       // Vendor: New RFQ in their category
  | 'quote_status_changed'    // Vendor: Quote accepted/rejected
  | 'rfq_awarded'             // Vendor: Won the RFQ
  | 'quote_deadline_reminder' // Vendor: Quote expiring soon
  | 'new_message'             // Both: New message received
  | 'system_alert';           // System notifications

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  is_read: boolean;
  data?: {
    rfq_id?: string;
    quote_id?: string;
    vendor_id?: string;
    buyer_id?: string;
    message_id?: string;
    [key: string]: any;
  };
  email_sent?: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  in_app_notifications: boolean;
  notification_types: {
    [key in NotificationType]: {
      email: boolean;
      in_app: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  new_quote_received: {
    title: 'New Quote Received',
    message: 'You have received a new quote for your RFQ: {rfq_title}',
    priority: 'high' as NotificationPriority,
    email: true,
    in_app: true,
  },
  rfq_deadline_approaching: {
    title: 'RFQ Deadline Approaching',
    message: 'Your RFQ "{rfq_title}" deadline is approaching in {hours} hours',
    priority: 'medium' as NotificationPriority,
    email: true,
    in_app: false,
  },
  rfq_expired: {
    title: 'RFQ Expired',
    message: 'Your RFQ "{rfq_title}" has expired',
    priority: 'medium' as NotificationPriority,
    email: true,
    in_app: false,
  },
  new_rfq_available: {
    title: 'New RFQ Available',
    message: 'A new RFQ "{rfq_title}" is available in your category',
    priority: 'high' as NotificationPriority,
    email: true,
    in_app: true,
  },
  quote_status_changed: {
    title: 'Quote Status Updated',
    message: 'Your quote for "{rfq_title}" has been {status}',
    priority: 'high' as NotificationPriority,
    email: true,
    in_app: true,
  },
  rfq_awarded: {
    title: 'Quote Accepted',
    message: 'Your quote for "{rfq_title}" has been accepted!',
    priority: 'urgent' as NotificationPriority,
    email: true,
    in_app: true,
  },
  quote_deadline_reminder: {
    title: 'Quote Expiring Soon',
    message: 'Your quote for "{rfq_title}" expires in {hours} hours',
    priority: 'medium' as NotificationPriority,
    email: true,
    in_app: false,
  },
  new_message: {
    title: 'New Message',
    message: 'You have a new message from {sender_name}',
    priority: 'medium' as NotificationPriority,
    email: false,
    in_app: true,
  },
  system_alert: {
    title: 'System Alert',
    message: '{message}',
    priority: 'low' as NotificationPriority,
    email: true,
    in_app: true,
  },
};
