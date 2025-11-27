'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function NewBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lessonType: '',
    description: '',
    durationMinutes: 60,
    hourlyRate: '',
    scheduledAt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would create a booking request or set availability
    // For now, redirect to availability page
    router.push('/tutor/availability');
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Schedule 1-on-1 Lesson</h1>
          <p className="text-navy-600">Set your availability and students can book lessons with you</p>
        </div>

        <Card>
          <div className="p-6">
            <p className="text-navy-700 mb-4">
              To schedule 1-on-1 lessons, you need to set your availability first. Students will then be able to book lessons during your available time slots.
            </p>
            <Button variant="primary" onClick={() => router.push('/tutor/availability')}>
              Go to Availability Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

