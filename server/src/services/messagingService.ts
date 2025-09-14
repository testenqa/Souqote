import { supabase } from '../config/database';
import { Message } from '../types';

export class MessagingService {
  static async sendMessage(messageData: {
    job_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type: 'text' | 'image' | 'file';
  }): Promise<Message> {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        ...messageData,
        is_read: false
      })
      .select(`
        *,
        sender:users(*)
      `)
      .single();

    if (error) {
      throw new Error('Failed to send message');
    }

    return message;
  }

  static async getMessages(jobId: string, userId: string): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(*)
      `)
      .eq('job_id', jobId)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch messages');
    }

    return messages || [];
  }

  static async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      throw new Error('Failed to mark message as read');
    }
  }

  static async markAllAsRead(jobId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('job_id', jobId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error('Failed to mark messages as read');
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error('Failed to get unread count');
    }

    return count || 0;
  }

  static async getConversations(userId: string): Promise<any[]> {
    // Get all unique job conversations for the user
    const { data: conversations, error } = await supabase
      .from('messages')
      .select(`
        job_id,
        jobs!inner(
          id,
          title,
          status,
          customer:users(id, first_name, last_name, avatar_url),
          professional:users(id, first_name, last_name, avatar_url)
        )
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch conversations');
    }

    // Group by job_id and get latest message
    const conversationMap = new Map();
    
    for (const msg of conversations || []) {
      if (!conversationMap.has(msg.job_id)) {
        conversationMap.set(msg.job_id, {
          job_id: msg.job_id,
          job: msg.jobs,
          latest_message: null,
          unread_count: 0
        });
      }
    }

    // Get latest message and unread count for each conversation
    for (const [jobId, conversation] of conversationMap) {
      const { data: latestMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', jobId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      conversation.latest_message = latestMessage;
      conversation.unread_count = unreadCount || 0;
    }

    return Array.from(conversationMap.values());
  }
}
