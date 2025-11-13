# 🚀 AI Learning App - Quick Deployment Guide

## Overview
- **Backend**: Linode Server (Node.js + PostgreSQL)
- **Frontend**: Netlify (Static hosting)

---

## 📋 Pre-Deployment Checklist

### Backend (Linode)
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed  
- [ ] PM2 installed globally
- [ ] Nginx installed
- [ ] Port 3000 available
- [ ] OpenAI API key ready

### Frontend (Netlify)
- [ ] Code pushed to GitHub/GitLab
- [ ] Netlify account created
- [ ] Backend API URL known

---

## 🔧 Step-by-Step Deployment

### STEP 1: Deploy Backend to Linode

#### 1.1 Upload Code
```bash
cd backend
rsync -avz --exclude 'node_modules' --exclude '.env' \
  . your-user@your-linode-ip:/var/www/ai-learning-api/
```

#### 1.2 Setup on Server
```bash
ssh your-user@your-linode-ip
cd /var/www/ai-learning-api
npm ci --production
mkdir -p logs
```

#### 1.3 Setup Database
```bash
sudo -u postgres psql
CREATE DATABASE ai_learning_db;
CREATE USER ai_learning_user WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE ai_learning_db TO ai_learning_user;
\q

node src/database/init.js
```

#### 1.4 Configure Environment
```bash
cp .env.production .env
nano .env
```

Set these values:
```env
PORT=3000
DATABASE_URL=postgresql://ai_learning_user:YourSecurePassword123!@localhost:5432/ai_learning_db
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
OPENAI_API_KEY=sk-proj-your-openai-key
ALLOWED_ORIGINS=https://your-app-name.netlify.app
```

#### 1.5 Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
pm2 logs ai-learning-api
```

#### 1.6 Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ai-learning-api
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ai-learning-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 1.7 Test Backend
```bash
curl http://your-linode-ip:3000/health
# Should return: {"status":"ok",...}
```

---

### STEP 2: Deploy Frontend to Netlify

#### 2.1 Push to Git
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

#### 2.2 Deploy on Netlify
1. Go to https://app.netlify.com
2. Click **"Add new site"** > **"Import an existing project"**
3. Choose Git provider and select repository
4. Configure build:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Click **"Deploy site"**

#### 2.3 Set Environment Variable
1. Go to **Site settings** > **Environment variables**
2. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://api.yourdomain.com/api` (or `http://your-linode-ip:3000/api`)
3. Click **"Save"**
4. Go to **Deploys** and click **"Trigger deploy"**

#### 2.4 Update Backend CORS
```bash
# SSH back to Linode
ssh your-user@your-linode-ip
cd /var/www/ai-learning-api
nano .env

# Update ALLOWED_ORIGINS with your Netlify URL
ALLOWED_ORIGINS=https://your-actual-netlify-url.netlify.app

pm2 restart ai-learning-api
```

---

## ✅ Verify Deployment

### Test Backend
```bash
curl https://api.yourdomain.com/health
```

### Test Frontend
1. Open `https://your-app-name.netlify.app`
2. Sign up for a new account
3. Login
4. Try generating study material
5. Test practice questions with handwriting
6. Test chatbot

---

## 🔐 Security (Important!)

### Firewall (Linode)
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### SSL Certificate (Free with Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Strong Passwords
- [ ] PostgreSQL password is strong
- [ ] JWT_SECRET is random and long (32+ chars)
- [ ] Never commit .env files

---

## 📊 Management Commands

### Backend (PM2)
```bash
# View logs
pm2 logs ai-learning-api

# Restart
pm2 restart ai-learning-api

# Monitor
pm2 monit

# Stop
pm2 stop ai-learning-api
```

### Frontend (Netlify)
- Auto-deploys on git push to main
- Manual deploy: Netlify Dashboard > **Deploys** > **Trigger deploy**
- Rollback: **Deploys** > Select old deploy > **Publish deploy**

### Database Backup
```bash
# Create backup
pg_dump -U ai_learning_user ai_learning_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U ai_learning_user ai_learning_db < backup_20231113.sql
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
pm2 logs ai-learning-api --lines 50
# Check for errors in database connection or missing env vars
```

### CORS errors in browser
```bash
# Make sure ALLOWED_ORIGINS matches your Netlify URL exactly
# Restart PM2 after changing .env
pm2 restart ai-learning-api
```

### Frontend shows "Network Error"
- Check VITE_API_URL in Netlify environment variables
- Test backend health endpoint
- Check browser console for exact error

### Database connection fails
```bash
# Test database connection
psql -U ai_learning_user -d ai_learning_db -h localhost

# Check PostgreSQL is running
sudo systemctl status postgresql
```

---

## 📚 Documentation

Detailed guides available:
- **Backend**: See `DEPLOY_BACKEND.md`
- **Frontend**: See `DEPLOY_FRONTEND.md`

---

## 🎯 Quick URLs

After deployment, save these:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://api.yourdomain.com` or `http://your-linode-ip:3000`
- **Health Check**: `https://api.yourdomain.com/health`

---

## 💰 Cost Estimate

- **Linode**: $5-10/month (Nanode 1GB)
- **Netlify**: Free (100GB bandwidth)
- **OpenAI API**: Pay-per-use (~$0.002/request for GPT-3.5)
- **Domain** (optional): ~$10-15/year
- **SSL**: Free (Let's Encrypt)

**Total**: ~$5-10/month + OpenAI usage

---

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` files to git
2. **API Keys**: Keep OpenAI API key secure
3. **Database**: Backup regularly (set up cron job)
4. **Updates**: Test locally before deploying
5. **Monitoring**: Check PM2 logs regularly

---

## ✨ You're Done!

Your AI Learning App is now live and ready for students to use on smartpanels! 🎓

Need help? Check the detailed deployment guides or PM2/Netlify logs for errors.
