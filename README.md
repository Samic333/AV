# AviatorTutor.com

A global aviation tutoring marketplace connecting aviation tutors with students.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Cache**: Redis
- **File Storage**: AWS S3 / Cloudinary
- **Payments**: Flutterwave, PayPal, M-Pesa
- **Video**: Zoom API, Google Meet API

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Set up database
cd backend
npx prisma migrate dev
npx prisma generate

# Start development servers
npm run dev
```

## Project Structure

```
├── backend/          # NestJS backend API
├── frontend/         # Next.js frontend application
└── package.json      # Root workspace configuration
```

## Development Phases

See `aviatortutor-technical-architecture.plan.md` for complete development plan.

