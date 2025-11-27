import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transparent pricing for students and tutors
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">One-on-One Lessons</h3>
                <p className="text-gray-600">Pay per lesson with your chosen tutor</p>
              </div>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-aviation-blue">Varies</span>
                  <p className="text-sm text-gray-600 mt-2">Set by tutor</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Personalized instruction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Flexible scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Direct tutor communication</span>
                  </li>
                </ul>
              </div>
              <Link href="/tutors">
                <Button variant="primary" className="w-full">Browse Tutors</Button>
              </Link>
            </Card>

            <Card className="border-2 border-aviation-blue">
              <Badge variant="info" className="mb-4">Popular</Badge>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Group Classes</h3>
                <p className="text-gray-600">Join group sessions at lower cost</p>
              </div>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-aviation-blue">$25-50</span>
                  <p className="text-sm text-gray-600 mt-2">Per session</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Affordable pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Learn with peers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Structured curriculum</span>
                  </li>
                </ul>
              </div>
              <Link href="/group-classes">
                <Button variant="secondary" className="w-full">View Classes</Button>
              </Link>
            </Card>

            <Card>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Fee</h3>
                <p className="text-gray-600">Service charge per booking</p>
              </div>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-aviation-blue">10%</span>
                  <p className="text-sm text-gray-600 mt-2">Of lesson price</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Secure payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Customer support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-600">Platform maintenance</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For Tutors</h2>
          <Card className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Earn What You Deserve</h3>
              <p className="text-gray-600">Set your own rates and keep most of your earnings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">You Set Your Rate</h4>
                <p className="text-sm text-gray-600">Choose your hourly rate based on your experience and expertise</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Platform Commission</h4>
                <p className="text-sm text-gray-600">We take 15% to cover payment processing and platform services</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">You Keep 85%</h4>
                <p className="text-sm text-gray-600">The majority of your earnings go directly to you</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Flexible Payouts</h4>
                <p className="text-sm text-gray-600">Request payouts whenever you want, processed within 3-5 business days</p>
              </div>
            </div>
            <Link href="/register/tutor">
              <Button variant="primary" className="w-full">Become a Tutor</Button>
            </Link>
          </Card>
        </div>

        <Card className="bg-aviation-sky text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-gray-700 mb-6">Contact us for more information about our pricing</p>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

