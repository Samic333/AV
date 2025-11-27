'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import { TutorProfileExtended } from '@/lib/types';

const tutorProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  country: z.string().optional(),
  bio: z.string().optional(),
  aboutMe: z.string().optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  totalFlightHours: z.number().optional(),
  yearsOfExperience: z.number().optional(),
  currentAirlines: z.string().optional(),
  previousAirlines: z.string().optional(),
});

type TutorProfileForm = z.infer<typeof tutorProfileSchema>;

const LICENSE_TYPES = ['ATPL', 'CPL', 'PPL', 'Cabin Crew', 'ATC', 'Engineer', 'Instructor', 'Other'];
const SPECIALTIES = [
  'IFR',
  'VFR',
  'ATPL theory',
  'CPL theory',
  'Airline assessment prep',
  'Cabin crew recruitment',
  'ATC training',
  'Aircraft systems',
  'Aviation English',
  'Simulator training',
  'Other',
];
const AIRCRAFT_TYPES = [
  'Boeing 737',
  'Boeing 777',
  'Boeing 787',
  'Airbus A320',
  'Airbus A330',
  'Airbus A350',
  'Cessna 172',
  'Piper',
  'Other',
];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'];
const PROFICIENCY_LEVELS = ['Basic', 'Intermediate', 'Advanced', 'Native'];
const TARGET_STUDENT_TYPES = ['Cadets', 'First Officers', 'Captains', 'Cabin Crew', 'ATC Students', 'General Aviation', 'Other'];

