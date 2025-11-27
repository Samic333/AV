'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/tutors', label: 'Find Instructors' },
    { href: '/group-classes', label: 'Group Classes' },
    { href: '/community', label: 'Community' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-soft' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <svg
              className="w-10 h-10 text-sky-blue-600"
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
            <span className="text-2xl font-bold text-navy-900">AviatorTutor</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-sky-blue-600 bg-sky-blue-50'
                    : 'text-navy-700 hover:text-sky-blue-600 hover:bg-sky-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <>
                <Link
                  href={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : user.role === 'tutor'
                      ? '/tutor/dashboard'
                      : '/student/dashboard'
                  }
                  className="text-sm font-medium text-navy-700 hover:text-sky-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-navy-700 hover:text-sky-blue-600 transition-colors"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-navy-700 hover:text-sky-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register/student"
                  className="text-sm font-medium text-navy-700 hover:text-sky-blue-600 transition-colors"
                >
                  Register
                </Link>
                <Link
                  href="/register/tutor"
                  className="px-4 py-2 bg-sky-blue-600 text-white rounded-lg text-sm font-medium hover:bg-sky-blue-700 transition-colors shadow-soft"
                >
                  Become an Instructor
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-navy-700 hover:text-sky-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-sky-blue-600 bg-sky-blue-50'
                    : 'text-navy-700 hover:text-sky-blue-600 hover:bg-sky-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <Link
                    href={
                      user.role === 'admin'
                        ? '/admin/dashboard'
                        : user.role === 'tutor'
                        ? '/tutor/dashboard'
                        : '/student/dashboard'
                    }
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-base font-medium text-navy-700 hover:text-sky-blue-600 hover:bg-sky-blue-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-base font-medium text-navy-700 hover:text-sky-blue-600 hover:bg-sky-blue-50 transition-colors"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-base font-medium text-navy-700 hover:text-sky-blue-600 hover:bg-sky-blue-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register/student"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-base font-medium text-navy-700 hover:text-sky-blue-600 hover:bg-sky-blue-50 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    href="/register/tutor"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-base font-medium bg-sky-blue-600 text-white hover:bg-sky-blue-700 transition-colors text-center"
                  >
                    Become an Instructor
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
