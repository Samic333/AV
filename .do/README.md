# DigitalOcean App Platform Configuration

This directory contains the configuration file for DigitalOcean App Platform auto-deployment.

## Files

- `app.yaml` - Main App Platform configuration file

## Before First Deployment

1. **Update `app.yaml`** with your actual values:
   - GitHub repository name
   - JWT secrets (generate strong random strings)
   - Domain names

2. **Generate JWT Secrets:**
   ```bash
   # Generate JWT_SECRET
   openssl rand -base64 32
   
   # Generate JWT_REFRESH_SECRET
   openssl rand -base64 32
   ```

3. **Commit and push** to trigger automatic deployment

## Configuration Overview

The `app.yaml` file defines:
- **Backend Service**: NestJS API running on port 3001
- **Frontend Service**: Next.js app running on port 3000
- **Managed Database**: PostgreSQL 15

## Environment Variables

Most environment variables are configured in `app.yaml`. Sensitive values (JWT secrets, database URL) should be:
1. Set in the DigitalOcean dashboard as SECRET type, OR
2. Updated directly in `app.yaml` before committing

**Important:** Never commit actual secrets to Git. Use DigitalOcean's environment variable management for production secrets.

## Database Migrations

Migrations run automatically during build (via `prisma migrate deploy` in build command).

For manual migration:
```bash
# In App Platform console
cd backend
npx prisma migrate deploy
```

## Deployment Flow

1. Push to GitHub
2. DigitalOcean detects changes
3. Builds backend and frontend
4. Runs Prisma migrations
5. Deploys services
6. Health checks verify deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

