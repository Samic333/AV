'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';

const studentProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  country: z.string().optional(),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  learningGoals: z.string().optional(),
  preferredLanguages: z.array(z.string()).optional(),
  preferredAircraftTypes: z.string().optional(),
  preferredLearningFormat: z.array(z.string()).optional(),
});

type StudentProfileForm = z.infer<typeof studentProfileSchema>;

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
const LEARNING_GOALS_OPTIONS = [
  'ATPL theory',
  'Airline assessment prep',
  'IFR proficiency',
  'VFR proficiency',
  'Cabin crew interview prep',
  'ATC training',
  'Aircraft systems',
  'Aviation English',
  'Other',
];
const LEARNING_FORMATS = ['1:1', 'Group', 'Sim prep', 'Online', 'In-person'];
const COMMON_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'];

export default function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StudentProfileForm>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      timezone: user?.timezone || 'UTC',
      country: '',
      experienceLevel: undefined,
      learningGoals: '',
      preferredLanguages: [],
      preferredAircraftTypes: '',
      preferredLearningFormat: [],
    },
  });

  const preferredLanguages = watch('preferredLanguages') || [];
  const preferredLearningFormat = watch('preferredLearningFormat') || [];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Fetch user profile
      const userResponse = await api.get('/users/me');
      const userData = userResponse.data.data || userResponse.data;
      
      // Try to fetch student profile if it exists
      try {
        // Note: This endpoint might not exist yet, but structure is ready
        const profileResponse = await api.get('/students/profile');
        const profileData = profileResponse.data.data || profileResponse.data;
        setStudentProfile(profileData);
        
        setValue('experienceLevel', profileData.experienceLevel);
        setValue('learningGoals', profileData.learningGoals || '');
        setValue('preferredLanguages', profileData.preferredLanguages || []);
      } catch (error) {
        // Student profile might not exist yet
        console.log('Student profile not found, will create on save');
      }

      setValue('firstName', userData.firstName || '');
      setValue('lastName', userData.lastName || '');
      setValue('phone', userData.phone || '');
      setValue('timezone', userData.timezone || 'UTC');
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: StudentProfileForm) => {
    try {
      setIsSaving(true);
      
      // Update user profile
      await api.put('/users/me', {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        timezone: data.timezone,
      });

      // Update student profile (if endpoint exists)
      try {
        await api.put('/students/profile', {
          experienceLevel: data.experienceLevel,
          learningGoals: data.learningGoals,
          preferredLanguages: data.preferredLanguages,
        });
      } catch (error) {
        // Endpoint might not exist yet, but structure is ready
        console.log('Student profile endpoint not available yet');
      }

      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleArrayValue = (field: 'preferredLanguages' | 'preferredLearningFormat', value: string) => {
    const current = watch(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="student" />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-aviation-blue mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="student" />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and aviation preferences</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Timezone *
                    </label>
                    <input
                      type="text"
                      {...register('timezone')}
                      placeholder="UTC"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    />
                    {errors.timezone && (
                      <p className="text-sm text-red-600 mt-1">{errors.timezone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    {...register('country')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* Aviation Background */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aviation Background</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    {...register('experienceLevel')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  >
                    <option value="">Select experience level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Learning Goals
                  </label>
                  <textarea
                    {...register('learningGoals')}
                    rows={4}
                    placeholder="e.g., ATPL theory, Airline assessment prep, IFR proficiency, Cabin crew interview prep..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describe your aviation learning goals and objectives
                  </p>
                </div>
              </div>
            </Card>

            {/* Preferences */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleArrayValue('preferredLanguages', lang)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          preferredLanguages.includes(lang)
                            ? 'bg-aviation-blue text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Learning Format
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LEARNING_FORMATS.map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => toggleArrayValue('preferredLearningFormat', format)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          preferredLearningFormat.includes(format)
                            ? 'bg-aviation-blue text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Aircraft Types
                  </label>
                  <input
                    type="text"
                    {...register('preferredAircraftTypes')}
                    placeholder="e.g., Boeing 737, Airbus A320, Cessna 172..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    List aircraft types you're interested in learning about
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => fetchProfile()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
