import { create } from 'zustand';
import { User } from '@/lib/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  fetchUser: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ user, accessToken, refreshToken, isLoading: false });
  },
  logout: async () => {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call logout API endpoint if refreshToken exists
      if (refreshToken) {
        try {
          await api.post('/auth/logout', { refreshToken });
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API call failed:', error);
        }
      }
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    
    set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
    
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
  initializeAuth: async () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      set({ isLoading: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      // Backend wraps response in { success: true, data: {...} }
      const user = response.data.data || response.data;
      // Ensure user object has all required fields
      if (user && user.id) {
        set({ user, accessToken, refreshToken, isLoading: false });
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
    }
  },
  fetchUser: async () => {
    try {
      const response = await api.get('/auth/me');
      // Backend wraps response in { success: true, data: {...} }
      const user = response.data.data || response.data;
      if (user && user.id) {
        set({ user });
        return user;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  },
}));

