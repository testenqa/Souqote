import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Message } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import FileUpload from '../ui/file-upload';
import { Send, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConversationThreadProps {
  rfqId: string;
  otherUserId: string;
  otherUserName: string;
  quoteId?: string;
  quoteStatus?: string;
  onClose?: () => void;
}

const ConversationThread: React.FC<ConversationThreadProps> = ({
  rfqId,
  otherUserId,
  otherUserName,
  quoteId,
  quoteStatus,
  onClose
}) => {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [rfqTitle, setRfqTitle] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const threadId = `${rfqId}-${[user?.id, otherUserId].sort().join('-')}`;
  const isQuoteWithdrawn = quoteStatus === 'withdrawn';

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const loadRfqTitle = async () => {
    try {
      const { data, error } = await supabase
        .from('rfqs')
        .select('title')
        .eq('id', rfqId)
        .single();

      if (error) throw error;
      if (data) {
        setRfqTitle(data.title);
      }
    } catch (error) {
      console.error('Error loading RFQ title:', error);
    }
  };

  useEffect(() => {
    loadMessages();
    markMessagesAsRead();
    loadRfqTitle();
    
    // Subscribe to real-time message updates
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as Message]);
            if ((payload.new as Message).sender_id !== user?.id) {
              markMessagesAsRead();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rfqId, otherUserId, threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, first_name, last_name, avatar_url),
          receiver:users!messages_receiver_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error('Failed to load messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('thread_id', threadId)
        .eq('receiver_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!user) return;

    setSending(true);
    let attachmentUrls: string[] = [];

    try {
      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadPromises = attachments.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('message-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('message-attachments')
            .getPublicUrl(fileName);

          return urlData.publicUrl;
        });

        attachmentUrls = await Promise.all(uploadPromises);
      }

      // Send message
      const { error } = await supabase
        .from('messages')
        .insert({
          rfq_id: rfqId,
          quote_id: quoteId || null, // Convert empty string to null
          sender_id: user.id,
          receiver_id: otherUserId,
          content: newMessage.trim(),
          thread_id: threadId,
          attachments: attachmentUrls.length > 0 ? attachmentUrls : null,
          is_read: false
        });

      if (error) throw error;

      setNewMessage('');
      setAttachments([]);
      setShowAttachments(false);
    } catch (error: any) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFileIcon = (url: string) => {
    if (url.includes('.pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="w-4 h-4 text-green-500" />;
    }
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{otherUserName}</h3>
          {rfqTitle && (
            <p className="text-sm text-blue-600 font-medium mt-0.5">
              RFQ: {rfqTitle}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">Chat conversation</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                  {message.content && <p className="break-words">{message.content}</p>}
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-2 p-2 rounded ${isOwnMessage ? 'bg-blue-700' : 'bg-gray-200'}`}
                        >
                          {getFileIcon(attachment)}
                          <span className="text-sm truncate">{attachment.split('/').pop()}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        {isQuoteWithdrawn ? (
          <div className="text-center py-4">
            <p className="text-orange-600 font-medium">⊘ Quote Withdrawn</p>
            <p className="text-sm text-gray-500 mt-1">Messaging is disabled for withdrawn quotes</p>
          </div>
        ) : (
          <>
            {showAttachments && (
              <div className="mb-4">
                <FileUpload
                  onFilesChange={setAttachments}
                  maxFiles={3}
                  maxSize={5}
                  className="mb-2"
                />
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAttachments(!showAttachments)}
                className="mb-1"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              
              <Button
                type="submit"
                disabled={(!newMessage.trim() && attachments.length === 0) || sending}
                className="mb-1"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        )}
      </div>
    </Card>
  );
};

export default ConversationThread;