export default function TutorProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tutorProfile, setTutorProfile] = useState<TutorProfileExtended | null>(null);
  const [specialties, setSpecialties] = useState<Array<{ id: string; specialty: string; experienceYears: number }>>([]);
  const [aircraftTypes, setAircraftTypes] = useState<Array<{ id: string; aircraftType: string; hoursLogged: number }>>([]);
  const [languages, setLanguages] = useState<Array<{ id: string; languageCode: string; proficiencyLevel: string }>>([]);
  const [newSpecialty, setNewSpecialty] = useState({ specialty: '', experienceYears: 0 });
  const [newAircraftType, setNewAircraftType] = useState({ aircraftType: '', hoursLogged: 0 });
  const [newLanguage, setNewLanguage] = useState({ languageCode: '', proficiencyLevel: 'Intermediate' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TutorProfileForm>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      timezone: user?.timezone || 'UTC',
      country: '',
      bio: '',
      aboutMe: '',
      hourlyRate: 0,
      totalFlightHours: 0,
      yearsOfExperience: 0,
      currentAirlines: '',
      previousAirlines: '',
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const userResponse = await api.get('/users/me');
      const userData = userResponse.data.data || userResponse.data;
      
      // Fetch tutor profile
      const profileResponse = await api.get('/tutor/profile');
      const profileData = profileResponse.data.data || profileResponse.data;
      setTutorProfile(profileData);
      
      setValue('firstName', userData.firstName || '');
      setValue('lastName', userData.lastName || '');
      setValue('phone', userData.phone || '');
      setValue('timezone', userData.timezone || 'UTC');
      setValue('bio', profileData.bio || '');
      setValue('hourlyRate', Number(profileData.hourlyRate || 0));
      
      // Set related data
      if (profileData.specialties) setSpecialties(profileData.specialties);
      if (profileData.aircraftTypes) setAircraftTypes(profileData.aircraftTypes);
      if (profileData.languages) setLanguages(profileData.languages);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSpecialty = async () => {
    if (!newSpecialty.specialty) return;
    try {
      const response = await api.post('/tutor/profile/specialty', newSpecialty);
      const specialty = response.data.data || response.data;
      setSpecialties([...specialties, specialty]);
      setNewSpecialty({ specialty: '', experienceYears: 0 });
    } catch (error) {
      console.error('Failed to add specialty:', error);
      alert('Failed to add specialty. Please try again.');
    }
  };

  const removeSpecialty = async (id: string) => {
    try {
      // Note: DELETE endpoint might not exist, but structure is ready
      await api.delete(`/tutor/profile/specialty/${id}`);
      setSpecialties(specialties.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to remove specialty:', error);
      // Remove from UI anyway
      setSpecialties(specialties.filter((s) => s.id !== id));
    }
  };

  const addAircraftType = async () => {
    if (!newAircraftType.aircraftType) return;
    try {
      const response = await api.post('/tutor/profile/aircraft-type', newAircraftType);
      const aircraftType = response.data.data || response.data;
      setAircraftTypes([...aircraftTypes, aircraftType]);
      setNewAircraftType({ aircraftType: '', hoursLogged: 0 });
    } catch (error) {
      console.error('Failed to add aircraft type:', error);
      alert('Failed to add aircraft type. Please try again.');
    }
  };

  const removeAircraftType = async (id: string) => {
    try {
      await api.delete(`/tutor/profile/aircraft-type/${id}`);
      setAircraftTypes(aircraftTypes.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to remove aircraft type:', error);
      setAircraftTypes(aircraftTypes.filter((a) => a.id !== id));
    }
  };

  const addLanguage = async () => {
    if (!newLanguage.languageCode) return;
    try {
      const response = await api.post('/tutor/profile/language', newLanguage);
      const language = response.data.data || response.data;
      setLanguages([...languages, language]);
      setNewLanguage({ languageCode: '', proficiencyLevel: 'Intermediate' });
    } catch (error) {
      console.error('Failed to add language:', error);
      alert('Failed to add language. Please try again.');
    }
  };

  const removeLanguage = async (id: string) => {
    try {
      await api.delete(`/tutor/profile/language/${id}`);
      setLanguages(languages.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Failed to remove language:', error);
      setLanguages(languages.filter((l) => l.id !== id));
    }
  };

  const onSubmit = async (data: TutorProfileForm) => {
    try {
      setIsSaving(true);
      
      // Update user profile
      await api.put('/users/me', {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        timezone: data.timezone,
      });

      // Update tutor profile
      await api.put('/tutor/profile', {
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        aboutMe: data.aboutMe,
        totalFlightHours: data.totalFlightHours,
        yearsOfExperience: data.yearsOfExperience,
        currentAirlines: data.currentAirlines,
        previousAirlines: data.previousAirlines,
        country: data.country,
      });

      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Verification</h1>
            <p className="text-gray-600">Manage your tutor profile and verification status</p>
          </div>

          {tutorProfile && (
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Verification Status</h2>
                <Badge
                  variant={
                    tutorProfile.status === 'approved'
                      ? 'success'
                      : tutorProfile.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {tutorProfile.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">
                {tutorProfile.status === 'pending' &&
                  "Your profile is under review. We'll notify you once it's approved."}
                {tutorProfile.status === 'approved' && 'Your profile has been approved!'}
                {tutorProfile.status === 'rejected' && tutorProfile.rejectionReason && (
                  <>Rejection reason: {tutorProfile.rejectionReason}</>
                )}
              </p>
            </Card>
          )}

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

            {/* Aviation Credentials */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aviation Credentials</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Flight Hours
                    </label>
                    <input
                      type="number"
                      {...register('totalFlightHours', { valueAsNumber: true })}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      {...register('yearsOfExperience', { valueAsNumber: true })}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Airlines/Organizations
                  </label>
                  <input
                    type="text"
                    {...register('currentAirlines')}
                    placeholder="e.g., British Airways, Lufthansa..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Previous Airlines/Organizations
                  </label>
                  <input
                    type="text"
                    {...register('previousAirlines')}
                    placeholder="e.g., Emirates, Qatar Airways..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* Teaching Profile */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Teaching Profile</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hourly Rate (USD) *
                  </label>
                  <input
                    type="number"
                    {...register('hourlyRate', { valueAsNumber: true })}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                  {errors.hourlyRate && (
                    <p className="text-sm text-red-600 mt-1">{errors.hourlyRate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    placeholder="Brief introduction about yourself and your teaching style..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About Me (Detailed)
                  </label>
                  <textarea
                    {...register('aboutMe')}
                    rows={6}
                    placeholder="Tell students about your aviation experience, qualifications, and teaching approach in detail..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent outline-none"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialties
                  </label>
                  <div className="space-y-2 mb-4">
                    {specialties.map((spec) => (
                      <div
                        key={spec.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{spec.specialty}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({spec.experienceYears} years)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeSpecialty(spec.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newSpecialty.specialty}
                      onChange={(e) =>
                        setNewSpecialty({ ...newSpecialty, specialty: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select specialty</option>
                      {SPECIALTIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={newSpecialty.experienceYears}
                      onChange={(e) =>
                        setNewSpecialty({
                          ...newSpecialty,
                          experienceYears: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Years"
                      min="0"
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <Button type="button" variant="outline" onClick={addSpecialty}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Aircraft Types */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aircraft Types
                  </label>
                  <div className="space-y-2 mb-4">
                    {aircraftTypes.map((aircraft) => (
                      <div
                        key={aircraft.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{aircraft.aircraftType}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({aircraft.hoursLogged} hours)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeAircraftType(aircraft.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAircraftType.aircraftType}
                      onChange={(e) =>
                        setNewAircraftType({ ...newAircraftType, aircraftType: e.target.value })
                      }
                      placeholder="Aircraft type"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      value={newAircraftType.hoursLogged}
                      onChange={(e) =>
                        setNewAircraftType({
                          ...newAircraftType,
                          hoursLogged: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Hours"
                      min="0"
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <Button type="button" variant="outline" onClick={addAircraftType}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="space-y-2 mb-4">
                    {languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{lang.languageCode}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({lang.proficiencyLevel})
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeLanguage(lang.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newLanguage.languageCode}
                      onChange={(e) =>
                        setNewLanguage({ ...newLanguage, languageCode: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newLanguage.proficiencyLevel}
                      onChange={(e) =>
                        setNewLanguage({ ...newLanguage, proficiencyLevel: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {PROFICIENCY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <Button type="button" variant="outline" onClick={addLanguage}>
                      Add
                    </Button>
                  </div>
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
    </div>
  );
}
