export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">AviatorTutor.com</h1>
        <p className="text-lg mb-8">Aviation Tutoring Marketplace</p>
        <div className="space-y-4">
          <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
            Login
          </a>
          <a href="/register/student" className="inline-block px-4 py-2 bg-green-600 text-white rounded ml-4">
            Register as Student
          </a>
          <a href="/register/tutor" className="inline-block px-4 py-2 bg-purple-600 text-white rounded ml-4">
            Register as Tutor
          </a>
        </div>
      </div>
    </main>
  )
}

