# Quick Start Guide - AviatorTutor.com

## 🚀 Fast Setup (5 Minutes)

### 1. Start Database (Docker)
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and set JWT_SECRET (use a random 32+ character string)

# Frontend  
cd ../frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 4. Setup Database
```bash
cd ../backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start Servers
```bash
cd ..
npm run dev
```

### 6. Test It
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health
- Register: http://localhost:3000/register/student

---

## 📋 What You Need

- Node.js 20+
- PostgreSQL 15+ (or Docker)
- Redis (optional, or Docker)

---

## 🔧 Troubleshooting

**Database connection error?**
- Check Docker: `docker ps`
- Verify DATABASE_URL in `backend/.env`

**Port in use?**
- Change PORT in `backend/.env`

**Prisma errors?**
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # WARNING: Deletes data
```

---

For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

