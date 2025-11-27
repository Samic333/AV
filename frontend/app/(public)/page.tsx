'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

// SVG Components for Hero Section
const CockpitSVG = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <rect x="20" y="40" width="160" height="80" rx="5" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2"/>
    <circle cx="60" cy="80" r="15" fill="#0ea5e9" opacity="0.3"/>
    <circle cx="140" cy="80" r="15" fill="#0ea5e9" opacity="0.3"/>
    <rect x="30" y="50" width="140" height="8" rx="2" fill="#0ea5e9" opacity="0.5"/>
    <rect x="30" y="65" width="60" height="6" rx="2" fill="#0ea5e9" opacity="0.5"/>
    <rect x="100" y="65" width="70" height="6" rx="2" fill="#0ea5e9" opacity="0.5"/>
    <rect x="30" y="100" width="140" height="8" rx="2" fill="#0ea5e9" opacity="0.5"/>
  </svg>
);

const CabinCrewSVG = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <rect x="20" y="30" width="160" height="100" rx="5" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2"/>
    <circle cx="80" cy="60" r="12" fill="#0ea5e9" opacity="0.3"/>
    <circle cx="120" cy="60" r="12" fill="#0ea5e9" opacity="0.3"/>
    <rect x="40" y="80" width="120" height="40" rx="3" fill="#0ea5e9" opacity="0.2"/>
    <line x1="50" y1="90" x2="150" y2="90" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
    <line x1="50" y1="105" x2="150" y2="105" stroke="#0ea5e9" strokeWidth="2" opacity="0.5"/>
  </svg>
);

const ATCSVG = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <rect x="30" y="40" width="140" height="80" rx="5" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2"/>
    <circle cx="100" cy="80" r="25" fill="#0ea5e9" opacity="0.2"/>
    <line x1="100" y1="55" x2="100" y2="105" stroke="#0ea5e9" strokeWidth="2"/>
    <line x1="75" y1="80" x2="125" y2="80" stroke="#0ea5e9" strokeWidth="2"/>
    <rect x="50" y="100" width="100" height="8" rx="2" fill="#0ea5e9" opacity="0.5"/>
    <circle cx="60" cy="50" r="3" fill="#0ea5e9"/>
    <circle cx="140" cy="50" r="3" fill="#0ea5e9"/>
  </svg>
);

const SimulatorSVG = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full">
    <rect x="20" y="50" width="160" height="70" rx="5" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2"/>
    <rect x="30" y="60" width="140" height="50" rx="3" fill="#0ea5e9" opacity="0.1"/>
    <circle cx="100" cy="85" r="15" fill="#0ea5e9" opacity="0.3"/>
    <rect x="40" y="95" width="120" height="6" rx="2" fill="#0ea5e9" opacity="0.5"/>
    <rect x="70" y="40" width="60" height="15" rx="2" fill="#0ea5e9" opacity="0.3"/>
  </svg>
);

function FeaturedGroupClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Try featured endpoint first, fallback to regular classes endpoint
        let response;
        try {
          response = await api.get('/classes/featured/list');
        } catch (e) {
          // If featured endpoint doesn't exist, try regular classes endpoint
          response = await api.get('/classes?limit=3');
        }
        const data = response.data.data || response.data;
        const classesList = Array.isArray(data) ? data : (data?.classes || []);
        // Filter for featured if isFeatured flag exists, otherwise take first 3
        const featured = classesList.filter((c: any) => c.isFeatured === true).slice(0, 3);
        setClasses(featured.length > 0 ? featured : classesList.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured classes:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600"></div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-navy-700">No featured classes available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.slice(0, 3).map((classItem) => (
        <Card key={classItem.id} hover>
          <Link href={`/group-classes/${classItem.id}`}>
            <Badge variant="info" className="mb-2">{classItem.category}</Badge>
            <h3 className="text-xl font-bold text-navy-900 mb-2">{classItem.title}</h3>
            <p className="text-navy-700 text-sm mb-4 line-clamp-2">{classItem.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-navy-600">Price per student</p>
                <p className="text-2xl font-bold text-sky-blue-600">
                  ${Number(classItem.pricePerStudent).toFixed(2)}
                </p>
              </div>
              <Button variant="primary" size="sm">View Class</Button>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [featuredInstructors, setFeaturedInstructors] = useState<any[]>([]);
  const [currentVisual, setCurrentVisual] = useState(0);
  const [loading, setLoading] = useState(true);

  const visuals = [
    { component: <CockpitSVG />, title: 'Pilot Training' },
    { component: <CabinCrewSVG />, title: 'Cabin Crew' },
    { component: <ATCSVG />, title: 'Air Traffic Control' },
    { component: <SimulatorSVG />, title: 'Flight Simulator' },
  ];

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        // Try featured endpoint first, fallback to regular search
        let response;
        try {
          response = await api.get('/tutors/featured/list');
        } catch (e) {
          // If featured endpoint doesn't exist, use regular search
          response = await api.get('/tutors?limit=6');
        }
        const responseData = response.data.data || response.data;
        const instructorsList = Array.isArray(responseData) ? responseData : (responseData?.tutors || []);
        setFeaturedInstructors(instructorsList);
      } catch (error) {
        console.error('Failed to fetch instructors:', error);
        setFeaturedInstructors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVisual((prev) => (prev + 1) % visuals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '👨‍✈️',
      title: '1-on-1 Lessons',
      description: 'Personalized instruction tailored to your learning goals and schedule.',
      link: '/tutors',
    },
    {
      icon: '👥',
      title: 'Group Classes',
      description: 'Learn with peers in structured group sessions at affordable rates.',
      link: '/group-classes',
    },
    {
      icon: '📚',
      title: 'Exam Prep',
      description: 'Comprehensive preparation for ATPL, IFR, and other aviation exams.',
      link: '/exam-prep',
    },
    {
      icon: '✈️',
      title: 'Airline Interview Prep',
      description: 'Expert guidance to ace your airline interviews and assessments.',
      link: '/airline-interview',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Find Your Instructor',
      description: 'Browse verified aviation professionals and find the perfect match.',
    },
    {
      number: '2',
      title: 'Book a Lesson',
      description: 'Schedule sessions that fit your timezone and learning needs.',
    },
    {
      number: '3',
      title: 'Start Learning',
      description: 'Connect via video call and advance your aviation career.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student Pilot',
      avatar: 'SJ',
      text: 'AviatorTutor helped me pass my ATPL exams with flying colors. The instructors are incredibly knowledgeable and patient.',
    },
    {
      name: 'Michael Chen',
      role: 'Cabin Crew',
      avatar: 'MC',
      text: 'The interview prep sessions were invaluable. I landed my dream job with a major airline thanks to the guidance I received.',
    },
    {
      name: 'Emma Williams',
      role: 'ATC Trainee',
      avatar: 'EW',
      text: 'Flexible scheduling and expert instruction made it easy to balance my studies with work. Highly recommend!',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-sky cloud-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
                Master Aviation with
                <span className="text-sky-blue-600"> Expert Instructors</span>
              </h1>
              <p className="text-xl text-navy-700 mb-8 leading-relaxed">
                Connect with verified aviation professionals for personalized training in pilot skills, 
                cabin crew, ATC, and more. Learn from the best, anywhere in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/tutors">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Find an Instructor
                  </Button>
                </Link>
                <Link href="/register/tutor">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Become an Instructor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-soft-lg p-8 aspect-square max-w-md mx-auto">
                <div className="h-full w-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {visuals[currentVisual].component}
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {visuals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVisual(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentVisual ? 'w-8 bg-sky-blue-600' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`View ${visuals[index].title}`}
                  />
                ))}
              </div>
              <p className="text-center mt-2 text-navy-700 font-medium">
                {visuals[currentVisual].title}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What AviatorTutor Offers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What AviatorTutor Offers</h2>
            <p className="text-xl text-navy-700 max-w-2xl mx-auto">
              Everything you need to advance your aviation career
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.link}>
                <Card hover className="text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{feature.title}</h3>
                  <p className="text-navy-700">{feature.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors Slider */}
      <section className="py-20 bg-sky-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-4">Featured Instructors</h2>
              <p className="text-xl text-navy-700">Top-rated instructors recommended for you</p>
            </div>
            <Link href="/tutors">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-blue-600"></div>
            </div>
          ) : featuredInstructors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-navy-700">No instructors available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredInstructors.slice(0, 6).map((instructor) => (
                <Card key={instructor.id} hover>
                  <Link href={`/tutors/${instructor.tutorProfile?.id || instructor.id}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-sky-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-sky-blue-700 flex-shrink-0">
                        {instructor.firstName?.[0]}{instructor.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-navy-900 mb-1 truncate">
                          {instructor.firstName} {instructor.lastName}
                        </h3>
                        <Badge variant="info" className="mb-2">
                          {instructor.tutorProfile?.specialties?.[0]?.specialty || 'Aviation Professional'}
                        </Badge>
                        {instructor.tutorProfile?.averageRating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-semibold text-navy-700">
                              {instructor.tutorProfile.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-navy-600">
                              ({instructor.tutorProfile.totalLessonsTaught || 0} lessons)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {instructor.tutorProfile?.bio && (
                      <p className="text-sm text-navy-700 mb-4 line-clamp-2">
                        {instructor.tutorProfile.bio}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-navy-600">Starting at</p>
                        <p className="text-2xl font-bold text-sky-blue-600">
                          ${instructor.tutorProfile?.hourlyRate || 'N/A'}/hr
                        </p>
                      </div>
                      <Button variant="primary" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Group Classes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-navy-900 mb-4">Featured Group Classes</h2>
              <p className="text-xl text-navy-700">Popular classes you can join today</p>
            </div>
            <Link href="/group-classes">
              <Button variant="outline">View All Classes</Button>
            </Link>
          </div>
          <FeaturedGroupClasses />
        </div>
      </section>

      {/* Airline Logos Banner */}
      <section className="py-12 bg-gradient-to-r from-sky-blue-600 to-sky-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Trusted by Aviation Professionals Worldwide</h2>
            <p className="text-sky-blue-100">Prepare for interviews with major airlines</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
            {['Ethiopian Airlines', 'Emirates', 'Qatar Airways', 'Etihad Airways', 'Turkish Airlines', 'Lufthansa'].map((airline) => (
              <div key={airline} className="text-white font-semibold text-lg">
                {airline}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">How It Works</h2>
            <p className="text-xl text-navy-700 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-sky-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
                <p className="text-navy-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-sky-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-navy-700 max-w-2xl mx-auto">
              Join thousands of satisfied students advancing their aviation careers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-sky-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900">{testimonial.name}</h4>
                    <p className="text-sm text-navy-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-navy-700 flex-grow">"{testimonial.text}"</p>
                <div className="flex text-yellow-500 mt-4">
                  {'⭐'.repeat(5)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Trusted by Aviation Professionals</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-navy-700">Verified Instructors</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-navy-700">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-navy-700">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-navy-700">Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
