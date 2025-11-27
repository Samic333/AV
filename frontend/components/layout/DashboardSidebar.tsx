'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  role: UserRole;
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: '📊' },
  { label: 'My Bookings', href: '/student/bookings', icon: '📅' },
  { label: 'Messages', href: '/student/messages', icon: '💬' },
  { label: 'Payments', href: '/student/payments', icon: '💳' },
  { label: 'Profile', href: '/student/profile', icon: '👤' },
];

const tutorNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/tutor/dashboard', icon: '📊' },
  { label: 'Profile & Verification', href: '/tutor/profile', icon: '👤' },
  { label: 'Availability', href: '/tutor/availability', icon: '📅' },
  { label: 'Bookings', href: '/tutor/bookings', icon: '📋' },
  { label: 'Group Classes', href: '/tutor/classes', icon: '👥' },
  { label: 'Earnings', href: '/tutor/earnings', icon: '💰' },
  { label: 'Messages', href: '/tutor/messages', icon: '💬' },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Tutors', href: '/admin/tutors', icon: '👨‍🏫' },
  { label: 'Students', href: '/admin/students', icon: '👨‍🎓' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📋' },
  { label: 'Payments', href: '/admin/payments', icon: '💳' },
  { label: 'Group Classes', href: '/admin/classes', icon: '👥' },
];

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  
  const navItems = role === 'student' 
    ? studentNavItems 
    : role === 'tutor' 
    ? tutorNavItems 
    : adminNavItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
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
        </div>
        <p className="text-xs text-gray-500 capitalize">{role} Dashboard</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sky-blue-600 text-white'
                  : 'text-navy-700 hover:bg-sky-blue-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


