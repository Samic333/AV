import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'

export const metadata: Metadata = {
  title: 'AviatorTutor.com - Aviation Tutoring Marketplace',
  description: 'Connect with aviation tutors for pilot training, cabin crew, ATC, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

