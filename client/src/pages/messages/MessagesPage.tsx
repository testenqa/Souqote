import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { ConversationThread as ConversationThreadType } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import ConversationThread from '../../components/messages/ConversationThread';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUserDisplayName } from '../../lib/utils';
import { MessageCircle, User } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<ConversationThreadType | null>(null);
  const [conversations, setConversations] = useState<ConversationThreadType[]>([]);

  const { data: messagesData, isLoading, refetch } = useQuery(
    ['conversations', user?.id],
    async () => {
      if (!user) return [];

      // Get all messages for the current user
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, first_name, last_name, avatar_url, company_name),
          receiver:users!messages_receiver_id_fkey(id, first_name, last_name, avatar_url, company_name),
          rfq:rfqs(id, title, status)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch missing user data for any null receivers or senders
      const userIds = new Set<string>();
      messages?.forEach(message => {
        if (message.sender_id) userIds.add(message.sender_id);
        if (message.receiver_id) userIds.add(message.receiver_id);
      });
      
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, first_name, last_name, avatar_url, company_name')
        .in('id', Array.from(userIds));
      
      // Replace null user references with actual user data
      const messagesWithUsers = messages?.map(message => ({
        ...message,
        sender: message.sender || allUsers?.find(u => u.id === message.sender_id) || null,
        receiver: message.receiver || allUsers?.find(u => u.id === message.receiver_id) || null,
      }));
      
      return messagesWithUsers;
    },
    { enabled: !!user }
  );

  useEffect(() => {
    if (!messagesData || !user) return;

    // Group messages by thread_id
    const threadMap = new Map<string, ConversationThreadType>();

    messagesData.forEach((message) => {
      const threadId = message.thread_id || '';
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      let otherUser = message.sender_id === user.id ? message.receiver : message.sender;
      
      // Fallback: If otherUser is null, create a minimal user object
      if (!otherUser && otherUserId) {
        otherUser = {
          id: otherUserId,
          first_name: null,
          last_name: null,
          company_name: null,
          avatar_url: null
        };
      }
      

      if (!threadMap.has(threadId)) {
        const unreadCount = messagesData.filter(
          (m) => m.thread_id === threadId && m.receiver_id === user.id && !m.is_read
        ).length;

        threadMap.set(threadId, {
          rfq_id: message.rfq_id,
          quote_id: message.quote_id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          thread_id: threadId,
          message_count: 0,
          unread_count: unreadCount,
          last_message_at: message.created_at,
          last_message: message.content,
          other_user: otherUser,
          rfq: message.rfq,
        });
      }

      const thread = threadMap.get(threadId)!;
      thread.message_count += 1;
      
      // Update last message if this one is newer
      if (new Date(message.created_at) > new Date(thread.last_message_at)) {
        thread.last_message_at = message.created_at;
        thread.last_message = message.content;
      }
    });

    setConversations(Array.from(threadMap.values()));

    // Subscribe to real-time updates
    const channel = supabase
      .channel('all-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Refetch conversations when messages change (without losing selection)
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messagesData, user, refetch]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">All your conversations in one place</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              {conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Start messaging from RFQs or quotes
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.thread_id}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedConversation(conversation);
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedConversation?.thread_id === conversation.thread_id
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {conversation.other_user?.avatar_url ? (
                            <img
                              src={conversation.other_user.avatar_url}
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {getUserDisplayName(conversation.other_user, 'User')}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.last_message_at)}
                            </span>
                          </div>
                          {conversation.other_user?.company_name && 
                           conversation.other_user?.first_name && (
                            <p className="text-xs text-gray-500 mb-1">
                              {conversation.other_user.company_name}
                            </p>
                          )}
                          {conversation.rfq && (
                            <p className="text-xs text-blue-600 mb-1">
                              Re: {conversation.rfq.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.last_message}
                          </p>
                          {conversation.unread_count > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                              {conversation.unread_count} new
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <ConversationThread
              rfqId={selectedConversation.rfq_id}
              otherUserId={
                selectedConversation.sender_id === user?.id
                  ? selectedConversation.receiver_id
                  : selectedConversation.sender_id
              }
              otherUserName={getUserDisplayName(selectedConversation.other_user, 'User')}
              quoteId={selectedConversation.quote_id}
            />
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
