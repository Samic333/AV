import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      description: 'Sign up as a student or tutor. Students can browse tutors, while tutors can create their profile and set their availability.',
      icon: '👤',
    },
    {
      number: '2',
      title: 'Find the Right Match',
      description: 'Browse tutors by specialty, rating, and availability. Read reviews and watch intro videos to find your perfect match.',
      icon: '🔍',
    },
    {
      number: '3',
      title: 'Book a Lesson',
      description: 'Schedule one-on-one sessions or join group classes. Choose your preferred time slot and lesson type.',
      icon: '📅',
    },
    {
      number: '4',
      title: 'Learn & Connect',
      description: 'Attend your lesson via video call. Connect with experienced aviation professionals and advance your career.',
      icon: '✈️',
    },
    {
      number: '5',
      title: 'Review & Improve',
      description: 'After each lesson, leave a review and provide feedback. Track your progress and continue learning.',
      icon: '⭐',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with AviatorTutor in five simple steps
          </p>
        </div>

        <div className="space-y-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-aviation-blue text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  {step.number}
                </div>
              </div>
              <Card className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{step.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-lg">{step.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-aviation-blue to-blue-700 text-white">
            <h2 className="text-2xl font-bold mb-4">For Students</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Browse verified aviation professionals</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Flexible scheduling to fit your timezone</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>One-on-one or group learning options</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Secure payment and booking system</span>
              </li>
            </ul>
            <Link href="/register/student">
              <Button variant="primary" className="w-full bg-white text-aviation-blue hover:bg-gray-100">
                Join as Student
              </Button>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-aviation-amber to-orange-600 text-white">
            <h2 className="text-2xl font-bold mb-4">For Tutors</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Set your own rates and schedule</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Reach students worldwide</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Manage bookings and earnings easily</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Build your reputation with reviews</span>
              </li>
            </ul>
            <Link href="/register/tutor">
              <Button variant="primary" className="w-full bg-white text-aviation-amber hover:bg-gray-100">
                Become a Tutor
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="text-center bg-aviation-sky">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-6">Join thousands of aviation professionals on AviatorTutor</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/student">
              <Button variant="primary">Start Learning</Button>
            </Link>
            <Link href="/tutors">
              <Button variant="outline">Browse Tutors</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

