
# Nexus Marketplace - Next.js 15 Edition

A high-performance premium hardware marketplace built with Next.js 15 App Router and Express.js backend.

## Features
- **Authentication**: NextAuth.js integration with Google and Mock Credentials.
- **Dynamic Routing**: Product details and marketplace filtering.
- **Theming**: System-aware Dark/Light mode toggle.
- **Dashboard**: Track orders and manage wishlist.
- **Seller Flow**: Post new items to the marketplace.
- **Responsive**: Fully optimized for mobile and desktop.
- **API Integration**: Full CRUD operations with JSON file storage.
- **Toast Notifications**: Real-time user feedback.
- **Express.js Backend**: RESTful API with file-based database.

## Project Structure

```
nexus-marketplace/
├── app/                          # Next.js App Router pages
│   ├── add-item/
│   │   └── page.tsx             # Product creation form (Protected)
│   ├── api/                     # Next.js API routes (Vercel serverless)
│   │   ├── auth/
│   │   │   └── [...nextauth]/   # NextAuth.js configuration
│   │   ├── health/
│   │   │   └── route.ts         # Health check endpoint
│   │   ├── orders/
│   │   │   ├── route.ts         # Orders CRUD
│   │   │   └── [userId]/
│   │   │       └── route.ts     # User-specific orders
│   │   └── products/
│   │       ├── route.ts         # Products CRUD
│   │       ├── [id]/
│   │       │   └── route.ts     # Single product operations
│   │       └── seller/
│   │           └── [sellerId]/
│   │               └── route.ts # Seller's products
│   ├── checkout/
│   │   └── page.tsx             # 3-step checkout process (Protected)
│   ├── dashboard/
│   │   └── page.tsx             # User dashboard (Protected)
│   ├── items/
│   │   ├── page.tsx             # Product catalog (Public)
│   │   └── [id]/
│   │       └── page.tsx         # Product details (Public)
│   ├── login/
│   │   └── page.tsx             # Authentication page
│   ├── my-listings/
│   │   └── page.tsx             # Seller product management (Protected)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Landing page (7 sections)
├── components/                   # Reusable React components
│   ├── Footer.tsx               # Site footer
│   ├── Navbar.tsx               # Navigation with auth
│   ├── ProductCard.tsx          # Product display component
│   └── Providers.tsx            # Context providers wrapper
├── server/                       # Express.js backend
│   ├── index.js                 # Express server with REST API
│   └── db.json                  # JSON file database
├── services/                     # API and data services
│   ├── apiService.ts            # HTTP client for API calls
│   └── dbService.ts             # Local storage service (legacy)
├── .env.local                   # Environment variables
├── .gitignore                   # Git ignore rules
├── .vercelignore               # Vercel deployment exclusions
├── constants.ts                 # App constants and mock data
├── DEPLOYMENT.md               # Deployment instructions
├── metadata.json               # App metadata
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── proxy.ts                    # Next.js 15 proxy configuration
├── README.md                   # This file
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── types.ts                    # TypeScript type definitions
└── vercel.json                 # Vercel deployment configuration
```

## Installation
1. Install dependencies: `npm install`
2. Configure `.env.local` with:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Start development: 
   - `npm run dev` (Express server + Next.js)
   - `npm run dev:vercel` (Next.js only, uses API routes)
   - `npm run server` (Express server only)

## Deployment Architecture

### Current Setup (Hybrid)
- **Frontend**: Deployed to Vercel (Next.js App Router)
- **Backend**: Two options available:
  1. **Express.js Server** (`/server/index.js`) - File-based storage
  2. **Next.js API Routes** (`/app/api/*`) - Serverless functions

### Recommended Production Setup
1. **Frontend (Next.js)** → Vercel
2. **Backend (Express.js)** → Railway/Render (supports file persistence)

## API Endpoints (Express.js Server)

### Products
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/seller/:sellerId` - Get seller's products

### Orders
- `GET /api/orders/:userId` - Get user's orders
- `POST /api/orders` - Create new order

### Health
- `GET /api/health` - Server health check

## Route Summary

### Public Routes
- `/` - Landing page with features, testimonials, pricing, FAQ
- `/items` - Product catalog with search and filtering
- `/items/[id]` - Individual product details
- `/login` - Authentication (Google OAuth + Mock login)

### Protected Routes (Require Authentication)
- `/dashboard` - User dashboard with orders and wishlist
- `/add-item` - Product creation form with image upload
- `/my-listings` - Seller's product management (CRUD operations)
- `/checkout` - 3-step checkout process (shipping, payment, review)

## Key Features Implemented

✅ **Landing Page**: 7 sections (hero, features, testimonials, pricing, FAQ)  
✅ **Authentication**: NextAuth.js with Google OAuth and mock credentials  
✅ **Product Catalog**: Public browsing with search and filtering  
✅ **Product Details**: Individual product pages with full information  
✅ **Protected Routes**: Authentication-gated pages  
✅ **Product Management**: Full CRUD operations for sellers  
✅ **Order Processing**: Complete checkout flow with order tracking  
✅ **Toast Notifications**: Real-time user feedback  
✅ **Responsive Design**: Mobile-optimized interface  
✅ **Dark Mode**: Theme switching capability  
✅ **File-based Storage**: JSON database for development  

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Express.js with JSON file storage
- **Styling**: Tailwind CSS with dark mode support
- **Authentication**: NextAuth.js (Google OAuth)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## Development Notes

- Uses Next.js 15 App Router for modern routing
- Express.js server provides RESTful API with file-based storage
- JSON file (`server/db.json`) serves as development database
- TypeScript for type safety across the application
- Component-based architecture for maintainability
- Responsive design with mobile-first approach
