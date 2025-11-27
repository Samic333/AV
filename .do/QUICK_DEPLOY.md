# Quick Deploy Checklist

## Before First Deployment

- [ ] Update `.do/app.yaml`:
  - [ ] Replace `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` with your actual repo
  - [ ] Generate and set `JWT_SECRET` (use `openssl rand -base64 32`)
  - [ ] Generate and set `JWT_REFRESH_SECRET` (use `openssl rand -base64 32`)
  - [ ] (Optional) Review `FRONTEND_URL` - it's set to `${frontend.PUBLIC_URL}` by default
  - [ ] (Optional) Review `NEXT_PUBLIC_API_URL` - it's set to `/api` by default

- [ ] Commit and push to GitHub:
  ```bash
  git add .
  git commit -m "Update DigitalOcean App Platform configuration"
  git push origin main
  ```

- [ ] Create App in DigitalOcean:
  1. Go to https://cloud.digitalocean.com/apps
  2. Click "Create App"
  3. Connect GitHub repository
  4. DigitalOcean will auto-detect `.do/app.yaml`

- [ ] After first deployment:
  - [ ] Verify backend health check: `https://your-app-domain.ondigitalocean.app/api/health`
  - [ ] Verify frontend loads: `https://your-app-domain.ondigitalocean.app`
  - [ ] Check database migrations ran successfully
  - [ ] Test authentication flow

## Environment Variables to Set in DigitalOcean Dashboard

If you prefer to set secrets in the dashboard instead of app.yaml (Recommended):

**Backend:**
- `JWT_SECRET` (SECRET type)
- `JWT_REFRESH_SECRET` (SECRET type)
- `DATABASE_URL` (automatically set from managed database)

**Frontend:**
- `NEXT_PUBLIC_API_URL` (defaults to `/api` in app.yaml, which is correct for single-domain setup)

## Generate JWT Secrets

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js (any platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Common Issues

**Build fails:**
- Check that all dependencies are in package.json
- Verify Node.js version compatibility
- Check build logs in App Platform

**Database connection fails:**
- Verify DATABASE_URL is set correctly
- Check database firewall allows App Platform IPs
- Ensure database is in same region
- **Migrations**: Check logs for the `migrate` job

**CORS errors:**
- Verify FRONTEND_URL matches actual domain
- Check CORS configuration in backend/src/main.ts
