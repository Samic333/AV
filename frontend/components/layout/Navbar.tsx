'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';
import Button from '../ui/Button';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'tutor') return '/tutor/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-aviation-blue"
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
            <span className="text-xl font-bold text-aviation-blue">AviatorTutor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tutors"
              className="text-gray-700 hover:text-aviation-blue transition-colors font-medium"
            >
              Browse Tutors
            </Link>
            <Link
              href="/group-classes"
              className="text-gray-700 hover:text-aviation-blue transition-colors font-medium"
            >
              Group Classes
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-aviation-blue transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-aviation-blue transition-colors font-medium"
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link href={getDashboardLink() || '#'}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register/student">
                  <Button variant="primary" size="sm">
                    Join as Student
                  </Button>
                </Link>
                <Link href="/register/tutor">
                  <Button variant="secondary" size="sm">
                    Become a Tutor
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-3 space-y-2">
          <Link
            href="/tutors"
            className="block text-gray-700 hover:text-aviation-blue transition-colors"
          >
            Browse Tutors
          </Link>
          <Link
            href="/group-classes"
            className="block text-gray-700 hover:text-aviation-blue transition-colors"
          >
            Group Classes
          </Link>
          <Link
            href="/how-it-works"
            className="block text-gray-700 hover:text-aviation-blue transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>
    </nav>
  );
}

