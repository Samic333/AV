'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      // Backend wraps response in { success: true, data: {...} }
      const responseData = response.data.data || response.data;
      const { user, accessToken, refreshToken } = responseData;
      
      // Fetch full user profile to ensure all fields are populated
      try {
        const meResponse = await api.get('/auth/me');
        const meData = meResponse.data.data || meResponse.data;
        setAuth(meData, accessToken, refreshToken);
        
        // Redirect based on role
        if (meData.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (meData.role === 'tutor') {
          router.push('/tutor/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } catch {
        // If /auth/me fails, use the user from login response
        setAuth(user, accessToken, refreshToken);
        
        // Redirect based on role
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'tutor') {
          router.push('/tutor/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }
    } catch (err: any) {
      // Better error parsing
      let errorMessage = 'Login failed. Please try again.';
      
      // Log full error for debugging
      console.error('Full login error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      
      // Handle network errors
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:3001';
      } else if (err.response?.data) {
        const data = err.response.data;
        if (data.message) {
          if (Array.isArray(data.message)) {
            errorMessage = data.message.join(', ');
          } else if (typeof data.message === 'string') {
            errorMessage = data.message;
          }
        } else if (data.error) {
          errorMessage = data.error;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sky-soft">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 py-12">
        <Card className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-blue-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your AviatorTutor account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register/student" className="text-sky-blue-600 hover:text-sky-blue-700 font-semibold">
                Join as Student
              </Link>
              {' or '}
              <Link href="/register/tutor" className="text-sky-blue-600 hover:text-sky-blue-700 font-semibold">
                Become a Tutor
              </Link>
            </p>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

