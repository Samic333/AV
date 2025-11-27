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
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  tutor?: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'booking_cancelled'
  | 'message'
  | 'payment'
  | 'tutor_approved'
  | 'tutor_rejected'
  | 'class_approved'
  | 'class_rejected';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  learningGoals?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredLanguages?: string[];
  preferredAircraftTypes?: string[];
  preferredLearningFormat?: string[];
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfileExtended extends TutorProfile {
  licenses?: Array<{
    id: string;
    licenseType: string;
    licenseNumber: string;
    issuingAuthority: string;
    issueDate?: string;
    expiryDate?: string;
    verified: boolean;
  }>;
  aircraftTypes?: Array<{
    id: string;
    aircraftType: string;
    hoursLogged: number;
  }>;
  specialties?: Array<{
    id: string;
    specialty: string;
    experienceYears: number;
  }>;
  languages?: Array<{
    id: string;
    languageCode: string;
    proficiencyLevel: string;
  }>;
  aboutMe?: string;
  totalFlightHours?: number;
  yearsOfExperience?: number;
  currentAirlines?: string;
  previousAirlines?: string;
  targetStudentTypes?: string[];
  country?: string;
}

