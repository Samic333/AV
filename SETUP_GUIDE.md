# AviatorTutor.com - Step-by-Step Setup Guide

This guide will walk you through setting up and running the AviatorTutor.com platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js 20+** - [Download here](https://nodejs.org/)
   - Verify: `node --version` (should be 20.x or higher)
   - Verify: `npm --version`

2. **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/)
   - Verify: `psql --version`
   - Or use Docker (recommended - see below)

3. **Redis** (optional, for caching and queues)
   - [Download here](https://redis.io/download)
   - Or use Docker (recommended - see below)

4. **Git** - [Download here](https://git-scm.com/downloads)

5. **Docker & Docker Compose** (optional but recommended)
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## Step 1: Clone/Verify Project Structure

Ensure you have the complete project structure:

```
AV.com/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── app/
│   ├── package.json
│   └── ...
├── package.json
├── docker-compose.yml
└── README.md
```

---

## Step 2: Set Up Database (Choose One Method)

### Option A: Using Docker (Recommended - Easiest)

1. **Start PostgreSQL and Redis containers:**
   ```bash
   docker-compose up -d
   ```

2. **Verify containers are running:**
   ```bash
   docker ps
   ```
   You should see `postgres` and `redis` containers running.

3. **Database connection details:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `aviatortutor`
   - Username: `aviatortutor`
   - Password: `aviatortutor`

### Option B: Local PostgreSQL Installation

1. **Create a new PostgreSQL database:**
   ```bash
   # Login to PostgreSQL
   psql -U postgres

   # Create database and user
   CREATE DATABASE aviatortutor;
   CREATE USER aviatortutor WITH PASSWORD 'aviatortutor';
   GRANT ALL PRIVILEGES ON DATABASE aviatortutor TO aviatortutor;
   \q
   ```

2. **Update connection string in backend/.env** (see Step 3)

---

## Step 3: Configure Environment Variables

### Backend Environment Variables

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create `.env` file:**
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env

   # On Mac/Linux
   cp .env.example .env
   ```

3. **Edit `backend/.env` and update these values:**

   ```env
   # Database (if using Docker, keep as is)
   DATABASE_URL="postgresql://aviatortutor:aviatortutor@localhost:5432/aviatortutor?schema=public"

   # JWT Secrets (CHANGE THESE IN PRODUCTION!)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
   JWT_REFRESH_EXPIRES_IN=30d

   # Server
   PORT=3001
   NODE_ENV=development

   # Redis (if using Docker, keep as is)
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # Platform Fee (percentage)
   PLATFORM_FEE_PERCENTAGE=15
   ```

   **Note:** For now, you can leave payment gateway keys empty. We'll add them later when integrating payments.

### Frontend Environment Variables

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Create `.env.local` file:**
   ```bash
   # On Windows (PowerShell)
   New-Item .env.local

   # On Mac/Linux
   touch .env.local
   ```

3. **Add to `frontend/.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

---

## Step 4: Install Dependencies

### Install Root Dependencies

1. **From project root:**
   ```bash
   cd ..  # Go back to root
   npm install
   ```

### Install Backend Dependencies

1. **Navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

### Install Frontend Dependencies

1. **Navigate to frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

**Or use the convenience script from root:**
```bash
npm run install:all
```

---

## Step 5: Set Up Database Schema

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

   This will:
   - Create all database tables
   - Set up relationships
   - Create indexes

4. **Verify database setup (optional):**
   ```bash
   npx prisma studio
   ```
   This opens a visual database browser at `http://localhost:5555`

---

## Step 6: Create Admin User (Optional but Recommended)

You'll need an admin user to manage the platform. You can create one manually in the database or use Prisma Studio:

1. **Open Prisma Studio:**
   ```bash
   cd backend
   npx prisma studio
   ```

2. **Create admin user:**
   - Go to `User` table
   - Click "Add record"
   - Fill in:
     - `email`: admin@aviatortutor.com
     - `passwordHash`: (we'll hash this in Step 7)
     - `role`: `admin`
     - `firstName`: Admin
     - `lastName`: User
     - `timezone`: UTC
     - `emailVerified`: true
   - Save

3. **Hash the password:**
   - You'll need to hash the password using bcrypt
   - Or use the registration endpoint to create admin (see Step 7)

### Alternative: Create Admin via API

After starting the server, you can create an admin user by temporarily modifying the registration endpoint or using a script.

---

## Step 7: Start Development Servers

### Option A: Run Both Servers Together (Recommended)

1. **From project root:**
   ```bash
   npm run dev
   ```

   This starts both backend (port 3001) and frontend (port 3000) simultaneously.

### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Step 8: Verify Installation

### Check Backend

1. **Health check:**
   - Open browser: `http://localhost:3001/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **API root:**
   - Open: `http://localhost:3001/api`
   - Should return: `{"success":true,"data":"AviatorTutor API is running!"}`

### Check Frontend

1. **Homepage:**
   - Open browser: `http://localhost:3000`
   - Should see the AviatorTutor homepage

2. **Test registration:**
   - Navigate to: `http://localhost:3000/register/student`
   - Try creating a test student account

---

## Step 9: Test Core Functionality

### 1. Register as Student

1. Go to: `http://localhost:3000/register/student`
2. Fill in the form:
   - First Name: Test
   - Last Name: Student
   - Email: student@test.com
   - Password: password123
3. Click "Register"
4. You should be redirected to `/student/dashboard`

### 2. Register as Tutor

1. Go to: `http://localhost:3000/register/tutor`
2. Fill in the form:
   - First Name: Test
   - Last Name: Tutor
   - Email: tutor@test.com
   - Password: password123
   - Hourly Rate: 50
   - Bio: Test tutor bio
3. Click "Register"
4. You should be redirected to `/tutor/dashboard`

### 3. Login

1. Go to: `http://localhost:3000/login`
2. Use credentials from Step 1 or 2
3. You should be redirected to the appropriate dashboard

### 4. Browse Tutors (as Student)

1. Login as student
2. Navigate to: `http://localhost:3000/tutors`
3. You should see the tutors list (empty if no approved tutors yet)

---

## Step 10: Approve Tutor (Admin Required)

To see tutors in the search, you need to approve them:

### Option A: Using Prisma Studio

1. **Open Prisma Studio:**
   ```bash
   cd backend
   npx prisma studio
   ```

2. **Navigate to `TutorProfile` table**
3. **Find your tutor and update:**
   - `status`: Change from `pending` to `approved`
   - `approvalDate`: Set to current date

### Option B: Using Admin API (if admin user exists)

1. **Login as admin**
2. **Use API endpoint:**
   ```bash
   PUT http://localhost:3001/api/admin/tutors/{tutorId}/approve
   ```

---

## Step 11: Common Issues & Troubleshooting

### Issue: Database Connection Error

**Error:** `Can't reach database server`

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # Docker
   docker ps
   
   # Local
   psql -U aviatortutor -d aviatortutor
   ```

2. Check `DATABASE_URL` in `backend/.env`
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solutions:**
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3001 | xargs kill
   ```

2. Or change port in `backend/.env`:
   ```env
   PORT=3002
   ```

### Issue: Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue: Migration Errors

**Error:** `Migration failed`

**Solutions:**
1. Reset database (WARNING: Deletes all data):
   ```bash
   cd backend
   npx prisma migrate reset
   npx prisma migrate dev
   ```

2. Check for syntax errors in `prisma/schema.prisma`

### Issue: CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default should be: `http://localhost:3000`

---

## Step 12: Next Steps

Once everything is running:

1. **Set up payment gateways** (when ready):
   - Add Flutterwave keys to `backend/.env`
   - Add PayPal keys to `backend/.env`
   - Add M-Pesa keys to `backend/.env`

2. **Configure file storage:**
   - Set up AWS S3 or Cloudinary
   - Add credentials to `backend/.env`

3. **Set up email service:**
   - Add SendGrid API key to `backend/.env`
   - Configure email templates

4. **Configure video integration:**
   - Add Zoom API credentials
   - Add Google Meet API credentials

5. **Production deployment:**
   - Set up production database
   - Configure environment variables
   - Set up CI/CD pipeline
   - Configure domain and SSL

---

## Quick Reference Commands

```bash
# Start everything
npm run dev

# Database
cd backend
npx prisma studio          # Open database browser
npx prisma migrate dev     # Run migrations
npx prisma generate        # Generate Prisma client

# Docker
docker-compose up -d       # Start services
docker-compose down        # Stop services
docker-compose logs        # View logs

# Backend only
cd backend
npm run start:dev         # Start backend

# Frontend only
cd frontend
npm run dev               # Start frontend
```

---

## Support

If you encounter issues:

1. Check the error messages in the terminal
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check that PostgreSQL and Redis are running
5. Review the troubleshooting section above

---

**You're all set!** The platform should now be running and ready for development. 🚀

