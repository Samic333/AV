export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  timezone: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate: number;
  introVideoUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  averageRating?: number;
  totalLessonsTaught: number;
  totalStudents: number;
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  bookingType: 'one_on_one' | 'group_class';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  lessonType?: string;
  scheduledAt: string;
  durationMinutes: number;
  pricePerHour: number;
  totalPrice: number;
  platformFee: number;
  tutorPayout: number;
  timezone: string;
  meetingLink?: string;
  meetingId?: string;
}

