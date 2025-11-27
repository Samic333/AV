import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Find Your Instructor',
      description: 'Browse verified aviation professionals and find the perfect match for your learning goals.',
      icon: '🔍',
    },
    {
      number: '2',
      title: 'Book a Lesson',
      description: 'Schedule sessions that fit your timezone and learning needs. Choose one-on-one or group classes.',
      icon: '📅',
    },
    {
      number: '3',
      title: 'Start Learning',
      description: 'Connect via video call and advance your aviation career with expert guidance.',
      icon: '✈️',
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">How It Works</h1>
          <p className="text-xl text-navy-700 max-w-2xl mx-auto">
            Get started with AviatorTutor in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} hover className="text-center">
              <div className="w-20 h-20 bg-sky-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">{step.title}</h3>
              <p className="text-navy-700 leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-sky-blue-600 to-sky-blue-700 text-white">
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
              <Button variant="primary" className="w-full bg-white text-sky-blue-600 hover:bg-gray-100">
                Join as Student
              </Button>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-navy-900 to-navy-800 text-white">
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
              <Button variant="primary" className="w-full bg-white text-navy-900 hover:bg-gray-100">
                Become a Tutor
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="text-center bg-sky-blue-50">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Ready to Get Started?</h2>
          <p className="text-navy-700 mb-6">Join thousands of aviation professionals on AviatorTutor</p>
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


