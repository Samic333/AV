import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">About AviatorTutor</h1>
          <p className="text-xl text-navy-700">
            Connecting aviation professionals with learners worldwide
          </p>
        </div>

        <div className="space-y-12">
          <Card>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Our Mission</h2>
            <p className="text-navy-700 mb-4 leading-relaxed">
              AviatorTutor was founded with a simple mission: to make high-quality aviation education 
              accessible to everyone, everywhere. We believe that learning from experienced professionals 
              is the best way to advance your aviation career.
            </p>
            <p className="text-navy-700 leading-relaxed">
              Whether you're a student pilot working towards your license, a cabin crew member preparing 
              for interviews, an ATC controller studying for exams, or an aviation engineer looking to 
              expand your knowledge, AviatorTutor connects you with the right instructors.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">What We Offer</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Verified Instructors</h3>
                <p className="text-navy-700">
                  All our tutors are verified aviation professionals with real-world experience. 
                  We verify licenses, certifications, and work history to ensure quality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Flexible Learning</h3>
                <p className="text-navy-700">
                  Choose between one-on-one lessons or group classes. Schedule sessions that fit 
                  your timezone and availability.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Comprehensive Subjects</h3>
                <p className="text-navy-700">
                  From IFR training to ATPL theory, interview prep to aviation English, we cover 
                  all aspects of aviation education.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Secure Platform</h3>
                <p className="text-navy-700">
                  Our platform ensures secure payments, reliable video calls, and a safe learning 
                  environment for all users.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Who Can Use AviatorTutor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Students</h3>
                <ul className="space-y-2 text-navy-700">
                  <li>• Student pilots</li>
                  <li>• Aspiring cabin crew</li>
                  <li>• ATC trainees</li>
                  <li>• Aviation engineering students</li>
                  <li>• Career changers</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Tutors</h3>
                <ul className="space-y-2 text-navy-700">
                  <li>• Commercial pilots</li>
                  <li>• Flight instructors</li>
                  <li>• Airline examiners</li>
                  <li>• Cabin crew trainers</li>
                  <li>• ATC specialists</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="bg-sky-blue-50 text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Join Our Community</h2>
            <p className="text-navy-700 mb-6">
              Whether you want to learn or teach, AviatorTutor is the place for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/student">
                <Button variant="primary">Join as Student</Button>
              </Link>
              <Link href="/register/tutor">
                <Button variant="secondary">Become a Tutor</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


