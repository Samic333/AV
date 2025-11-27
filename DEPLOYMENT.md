# DigitalOcean App Platform Deployment Guide

This guide will help you deploy AviatorTutor to DigitalOcean App Platform with automatic deployments from GitHub.

## Prerequisites

1. A GitHub repository with your code
2. A DigitalOcean account
3. A domain name (optional, but recommended)

## Step 1: Update Configuration Files

### 1.1 Update `.do/app.yaml`

Before deploying, you need to update the following placeholders in `.do/app.yaml`:

- `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` - Replace with your actual GitHub repository
- `YOUR_JWT_SECRET_HERE` - Generate a strong random string (32+ characters)
- `YOUR_JWT_REFRESH_SECRET_HERE` - Generate another strong random string (32+ characters)
- `YOUR_FRONTEND_DOMAIN.com` - Your frontend domain (e.g., `aviatortutor.com`)
- `YOUR_BACKEND_DOMAIN.com` - Your backend domain (e.g., `api.aviatortutor.com`)

**Generate JWT Secrets:**
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 1.2 Update Frontend API URL

In `frontend/lib/api.ts`, ensure it uses the environment variable:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

This is already configured correctly.

## Step 2: Create App on DigitalOcean

1. Log in to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click **Create App**
3. Select **GitHub** as your source
4. Authorize DigitalOcean to access your GitHub account
5. Select your repository and branch (usually `main`)
6. DigitalOcean will detect the `.do/app.yaml` file automatically

## Step 3: Configure Environment Variables

In the DigitalOcean dashboard, go to your app settings and configure:

### Backend Environment Variables:
- `NODE_ENV` = `production` (already set in app.yaml)
- `PORT` = `3001` (already set in app.yaml)
- `DATABASE_URL` = Will be automatically set from the managed database
- `JWT_SECRET` = Your generated JWT secret (set as SECRET type)
- `JWT_REFRESH_SECRET` = Your generated refresh secret (set as SECRET type)
- `JWT_EXPIRES_IN` = `7d` (already set in app.yaml)
- `JWT_REFRESH_EXPIRES_IN` = `30d` (already set in app.yaml)
- `FRONTEND_URL` = Your frontend domain URL

### Frontend Environment Variables:
- `NODE_ENV` = `production` (already set in app.yaml)
- `NEXT_PUBLIC_API_URL` = Your backend API URL (e.g., `https://api.aviatortutor.com/api`)

## Step 4: Run Database Migrations

After the first deployment, you need to run Prisma migrations:

### Option 1: Via DigitalOcean Console
1. Go to your backend service in App Platform
2. Open the Console tab
3. Run:
```bash
cd backend
npx prisma migrate deploy
```

### Option 2: Add to Build Command (Recommended)
Update the build command in `.do/app.yaml`:
```yaml
build_command: npm ci && npx prisma generate && npm run build && npx prisma migrate deploy
```

**Note:** `prisma migrate deploy` is safe for production and won't prompt for confirmation.

## Step 5: Seed Database (Optional)

If you want to seed the database with initial data:

1. Go to your backend service console
2. Run:
```bash
cd backend
npm run prisma:seed
```

Or add to your build command (only for first deployment):
```yaml
build_command: npm ci && npx prisma generate && npm run build && npx prisma migrate deploy && npm run prisma:seed
```

## Step 6: Configure Custom Domains

1. In App Platform, go to your app settings
2. Navigate to **Domains** section
3. Add your custom domain
4. Follow the DNS configuration instructions
5. DigitalOcean will automatically provision SSL certificates

### DNS Configuration Example:
- Frontend: `aviatortutor.com` → Point to App Platform
- Backend API: `api.aviatortutor.com` → Point to App Platform

## Step 7: Update CORS Settings

After setting up domains, update the `FRONTEND_URL` environment variable in your backend service to match your production frontend domain.

## Step 8: Monitor Deployments

1. Go to your app in DigitalOcean
2. Check the **Deployments** tab to see deployment status
3. View logs in the **Runtime Logs** tab if there are issues

## Troubleshooting

### Build Fails
- Check build logs in App Platform
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database firewall rules allow App Platform connections
- Ensure database is in the same region as your app

### CORS Errors
- Verify `FRONTEND_URL` matches your actual frontend domain
- Check that the frontend domain is included in CORS allowed origins

### Health Check Fails
- Verify `/api/health` endpoint is accessible
- Check that the backend is running on the correct port

## Environment Variables Reference

### Backend Required Variables:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<from managed database>
JWT_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Required Variables:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Cost Optimization

- Start with `basic-xxs` instance size (as configured)
- Scale up as needed based on traffic
- Use managed database for better reliability
- Enable auto-scaling if traffic is variable

## Security Best Practices

1. Never commit `.env` files to Git
2. Use SECRET type for sensitive environment variables in App Platform
3. Enable database backups
4. Use strong JWT secrets (32+ characters)
5. Keep dependencies updated
6. Enable rate limiting (already configured in backend)

## Next Steps

After successful deployment:
1. Test all endpoints
2. Verify database migrations ran successfully
3. Test authentication flow
4. Monitor application logs
5. Set up monitoring and alerts
6. Configure backup schedules

## Support

For issues specific to:
- **DigitalOcean App Platform**: Check [DO Documentation](https://docs.digitalocean.com/products/app-platform/)
- **Application Issues**: Check runtime logs in App Platform dashboard
- **Database Issues**: Check managed database logs and connection settings

