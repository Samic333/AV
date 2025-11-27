'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateClassModal({ isOpen, onClose }: CreateClassModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGroupClass = () => {
    onClose();
    router.push('/tutor/classes/new');
  };

  const handleOneOnOne = () => {
    onClose();
    // Route to booking creation or availability page
    router.push('/tutor/bookings/new');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Create Class</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGroupClass}
              className="w-full p-6 border-2 border-sky-blue-200 rounded-lg hover:border-sky-blue-600 hover:bg-sky-blue-50 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy-900 mb-1">Group Class</h3>
                  <p className="text-sm text-navy-600">
                    Create a group learning session where multiple students can enroll. Set a fixed price per student and maximum capacity.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={handleOneOnOne}
              className="w-full p-6 border-2 border-sky-blue-200 rounded-lg hover:border-sky-blue-600 hover:bg-sky-blue-50 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy-900 mb-1">1-on-1 Class</h3>
                  <p className="text-sm text-navy-600">
                    Schedule a personalized one-on-one lesson with a student. Set your availability and hourly rate.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

