'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

interface AvailabilitySlot {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function TutorAvailabilityPage() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tutor/availability');
      const data = response.data.data || response.data;
      const slots = Array.isArray(data) ? data : [];
      
      // Initialize all days if none exist
      if (slots.length === 0) {
        const initialSlots = DAYS.map((_, index) => ({
          dayOfWeek: index,
          startTime: '09:00',
          endTime: '17:00',
          isActive: false,
        }));
        setAvailability(initialSlots);
      } else {
        setAvailability(slots);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      // Initialize with default slots on error
      const initialSlots = DAYS.map((_, index) => ({
        dayOfWeek: index,
        startTime: '09:00',
        endTime: '17:00',
        isActive: false,
      }));
      setAvailability(initialSlots);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put('/tutor/availability', {
        slots: availability.filter((slot) => slot.isActive),
      });
      alert('Availability updated successfully!');
      fetchAvailability();
    } catch (error) {
      console.error('Failed to save availability:', error);
      alert('Failed to save availability. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSlot = (dayOfWeek: number, field: keyof AvailabilitySlot, value: any) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot
      )
    );
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
            <p className="text-gray-600">Set your available time slots for lessons</p>
          </div>

          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
              <p className="text-gray-600 mb-6">
                Select the days and times when you're available to teach. Students will only be
                able to book lessons during these time slots.
              </p>

              <div className="space-y-4">
                {DAYS.map((day, index) => {
                  const slot = availability.find((s) => s.dayOfWeek === index) || {
                    dayOfWeek: index,
                    startTime: '09:00',
                    endTime: '17:00',
                    isActive: false,
                  };

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={slot.isActive}
                        onChange={(e) => updateSlot(index, 'isActive', e.target.checked)}
                        className="w-5 h-5 text-aviation-blue rounded"
                      />
                      <label className="flex-1 font-medium text-gray-900 min-w-[120px]">
                        {day}
                      </label>
                      {slot.isActive && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <span className="text-gray-600">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      )}
                      {!slot.isActive && (
                        <span className="text-sm text-gray-500">Not available</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Availability'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

