'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

const CLASS_CATEGORIES = [
  'ATPL Theory',
  'IFR Procedures',
  'MCC/JOC',
  'Sim Check Prep',
  'Cabin Crew Interview Prep',
  'Safety & Emergency',
  'ATC Phraseology',
  'Maintenance & Engineering',
  'Dispatch & Operations',
  'Aviation English',
];

export default function NewClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    category: '',
    pricePerStudent: '',
    maxStudents: '',
    durationMinutes: '',
    scheduledAt: '',
    pictureUrl: '',
    videoUrl: '',
    language: '',
    aircraftType: '',
    airlineFocus: '',
    isFeatured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tutor/classes', {
        title: formData.title,
        description: formData.description,
        topic: formData.topic || formData.title,
        category: formData.category,
        pricePerStudent: parseFloat(formData.pricePerStudent),
        maxStudents: parseInt(formData.maxStudents),
        durationMinutes: parseInt(formData.durationMinutes),
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        pictureUrl: formData.pictureUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        language: formData.language || undefined,
        aircraftType: formData.aircraftType || undefined,
        airlineFocus: formData.airlineFocus || undefined,
        isFeatured: formData.isFeatured,
      });
      router.push('/tutor/classes');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy-900 mb-2">Create Group Class</h1>
              <p className="text-navy-600">Set up a new group learning session</p>
            </div>

            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Class Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Advanced IFR Procedures"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    placeholder="Describe what students will learn in this class..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select category</option>
                      {CLASS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                      placeholder="Optional topic tag"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Max Students *
                    </label>
                    <input
                      type="number"
                      required
                      min="2"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Price per Student (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.pricePerStudent}
                      onChange={(e) => setFormData({ ...formData, pricePerStudent: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="30"
                      step="30"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Scheduled Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Language
                    </label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                      placeholder="e.g., English, French"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Aircraft Type
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                      placeholder="e.g., A320, B737"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-2">
                    Airline Focus
                  </label>
                  <input
                    type="text"
                    value={formData.airlineFocus}
                    onChange={(e) => setFormData({ ...formData, airlineFocus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Ethiopian, Emirates, Qatar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Picture URL
                    </label>
                    <input
                      type="url"
                      value={formData.pictureUrl}
                      onChange={(e) => setFormData({ ...formData, pictureUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue-500 focus:border-transparent outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-sky-blue-600 border-gray-300 rounded focus:ring-sky-blue-500"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm text-navy-700">
                    Mark as featured (subject to admin approval)
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Class'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
        </div>
      </div>
  );
}
