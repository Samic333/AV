import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}

