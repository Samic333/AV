import { create } from 'zustand';
import { Notification } from '@/lib/types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

// Mock notifications for now - structure ready for API integration
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your lesson with John Doe on Dec 25, 2024 at 2:00 PM has been confirmed.',
    linkUrl: '/student/bookings',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'booking_reminder',
    title: 'Upcoming Lesson Reminder',
    message: 'You have a lesson scheduled in 24 hours.',
    linkUrl: '/student/bookings',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from your tutor.',
    linkUrl: '/student/messages',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call when endpoint is available
      // const response = await api.get('/notifications');
      // const notifications = response.data.data || response.data;
      
      // Using mock data for now
      const notifications = mockNotifications;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },
  markAsRead: async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call when endpoint is available
      // await api.put(`/notifications/${notificationId}/read`);
      
      const notifications = get().notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
  markAllAsRead: async () => {
    try {
      // TODO: Replace with actual API call when endpoint is available
      // await api.put('/notifications/read-all');
      
      const notifications = get().notifications.map(n => ({
        ...n,
        isRead: true,
        readAt: new Date().toISOString(),
      }));
      
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
}));

