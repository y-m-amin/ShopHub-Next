# Deployment Guide

## Overview

This guide covers deploying the ShopHub e-commerce platform to various hosting platforms. The application is built with Next.js 15 and can be deployed as a static site or with server-side rendering.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Environment variables configured
- Production database setup (if applicable)

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com

# Authentication
NEXTAUTH_SECRET=your-production-secret-key-min-32-chars

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_PATH=./data/database.json

# Security
ALLOWED_ORIGINS=https://your-domain.com

# Performance
ENABLE_ANALYTICS=true
```

### Security Considerations

1. **NEXTAUTH_SECRET**: Generate a secure random string (minimum 32 characters)

   ```bash
   openssl rand -base64 32
   ```

2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure allowed origins appropriately
4. **Headers**: Set security headers (CSP, HSTS, etc.)

## Deployment Platforms

### 1. Vercel (Recommended)

Vercel provides the best experience for Next.js applications with zero configuration.

#### Automatic Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Environment Variables**
   - In project settings, add all environment variables
   - Ensure `NEXTAUTH_URL` matches your domain

3. **Deploy**
   - Vercel automatically builds and deploys on every push
   - Production URL will be provided

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Vercel Configuration

Create `vercel.json` for custom configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Netlify

Netlify supports Next.js with their Essential Next.js plugin.

#### Deployment Steps

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Configuration**

   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Install Next.js Plugin**
   Create `netlify.toml`:

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [build.environment]
     NODE_VERSION = "18"
   ```

4. **Environment Variables**
   - Add all required environment variables in Netlify dashboard
   - Set `NEXTAUTH_URL` to your Netlify domain

### 3. Railway

Railway provides simple deployment with automatic HTTPS and custom domains.

#### Deployment Steps

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project"
   - Connect GitHub repository

2. **Environment Variables**
   - Add all required environment variables
   - Railway provides automatic HTTPS

3. **Custom Domain** (Optional)
   - Add custom domain in project settings
   - Update `NEXTAUTH_URL` accordingly

### 4. Docker Deployment

For containerized deployment on any platform.

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create data directory for JSON database
RUN mkdir -p ./data && chown nextjs:nodejs ./data

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  shophub:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - shophub
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker build -t shophub .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=https://your-domain.com \
  -v $(pwd)/data:/app/data \
  shophub

# Or use Docker Compose
docker-compose up -d
```

### 5. Traditional VPS/Server

For deployment on a traditional server or VPS.

#### Server Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- Nginx (recommended)
- SSL certificate (Let's Encrypt recommended)

#### Deployment Steps

1. **Server Setup**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Application Deployment**

   ```bash
   # Clone repository
   git clone <your-repo-url> /var/www/shophub
   cd /var/www/shophub

   # Install dependencies
   npm ci --only=production

   # Build application
   npm run build

   # Create data directory
   mkdir -p data
   sudo chown -R www-data:www-data data

   # Start with PM2
   pm2 start npm --name "shophub" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   Create `/etc/nginx/sites-available/shophub`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

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
       }
   }
   ```

   Enable the site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/shophub /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **SSL Certificate**

   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y

   # Get certificate
   sudo certbot --nginx -d your-domain.com

   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Database Considerations

### JSON Database (Default)

The application uses a JSON file database by default:

- **File Location**: `./data/database.json`
- **Backup**: Regularly backup the JSON file
- **Permissions**: Ensure write permissions for the application
- **Scaling**: Consider migrating to a proper database for high traffic

### Migration to Real Database

For production use, consider migrating to:

1. **PostgreSQL**: Recommended for relational data
2. **MongoDB**: For document-based storage
3. **MySQL**: Traditional relational database
4. **Supabase**: Managed PostgreSQL with real-time features

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Enable compression
# Add to next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### CDN Configuration

1. **Static Assets**: Use CDN for images and static files
2. **Caching**: Configure appropriate cache headers
3. **Compression**: Enable gzip/brotli compression

### Monitoring

1. **Application Monitoring**: Use services like Sentry or LogRocket
2. **Performance Monitoring**: Implement Core Web Vitals tracking
3. **Uptime Monitoring**: Use services like Pingdom or UptimeRobot

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented (if needed)
- [ ] Input validation and sanitization
- [ ] Regular security updates
- [ ] Backup strategy in place

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Authentication Issues**
   - Verify `NEXTAUTH_URL` matches deployment URL
   - Check `NEXTAUTH_SECRET` is set and secure
   - Ensure cookies work with your domain

3. **Database Issues**
   - Check file permissions for JSON database
   - Verify data directory exists and is writable
   - Monitor disk space usage

4. **Performance Issues**
   - Enable compression
   - Optimize images
   - Check for memory leaks
   - Monitor server resources

### Logs and Debugging

```bash
# PM2 logs (if using PM2)
pm2 logs shophub

# Docker logs
docker logs container-name

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Rollback Strategy

1. **Version Control**: Tag releases for easy rollback
2. **Database Backup**: Backup before deployments
3. **Blue-Green Deployment**: Use for zero-downtime deployments
4. **Health Checks**: Implement health check endpoints

## Support

For deployment issues:

1. Check the troubleshooting section
2. Review application logs
3. Consult platform-specific documentation
4. Create an issue on GitHub with deployment details
