import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function GroupClassesPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Group Classes</h1>
          <p className="text-xl text-navy-700 max-w-2xl mx-auto">
            Join group learning sessions with other aviation enthusiasts
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search classes..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-blue-500 focus:border-sky-blue-500 outline-none">
            <option>All Categories</option>
            <option>IFR Training</option>
            <option>ATPL Theory</option>
            <option>Interview Prep</option>
            <option>Aviation English</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for classes - will be populated from API */}
          <Card hover className="flex flex-col">
            <div className="mb-4">
              <Badge variant="info" className="mb-2">IFR Training</Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced IFR Procedures</h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn advanced instrument flight rules and procedures with experienced instructors.
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-navy-600">Price per student</p>
                  <p className="text-2xl font-bold text-sky-blue-600">$25</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-navy-600">Max students</p>
                  <p className="text-lg font-semibold text-navy-900">10</p>
                </div>
              </div>
              <Button variant="primary" className="w-full">View Details</Button>
            </div>
          </Card>

          <Card hover className="flex flex-col">
            <div className="mb-4">
              <Badge variant="info" className="mb-2">ATPL Theory</Badge>
              <h3 className="text-xl font-bold text-navy-900 mb-2">ATPL Exam Preparation</h3>
              <p className="text-navy-700 text-sm mb-4">
                Comprehensive ATPL theory preparation covering all subjects.
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-navy-600">Price per student</p>
                  <p className="text-2xl font-bold text-sky-blue-600">$30</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-navy-600">Max students</p>
                  <p className="text-lg font-semibold text-navy-900">15</p>
                </div>
              </div>
              <Button variant="primary" className="w-full">View Details</Button>
            </div>
          </Card>

          <Card hover className="flex flex-col">
            <div className="mb-4">
              <Badge variant="info" className="mb-2">Interview Prep</Badge>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Airline Interview Masterclass</h3>
              <p className="text-navy-700 text-sm mb-4">
                Prepare for airline interviews with mock sessions and expert guidance.
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-navy-600">Price per student</p>
                  <p className="text-2xl font-bold text-sky-blue-600">$40</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-navy-600">Max students</p>
                  <p className="text-lg font-semibold text-navy-900">8</p>
                </div>
              </div>
              <Button variant="primary" className="w-full">View Details</Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-sky-blue-50 border-sky-blue-200">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Want to teach a group class?</h2>
            <p className="text-navy-700 mb-6">Share your expertise with multiple students at once</p>
            <Link href="/register/tutor">
              <Button variant="secondary">Become a Tutor</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}


