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

export default function RegisterTutorPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    hourlyRate: '',
    bio: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate hourly rate
    const hourlyRate = parseFloat(formData.hourlyRate);
    if (!formData.hourlyRate || isNaN(hourlyRate) || hourlyRate <= 0) {
      setError('Please enter a valid hourly rate greater than 0');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register/tutor', {
        ...formData,
        hourlyRate: hourlyRate,
      });
      // Backend wraps response in { success: true, data: {...} }
      const responseData = response.data.data || response.data;
      const { user, accessToken, refreshToken } = responseData;
      
      // Fetch full user profile to ensure all fields are populated
      try {
        const meResponse = await api.get('/auth/me');
        const meData = meResponse.data.data || meResponse.data;
        setAuth(meData, accessToken, refreshToken);
      } catch {
        // If /auth/me fails, use the user from registration response
        setAuth(user, accessToken, refreshToken);
      }
      
      router.push('/tutor/dashboard');
    } catch (err: any) {
      // Better error parsing
      let errorMessage = 'Registration failed. Please try again.';
      
      // Log full error for debugging
      console.error('Full registration error:', err);
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
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sky-soft">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 py-12">
        <Card className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-navy-900">Become a Tutor</h2>
            <p className="text-gray-600 mt-2">Share your aviation expertise and help others succeed</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-navy-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none transition"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none transition"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none transition"
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
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none transition"
                placeholder="At least 8 characters"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Rate (USD)
              </label>
              <input
                id="hourlyRate"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none transition"
                placeholder="50.00"
              />
              <p className="text-xs text-gray-500 mt-1">Set your preferred hourly rate for lessons</p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none transition"
                rows={4}
                placeholder="Tell students about your aviation experience, qualifications, and teaching style..."
              />
              <p className="text-xs text-gray-500 mt-1">This will be visible on your tutor profile</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Tutor Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-aviation-blue hover:text-aviation-light font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

