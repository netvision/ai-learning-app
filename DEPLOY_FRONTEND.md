# AI Learning App - Frontend Deployment Guide (Netlify)

## Prerequisites
- Netlify account (free tier works fine)
- GitHub/GitLab repository connected to Netlify
- Backend API URL (from your Linode deployment)

## Deployment Methods

### Method 1: Deploy via Netlify Dashboard (Easiest)

#### Step 1: Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 2: Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select the `ai-learning-app` repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### Step 3: Set Environment Variables
In Netlify Dashboard:
1. Go to **Site settings** > **Environment variables**
2. Click **Add a variable**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://api.yourdomain.com/api` (your Linode backend URL)

#### Step 4: Deploy
1. Click **Deploy site**
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at: `https://random-name-123.netlify.app`

#### Step 5: Custom Domain (Optional)
1. Go to **Domain settings**
2. Click **Add custom domain**
3. Follow instructions to:
   - Add domain
   - Configure DNS
   - Enable HTTPS (automatic with Netlify)

### Method 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend directory
cd frontend

# Initialize Netlify site
netlify init

# Follow prompts:
# - Create & configure new site
# - Build command: npm run build
# - Publish directory: dist

# Set environment variable
netlify env:set VITE_API_URL "https://api.yourdomain.com/api"

# Deploy
netlify deploy --prod
```

## Update Backend CORS Settings

After deploying to Netlify, update your backend `.env` on Linode:

```bash
# SSH into Linode
ssh your-user@your-linode-ip

# Edit backend .env
cd /var/www/ai-learning-api
nano .env

# Update ALLOWED_ORIGINS with your Netlify URL
ALLOWED_ORIGINS=https://your-app-name.netlify.app

# Restart PM2
pm2 restart ai-learning-api
```

## Testing the Deployment

### 1. Test Backend Health
```bash
curl https://api.yourdomain.com/health
# Should return: {"status":"ok","message":"AI Learning App API is running"}
```

### 2. Test Frontend
1. Open your Netlify URL: `https://your-app-name.netlify.app`
2. Try to sign up/login
3. Check browser console for any errors
4. Test creating study material and submitting answers

### 3. Check Network Tab
- Open browser DevTools > Network
- Verify API calls go to your production backend
- Check for CORS errors

## Continuous Deployment

Once connected to Git, Netlify will automatically deploy when you push to main:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically builds and deploys!
```

## Build Configuration

The `netlify.toml` file in the frontend folder configures:
- **Redirects**: SPA routing (all routes → index.html)
- **Build settings**: Node version, build command, publish dir
- **Security headers**: XSS protection, frame options, etc.

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| VITE_API_URL | Yes | Backend API URL | https://api.yourdomain.com/api |

## Troubleshooting

### Build Fails on Netlify
```bash
# Check build logs in Netlify Dashboard
# Common issues:
# 1. Missing dependencies - check package.json
# 2. Build errors - test locally first: npm run build
# 3. Node version - specified in netlify.toml
```

### CORS Errors
```bash
# Ensure backend ALLOWED_ORIGINS includes Netlify URL
# Check backend logs:
pm2 logs ai-learning-api
```

### API Calls Fail
```bash
# Verify VITE_API_URL is set correctly in Netlify
# Check in Netlify Dashboard > Site settings > Environment variables
# Redeploy if you change env vars
```

### 404 on Refresh
- This should be handled by netlify.toml redirects
- If not working, check netlify.toml is in frontend root

## Performance Optimization

### Enable Caching
Netlify automatically caches static assets

### Image Optimization
Netlify automatically optimizes images (on paid plans)

### CDN
Netlify provides global CDN automatically

## Monitoring

### Netlify Analytics (Optional - Paid)
- Track page views, unique visitors
- See popular pages
- Monitor performance

### Free Alternatives
- Google Analytics
- Plausible Analytics
- Simple Analytics

## Rollback

If a deployment breaks something:
1. Go to Netlify Dashboard > **Deploys**
2. Find a working deployment
3. Click **Publish deploy**

## Custom Domain SSL

Netlify provides **free automatic HTTPS** for:
- *.netlify.app domains (automatic)
- Custom domains (automatic after DNS setup)

No need for certbot or manual SSL setup!

## Deployment Checklist

- [ ] Backend deployed on Linode and running
- [ ] Backend health endpoint accessible
- [ ] PostgreSQL database set up and initialized
- [ ] Frontend pushed to Git repository
- [ ] Netlify site created and connected to repo
- [ ] VITE_API_URL environment variable set in Netlify
- [ ] Backend ALLOWED_ORIGINS updated with Netlify URL
- [ ] Test signup/login works
- [ ] Test study material generation
- [ ] Test practice questions and handwriting
- [ ] Test chatbot functionality
- [ ] (Optional) Custom domain configured
- [ ] (Optional) Analytics set up

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Community**: https://answers.netlify.com
- **Status**: https://www.netlifystatus.com

## Cost

**Netlify Free Tier Includes:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS
- Continuous deployment
- Perfect for this app!

## Next Steps After Deployment

1. **Test thoroughly** on production
2. **Monitor logs** for errors
3. **Set up analytics** for usage tracking
4. **Backup database** regularly on Linode
5. **Update documentation** with production URLs
