'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CommunityPage() {
  const communityLinks = [
    {
      name: 'Forum',
      description: 'Join discussions, ask questions, and share knowledge with the aviation community',
      icon: '💬',
      href: '/forum', // Placeholder for now
      color: 'bg-blue-500',
    },
    {
      name: 'Telegram',
      description: 'Real-time chat and networking with aviation professionals worldwide',
      icon: '✈️',
      href: 'https://t.me/aviatortutor', // Placeholder link
      color: 'bg-sky-500',
      external: true,
    },
    {
      name: 'Instagram',
      description: 'Follow us for aviation tips, success stories, and community highlights',
      icon: '📸',
      href: 'https://instagram.com/aviatortutor', // Placeholder link
      color: 'bg-pink-500',
      external: true,
    },
    {
      name: 'WhatsApp',
      description: 'Quick support and community updates via WhatsApp',
      icon: '💬',
      href: 'https://wa.me/1234567890', // Placeholder link
      color: 'bg-green-500',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Join Our Community</h1>
          <p className="text-xl text-navy-700 max-w-3xl mx-auto">
            Connect with aviation professionals, share opportunities, and grow together
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-16">
          <Card className="p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Why Join Our Community?</h2>
              <p className="text-lg text-navy-700 max-w-3xl mx-auto mb-6">
                Our community is a place where aviation professionals come together to network, 
                share opportunities, and support each other's growth. Whether you're looking for 
                job leads, interview tips, study groups, or just want to connect with like-minded 
                individuals, you'll find it here.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-sky-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy-900 mb-2">Forums & Discussions</h3>
                  <p className="text-sm text-navy-700">Engage in meaningful conversations, ask questions, and share your aviation knowledge with peers.</p>
                </div>
                <div className="bg-sky-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy-900 mb-2">Networking</h3>
                  <p className="text-sm text-navy-700">Connect with pilots, cabin crew, ATC professionals, and mechanics from around the world.</p>
                </div>
                <div className="bg-sky-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy-900 mb-2">Career Support</h3>
                  <p className="text-sm text-navy-700">Get help with jobs, interviews, training opportunities, and career advancement.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Get Help with Your Next Airline Interview</h3>
                  <p className="text-navy-700">
                    Get access to exclusive job postings, internship opportunities, and career advice 
                    from industry professionals. Learn from those who've successfully navigated airline interviews.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Interview Tips & Prep</h3>
                  <p className="text-navy-700">
                    Learn from successful candidates who've aced airline interviews. Get insider tips 
                    and practice with mock interviews.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Share Study Notes, Simulator Tips, and Experiences</h3>
                  <p className="text-navy-700">
                    Form study groups for ATPL, IFR, and other exams. Share resources, simulator tips, 
                    study notes, and real-world experiences with peers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sky-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Connect with Aviators Worldwide</h3>
                  <p className="text-navy-700">
                    Connect with pilots, cabin crew, ATC professionals, and instructors from around 
                    the world. Build your professional network and share experiences.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Community Links */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-navy-900 text-center mb-8">Join Us On</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityLinks.map((link) => (
              <Card key={link.name} hover className="flex flex-col items-center text-center p-6">
                <div className={`w-16 h-16 ${link.color} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-3xl">{link.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{link.name}</h3>
                <p className="text-navy-700 text-sm mb-4 flex-grow">{link.description}</p>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="primary" className="w-full">
                      Join {link.name}
                    </Button>
                  </a>
                ) : (
                  <Link href={link.href} className="w-full">
                    <Button variant="primary" className="w-full">
                      Visit {link.name}
                    </Button>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Building Section */}
        <Card className="bg-sky-blue-50 border-sky-blue-200 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Trusted by Aviation Professionals</h2>
            <p className="text-navy-700 mb-6 max-w-2xl mx-auto">
              Join thousands of aviation professionals who are already part of our growing community. 
              Together, we're building the future of aviation education and networking.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-blue-600">10K+</div>
                <div className="text-sm text-navy-600">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-blue-600">50+</div>
                <div className="text-sm text-navy-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-blue-600">24/7</div>
                <div className="text-sm text-navy-600">Active Discussions</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

