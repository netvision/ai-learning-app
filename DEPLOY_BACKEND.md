# AI Learning App - Backend Deployment Guide

## Prerequisites on Linode Server
- Node.js 18+ installed
- PostgreSQL 14+ installed
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed (for reverse proxy)

## Deployment Steps

### 1. Upload Backend Code
```bash
# On your local machine, create a production build
cd backend
npm ci --production

# Upload to Linode (replace with your server details)
rsync -avz --exclude 'node_modules' --exclude '.env' \
  . your-user@your-linode-ip:/var/www/ai-learning-api/
```

### 2. Setup on Linode Server
```bash
# SSH into your Linode
ssh your-user@your-linode-ip

# Navigate to app directory
cd /var/www/ai-learning-api

# Install dependencies
npm ci --production

# Create logs directory
mkdir -p logs
```

### 3. Setup PostgreSQL Database
```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE ai_learning_db;
CREATE USER ai_learning_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ai_learning_db TO ai_learning_user;
\q

# Initialize database tables
cd /var/www/ai-learning-api
node src/database/init.js
```

### 4. Configure Environment Variables
```bash
# Copy and edit production env file
cp .env.production .env
nano .env

# Update these values:
# - DATABASE_URL with your PostgreSQL credentials
# - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - OPENAI_API_KEY
# - ALLOWED_ORIGINS with your Netlify URL
```

### 5. Start with PM2
```bash
# Start the application
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs

# Check status
pm2 status
pm2 logs ai-learning-api
```

### 6. Configure Nginx Reverse Proxy
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ai-learning-api
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Replace with your domain/subdomain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for AI processing
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ai-learning-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Setup SSL with Let's Encrypt (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### 8. Verify Deployment
```bash
# Test the API
curl http://your-linode-ip:3000/health
# Should return: {"status":"ok","message":"AI Learning App API is running"}

# Or if using domain:
curl https://api.yourdomain.com/health
```

## PM2 Management Commands

```bash
# View logs
pm2 logs ai-learning-api

# Restart application
pm2 restart ai-learning-api

# Stop application
pm2 stop ai-learning-api

# Monitor
pm2 monit

# View detailed info
pm2 info ai-learning-api
```

## Updating the Application

```bash
# On your local machine
cd backend
rsync -avz --exclude 'node_modules' --exclude '.env' \
  . your-user@your-linode-ip:/var/www/ai-learning-api/

# On Linode server
cd /var/www/ai-learning-api
npm ci --production
pm2 restart ai-learning-api
```

## Database Backup

```bash
# Create backup
pg_dump -U ai_learning_user ai_learning_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U ai_learning_user ai_learning_db < backup_20231113.sql
```

## Troubleshooting

### Check PM2 logs
```bash
pm2 logs ai-learning-api --lines 100
```

### Check Nginx logs
```bash
sudo tail -f /var/nginx/error.log
sudo tail -f /var/nginx/access.log
```

### Test database connection
```bash
psql -U ai_learning_user -d ai_learning_db -h localhost
```

### Port already in use
```bash
# Find process on port 3000
sudo lsof -i :3000
# Kill if needed
sudo kill -9 <PID>
```

## Security Recommendations

1. **Firewall**: Only allow ports 80, 443, and 22
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **PostgreSQL**: Ensure it only listens on localhost
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: listen_addresses = 'localhost'
```

3. **Environment Variables**: Never commit `.env` to git
4. **Regular Updates**: Keep system and packages updated
```bash
sudo apt update && sudo apt upgrade
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | production |
| DATABASE_URL | PostgreSQL connection | postgresql://user:pass@localhost:5432/db |
| JWT_SECRET | JWT signing key | (min 32 chars random) |
| OPENAI_API_KEY | OpenAI API key | sk-proj-... |
| ALLOWED_ORIGINS | CORS origins | https://app.netlify.app |
