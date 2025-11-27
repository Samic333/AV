import Card from '@/components/ui/Card';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to the website owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Authentication Cookies:</strong> To keep you logged in and maintain your session</li>
              <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> To understand how visitors use our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We may also use third-party cookies from trusted partners for analytics and advertising 
              purposes. These cookies are subject to the respective third parties' privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You can control and manage cookies in various ways. Please keep in mind that removing 
              or blocking cookies can impact your user experience and parts of our website may no 
              longer be fully accessible.
            </p>
            <p className="text-gray-700 mb-4">Most browsers allow you to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>See what cookies you have and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from particular sites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
          </section>

          <section className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              If you have any questions about our use of cookies, please contact us at 
              <a href="mailto:privacy@aviatortutor.com" className="text-aviation-blue hover:underline ml-1">
                privacy@aviatortutor.com
              </a>
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}

