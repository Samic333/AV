'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { format, parseISO } from 'date-fns';

interface Conversation {
  id: string;
  participant1: { id: string; firstName: string; lastName: string; avatarUrl?: string };
  participant2: { id: string; firstName: string; lastName: string; avatarUrl?: string };
  lastMessageAt?: string;
  messages?: Array<{ id: string; content: string; createdAt: string; senderId: string }>;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; firstName: string; lastName: string; avatarUrl?: string };
  isRead: boolean;
}

export default function TutorMessagesPage() {
  const user = useAuthStore((state) => state.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations');
      const data = response.data.data || response.data;
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}/messages`);
      const data = response.data.data || response.data;
      setMessages(Array.isArray(data) ? data : []);
      
      // Mark as read
      await api.post(`/messages/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    return conversation.participant1.id === user.id
      ? conversation.participant2
      : conversation.participant1;
  };

  const detectContactInfo = (content: string): { hasContactInfo: boolean; reason?: string } => {
    // Email pattern
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    // Phone pattern (various formats)
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,}/;
    // Telegram/WhatsApp mentions
    const telegramPattern = /(telegram|t\.me|@\w+)/i;
    const whatsappPattern = /(whatsapp|wa\.me|\+?\d{10,})/i;
    
    if (emailPattern.test(content)) {
      return { hasContactInfo: true, reason: 'Email address detected' };
    }
    if (phonePattern.test(content)) {
      return { hasContactInfo: true, reason: 'Phone number detected' };
    }
    if (telegramPattern.test(content)) {
      return { hasContactInfo: true, reason: 'Telegram handle detected' };
    }
    if (whatsappPattern.test(content)) {
      return { hasContactInfo: true, reason: 'WhatsApp number detected' };
    }
    
    return { hasContactInfo: false };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    // Client-side detection before API call
    const contactCheck = detectContactInfo(newMessage);
    if (contactCheck.hasContactInfo) {
      alert(`Sharing contact information is not allowed. ${contactCheck.reason}. Please use the platform messaging system to communicate.`);
      return;
    }

    try {
      setSending(true);
      const otherParticipant = getOtherParticipant(selectedConversation);
      if (!otherParticipant) return;

      await api.post('/messages/send', {
        recipientId: otherParticipant.id,
        content: newMessage,
      });

      setNewMessage('');
      await fetchMessages(selectedConversation.id);
      await fetchConversations();
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert(error.response.data.message || 'Sharing contact information is not allowed. Please use the platform messaging system.');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Messages</h1>
          <p className="text-navy-600">Chat with your students and other users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Conversations</h2>
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <p className="text-navy-600 mb-4">No conversations yet</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2">
                  {conversations.map((conv) => {
                    const other = getOtherParticipant(conv);
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-3 hover:bg-sky-blue-50 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-sky-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-navy-900">
                            {other?.firstName} {other?.lastName}
                          </p>
                        </div>
                        {conv.messages && conv.messages[0] && (
                          <>
                            <p className="text-sm text-navy-600 truncate">
                              {conv.messages[0].content}
                            </p>
                            {conv.lastMessageAt && (
                              <p className="text-xs text-navy-500 mt-1">
                                {format(parseISO(conv.lastMessageAt), 'MMM d, h:mm a')}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Messages Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    {(() => {
                      const other = getOtherParticipant(selectedConversation);
                      return (
                        <h3 className="text-lg font-semibold text-navy-900">
                          {other?.firstName} {other?.lastName}
                        </h3>
                      );
                    })()}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwn
                                ? 'bg-sky-blue-600 text-white'
                                : 'bg-gray-100 text-navy-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-sky-blue-100' : 'text-navy-500'
                              }`}
                            >
                              {format(parseISO(message.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                      />
                      <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                    <p className="text-xs text-navy-500 mt-2">
                      Note: Sharing contact information (email, phone, Telegram, WhatsApp) is not allowed.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-navy-600 mb-4">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
