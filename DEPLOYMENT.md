# DigitalOcean App Platform Deployment Guide

This guide will help you deploy AviatorTutor to DigitalOcean App Platform with automatic deployments from GitHub.

## Prerequisites

1. A GitHub repository with your code
2. A DigitalOcean account
3. A domain name (optional, but recommended)

## Step 1: Update Configuration Files

### 1.1 Review `.do/app.yaml`

The `.do/app.yaml` file has been configured for easy deployment. It defines:
- **Backend Service**: Runs the NestJS API.
- **Frontend Service**: Runs the Next.js app.
- **Database**: A managed PostgreSQL database.
- **Migration Job**: Automatically runs database migrations before each deployment.

You might need to update the following placeholders in `.do/app.yaml` or set them in the DigitalOcean dashboard after creation:
- `YOUR_JWT_SECRET_HERE` - Generate a strong random string (32+ characters)
- `YOUR_JWT_REFRESH_SECRET_HERE` - Generate another strong random string (32+ characters)

**Generate JWT Secrets:**
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 1.2 Frontend API URL

The `app.yaml` sets `NEXT_PUBLIC_API_URL` to `/api`. This works because both frontend and backend are deployed in the same App and share the same domain (frontend at `/`, backend at `/api`). No manual change is needed here.

## Step 2: Create App on DigitalOcean

1. Log in to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Select **GitHub** as your source
4. Authorize DigitalOcean to access your GitHub account
5. Select your repository and branch (usually `main`)
6. DigitalOcean will detect the `.do/app.yaml` file automatically
7. Review the resources and click **Create Resources**

## Step 3: Configure Environment Variables

The `.do/app.yaml` pre-configures most variables. However, for security, `JWT_SECRET` and `JWT_REFRESH_SECRET` are marked as secrets. You should set these in the DigitalOcean dashboard:

1. Go to your app settings.
2. Select the **backend** component.
3. Edit the **Environment Variables**.
4. Set `JWT_SECRET` and `JWT_REFRESH_SECRET` to your generated values.
5. Save and re-deploy.

## Step 4: Database Migrations

The `app.yaml` includes a **Pre-Deploy Job** named `migrate`.
- This job runs `npx prisma migrate deploy` automatically before every deployment.
- It ensures your production database schema is always up to date.
- No manual action is required.

## Step 5: Seed Database (Optional)

If you want to seed the database with initial data (first time only):

1. Go to your **backend** service in App Platform Console.
2. Run:
```bash
cd backend
npm run prisma:seed
```

## Step 6: Custom Domains (Optional)

1. In App Platform, go to your app settings.
2. Navigate to **Domains**.
3. Add your custom domain (e.g., `aviatortutor.com`).
4. Follow DNS instructions.

**Note:** Since we use relative paths (`/api`) for the frontend to talk to the backend, you only need one domain for the entire app!
- Frontend: `aviatortutor.com/`
- Backend: `aviatortutor.com/api`

## Step 7: Troubleshooting

### Build Fails
- Check build logs in App Platform.
- Ensure all dependencies are in `package.json`.

### Database Connection Issues
- The `migrate` job might fail if the database isn't ready. This usually only happens on the very first creation. If it fails, just re-deploy.

### Health Check Fails
- Verify `/api/health` endpoint is accessible.
