'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import NotificationBell from '@/components/notifications/NotificationBell';
import Button from '@/components/ui/Button';
import CreateClassModal from '@/components/instructor/CreateClassModal';

export default function TopBar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsAvatarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'tutor') return '/tutor/dashboard';
    return '/student/dashboard';
  };

  const getProfileLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/users';
    if (user.role === 'tutor') return '/tutor/profile';
    return '/student/profile';
  };

  const handleLogout = async () => {
    setIsAvatarOpen(false);
    await logout();
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-sky-blue-600"
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
            <span className="text-xl font-bold text-navy-900">AviatorTutor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tutors"
              className="text-navy-700 hover:text-sky-blue-600 transition-colors font-medium"
            >
              Find Instructor
            </Link>
            <Link
              href="/group-classes"
              className="text-navy-700 hover:text-sky-blue-600 transition-colors font-medium"
            >
              Group Classes
            </Link>
            <Link
              href="/how-it-works"
              className="text-navy-700 hover:text-sky-blue-600 transition-colors font-medium"
            >
              How It Works
            </Link>
          </div>

          {/* Right Side: Create Class (for instructors), Notifications and Avatar */}
          <div className="flex items-center space-x-4">
            {user?.role === 'tutor' && (
              <Button
                variant="primary"
                onClick={() => setIsCreateClassModalOpen(true)}
                className="hidden md:flex"
              >
                Create Class
              </Button>
            )}
            <NotificationBell />
            
            {/* Avatar Dropdown */}
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-sky-blue-500 focus:ring-offset-2 rounded-full"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sky-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {getInitials()}
                  </div>
                )}
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${isAvatarOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsAvatarOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href={getProfileLink()}
                      onClick={() => setIsAvatarOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href={user?.role === 'admin' ? '/admin/settings' : user?.role === 'tutor' ? '/tutor/settings' : '/student/settings'}
                      onClick={() => setIsAvatarOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
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
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/tutors"
              onClick={() => setIsMenuOpen(false)}
              className="block text-navy-700 hover:text-sky-blue-600 transition-colors"
            >
              Find Instructor
            </Link>
            <Link
              href="/group-classes"
              onClick={() => setIsMenuOpen(false)}
              className="block text-navy-700 hover:text-sky-blue-600 transition-colors"
            >
              Group Classes
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="block text-navy-700 hover:text-sky-blue-600 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      )}
      <CreateClassModal
        isOpen={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
      />
    </nav>
  );
}


