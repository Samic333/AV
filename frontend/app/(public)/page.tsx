import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-aviation-blue via-blue-700 to-aviation-blue text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path
              d="M0,300 Q300,200 600,300 T1200,300"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,250 Q400,150 800,250 T1200,250"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Master Aviation with Expert Tutors
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with experienced pilots, cabin crew, ATC controllers, and aviation engineers 
              for personalized one-on-one and group tutoring sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Find a Tutor
                </Button>
              </Link>
              <Link href="/register/tutor">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
                  Become a Tutor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Teach Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Who Can Teach?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our tutors are verified aviation professionals with real-world experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Commercial Pilots', icon: '✈️', desc: 'ATP, CPL, and type-rated pilots' },
              { title: 'Airline Instructors', icon: '🎓', desc: 'Certified flight instructors and examiners' },
              { title: 'Cabin Crew', icon: '👔', desc: 'Experienced flight attendants and pursers' },
              { title: 'ATC Controllers', icon: '📡', desc: 'Air traffic control specialists' },
            ].map((item, idx) => (
              <Card key={idx} hover className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Learn Section */}
      <section className="py-16 bg-aviation-sky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Can Learn</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive aviation education across all disciplines
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'IFR Training', desc: 'Instrument Flight Rules and procedures' },
              { title: 'ATPL Theory', desc: 'Airline Transport Pilot License preparation' },
              { title: 'Interview Prep', desc: 'Airline interview coaching and mock sessions' },
              { title: 'Simulator Prep', desc: 'Type rating and simulator training guidance' },
              { title: 'Aviation English', desc: 'ICAO English proficiency and communication' },
              { title: 'Cabin Crew Training', desc: 'Safety procedures and service standards' },
            ].map((item, idx) => (
              <Card key={idx} hover>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Browse Tutors', desc: 'Search and filter tutors by specialty, rating, and availability' },
              { step: '2', title: 'Book a Lesson', desc: 'Schedule one-on-one sessions or join group classes' },
              { step: '3', title: 'Learn & Grow', desc: 'Connect via video call and advance your aviation career' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-aviation-amber text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-aviation-blue to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of aviation professionals advancing their careers
          </p>
          <Link href="/register/student">
            <Button variant="primary" size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

