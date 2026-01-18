# Vercel Deployment Guide

## Changes Made for Vercel Compatibility

### 1. API Routes Migration
- Converted Express.js server to Next.js API routes
- Created serverless functions in `app/api/` directory
- All endpoints now work as Vercel serverless functions

### 2. Environment Variables
- Updated `NEXT_PUBLIC_API_URL` to use `/api` instead of `http://localhost:5000/api`
- This allows the app to work both locally and in production

### 3. Package.json Updates
- Added `dev:vercel` script for Vercel-compatible development
- Kept original `dev` script for local Express development

## Deployment Steps

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import in Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy

## Environment Variables for Production

Set these in your Vercel project settings:

```env
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=/api
```

## Important Notes

1. **Database**: Currently uses JSON file storage. For production, consider:
   - Vercel KV (Redis)
   - PlanetScale (MySQL)
   - Supabase (PostgreSQL)
   - MongoDB Atlas

2. **File Storage**: JSON file persists between deployments but may not be ideal for production

3. **Google OAuth**: Update your Google Console settings:
   - Add your Vercel domain to authorized origins
   - Update redirect URIs to include your production domain

## Testing Deployment

After deployment, test these endpoints:
- `https://your-domain.vercel.app/api/health`
- `https://your-domain.vercel.app/api/products`
- Login functionality
- Product creation and management

## Troubleshooting

### Common Issues:
1. **Environment Variables**: Ensure all required env vars are set in Vercel dashboard
2. **Google OAuth**: Update Google Console with production URLs
3. **API Errors**: Check Vercel function logs in dashboard
4. **Build Errors**: Ensure TypeScript types are correct

### Local Testing:
```bash
# Test with Vercel-compatible mode
npm run dev:vercel

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products
```

## Production Considerations

For a production-ready deployment:
1. Replace JSON storage with a proper database
2. Add proper error handling and logging
3. Implement rate limiting
4. Add monitoring and analytics
5. Set up proper image storage (Cloudinary, AWS S3)
6. Add comprehensive testing
7. Implement proper security headers