import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using AviatorTutor.com, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily use AviatorTutor.com for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and 
              under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Tutor Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              Tutors are responsible for providing accurate information about their qualifications, 
              experience, and availability. Tutors must maintain professional conduct during all 
              lessons and interactions with students.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Student Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              Students are responsible for attending scheduled lessons on time and providing accurate 
              information when booking. Cancellations must be made according to our cancellation policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payments and Refunds</h2>
            <p className="text-gray-700 mb-4">
              All payments are processed securely through our platform. Refund policies vary by 
              lesson type and cancellation timing. Please refer to our refund policy for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              AviatorTutor.com shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@aviatortutor.com" className="text-aviation-blue hover:underline ml-1">
                legal@aviatortutor.com
              </a>
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}

