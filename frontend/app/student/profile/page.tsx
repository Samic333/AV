'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';

const studentProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  secondaryEmail: z.string().email().optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  country: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  yearsOfAviationExperience: z.number().min(0).max(40).optional(),
  learningGoals: z.string().optional(),
  preferredLanguages: z.array(z.string()).optional(),
  preferredAircraftTypes: z.array(z.string()).optional(),
  currentRole: z.string().optional(),
  currentCompany: z.string().optional(),
});

type StudentProfileForm = z.infer<typeof studentProfileSchema>;

const COMMON_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese', 'Russian', 'Hindi', 'Korean'];
const AIRCRAFT_TYPES = ['Q400', 'A320', 'B737', 'B787', 'ATR72', 'A330', 'A350', 'B777', 'Cessna 172', 'Piper', 'DA-42', 'Other'];
const COUNTRIES = [
  'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Portugal', 'Greece',
  'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Egypt', 'South Africa', 'Kenya',
  'Nigeria', 'Ethiopia', 'Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Philippines', 'India',
  'China', 'Japan', 'South Korea', 'Hong Kong', 'Taiwan', 'New Zealand', 'Brazil', 'Mexico', 'Argentina',
  'Chile', 'Colombia', 'Turkey', 'Israel', 'Russia', 'Ukraine', 'Other'
];

const getTimezoneForCountry = (country: string): string => {
  const timezoneMap: Record<string, string> = {
    'USA': 'America/New_York',
    'UK': 'Europe/London',
    'Canada': 'America/Toronto',
    'Australia': 'Australia/Sydney',
    'Germany': 'Europe/Berlin',
    'France': 'Europe/Paris',
    'UAE': 'Asia/Dubai',
    'Singapore': 'Asia/Singapore',
    'India': 'Asia/Kolkata',
    'Japan': 'Asia/Tokyo',
    'China': 'Asia/Shanghai',
  };
  return timezoneMap[country] || 'UTC';
};

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
      address: '',
      city: '',
      secondaryEmail: '',
      yearsOfAviationExperience: 0,
      learningGoals: '',
      preferredLanguages: [],
      preferredAircraftTypes: [],
      currentRole: '',
      currentCompany: '',
    },
  });

  const preferredLanguages = watch('preferredLanguages') || [];
  const preferredAircraftTypes = watch('preferredAircraftTypes') || [];
  const country = watch('country');

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
        
        setValue('yearsOfAviationExperience', profileData.yearsOfAviationExperience || 0);
        setValue('learningGoals', profileData.learningGoals || '');
        setValue('preferredLanguages', profileData.preferredLanguages || []);
        setValue('preferredAircraftTypes', profileData.preferredAircraftTypes || []);
        setValue('currentRole', profileData.currentRole || '');
        setValue('currentCompany', profileData.currentCompany || '');
        setValue('city', profileData.city || '');
        setValue('country', userData.country || '');
        setValue('address', userData.address || '');
        setValue('secondaryEmail', userData.secondaryEmail || '');
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
        country: data.country,
        address: data.address,
        secondaryEmail: data.secondaryEmail || null,
      });

      // Update student profile
      try {
        await api.put('/students/profile', {
          yearsOfAviationExperience: data.yearsOfAviationExperience,
          learningGoals: data.learningGoals,
          preferredLanguages: data.preferredLanguages,
          preferredAircraftTypes: data.preferredAircraftTypes,
          currentRole: data.currentRole,
          currentCompany: data.currentCompany,
          city: data.city,
        });
      } catch (error) {
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

  const toggleArrayValue = (field: 'preferredLanguages' | 'preferredAircraftTypes', value: string) => {
    const current = watch(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated);
  };

  useEffect(() => {
    if (country) {
      const timezone = getTimezoneForCountry(country);
      setValue('timezone', timezone);
    }
  }, [country, setValue]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Email</label>
                    <input
                      type="email"
                      {...register('secondaryEmail')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <select
                    {...register('country')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                    {errors.timezone && (
                      <p className="text-sm text-red-600 mt-1">{errors.timezone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* Aviation Background */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aviation Background</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Aviation Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      {...register('yearsOfAviationExperience', { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Role
                    </label>
                    <input
                      type="text"
                      {...register('currentRole')}
                      placeholder="e.g., Student Pilot, First Officer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Company/Airline
                  </label>
                  <input
                    type="text"
                    {...register('currentCompany')}
                    placeholder="e.g., Flight School, Airline Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                  />
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
                            ? 'bg-sky-blue-600 text-white'
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
                    Preferred Aircraft Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AIRCRAFT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayValue('preferredAircraftTypes', type)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          preferredAircraftTypes.includes(type)
                            ? 'bg-sky-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Select aircraft types you're interested in learning about
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
      </div>
  );
}
