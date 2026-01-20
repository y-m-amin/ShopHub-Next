
# Nexus Marketplace - Premium E-commerce Platform

A modern, high-performance e-commerce marketplace built with Next.js 15, featuring advanced animations, PostgreSQL database integration, and a comprehensive product management system.

## 🚀 Features

### **Core Functionality**
- **Advanced Authentication**: NextAuth.js with Google OAuth and demo credentials (`user@nexus.com` / `password123`)
- **Product Management**: Full CRUD operations with pagination, sorting, and filtering
- **Database Integration**: PostgreSQL with Vercel Postgres + fallback JSON storage
- **Dynamic Routing**: SEO-optimized product pages and marketplace filtering
- **Order Processing**: Complete checkout flow with order tracking and management
- **Wishlist System**: Save and manage favorite products
- **Seller Dashboard**: Comprehensive product management for sellers

### **User Experience**
- **Modern Animations**: Smooth transitions, hover effects, and gradient animations
- **Responsive Design**: Mobile-first approach with optimized layouts
- **Dark/Light Mode**: System-aware theme switching
- **Toast Notifications**: Real-time user feedback with custom styling
- **Loading States**: Skeleton loaders and progress indicators
- **Pagination**: Advanced pagination with customizable items per page (9, 18, 27, 36, 45)

### **Technical Features**
- **Database Flexibility**: PostgreSQL primary + JSON fallback for development
- **Force Re-seeding**: Database management with setup interface
- **API Integration**: RESTful APIs with comprehensive error handling
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Efficient data fetching and caching strategies

## 🎨 Enhanced Homepage

The homepage features modern e-commerce design with:
- **Animated Hero Section**: Staggered entrance animations and gradient text effects
- **Interactive Features Grid**: Hover animations and icon scaling effects
- **Testimonials Carousel**: Smooth transitions and star animations
- **Pricing Plans**: Interactive billing toggle and hover effects
- **FAQ Accordion**: Smooth expand/collapse animations
- **Shimmer Effects**: Professional loading and hover states

## 📊 Database Architecture

### **PostgreSQL Integration (Primary)**
- **Products Table**: Complete product information with ratings and stock
- **Orders Table**: Order tracking with JSON item storage
- **Users Table**: User profiles with authentication data
- **Wishlists Table**: User wishlist management

### **Fallback System**
- **JSON Storage**: Development-friendly file-based storage
- **Automatic Switching**: Seamless fallback when PostgreSQL unavailable
- **Data Consistency**: Unified API regardless of storage backend

## 🛍️ Product Catalog Features

### **Advanced Pagination**
- **Customizable Page Size**: 9, 18, 27, 36, 45 products per page
- **Smart Navigation**: Previous/Next with numbered pages
- **Results Counter**: "Showing X to Y of Z products" display
- **Auto-scroll**: Smooth scroll to top on page changes

### **Filtering & Search**
- **Real-time Search**: Instant product filtering by name/description
- **Category Filtering**: Dynamic category-based filtering
- **Sorting Options**: Price (low/high), name (A-Z), rating (highest first)
- **Combined Filters**: Search + category + sorting simultaneously

## 🔧 Setup & Installation

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database (optional - has JSON fallback)
- Vercel account (for PostgreSQL integration)

### **Environment Variables**
Create `.env.local` with:
```env
# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (Optional - uses JSON fallback if not provided)
POSTGRES_URL=your-vercel-postgres-url

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### **Installation Steps**
1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd nexus-marketplace
   npm install
   ```

2. **Database Setup** (Optional):
   - Set up Vercel Postgres integration
   - Visit `/setup` page to initialize database
   - Use "Force Re-seed Data" to populate with sample products

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## 🗂️ Project Structure

```
nexus-marketplace/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes (PostgreSQL + JSON)
│   │   ├── products/            # Product CRUD with pagination
│   │   ├── orders/              # Order management
│   │   ├── wishlist/            # Wishlist operations
│   │   ├── setup/               # Database initialization
│   │   └── health/              # System health checks
│   ├── items/                   # Product catalog with pagination
│   ├── login/                   # Authentication pages
│   ├── dashboard/               # User dashboard
│   ├── add-item/                # Product creation
│   ├── my-listings/             # Seller management
│   └── setup/                   # Database setup interface
├── components/                   # Reusable Components
│   ├── Pagination.tsx           # Advanced pagination component
│   ├── ProductCard.tsx          # Product display cards
│   ├── Navbar.tsx               # Navigation with auth
│   └── Footer.tsx               # Site footer
├── lib/                         # Core Libraries
│   ├── postgres-database.ts     # PostgreSQL operations
│   └── database.ts              # JSON fallback storage
├── services/                    # API Services
│   ├── apiService.ts            # HTTP client
│   └── dbService.ts             # Data operations
└── styles/                      # Styling
    └── globals.css              # Custom animations & utilities
```

## 🎯 API Endpoints

### **Products**
- `GET /api/products?page=1&limit=9&sortBy=price-asc` - Paginated products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/products/seller/[sellerId]` - Seller's products

### **Orders & Wishlist**
- `GET /api/orders/[userId]` - User orders
- `POST /api/orders` - Create order
- `GET /api/wishlist/[userId]` - User wishlist
- `POST /api/wishlist` - Toggle wishlist item

### **System**
- `GET /api/health` - System status
- `POST /api/setup` - Database initialization
- `POST /api/setup` (with `force: true`) - Force re-seed

## 🔐 Authentication

### **Demo Credentials**
- **Email**: `user@nexus.com`
- **Password**: `password123`

### **Google OAuth**
- Configured via NextAuth.js
- Automatic user creation on first login
- Session management with secure cookies

## 🚀 Deployment

### **Vercel (Recommended)**
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Environment Variables**: Add all required env vars
3. **PostgreSQL**: Enable Vercel Postgres integration
4. **Deploy**: Automatic deployment on push

### **Database Setup**
1. **Visit**: `https://your-app.vercel.app/setup`
2. **Initialize**: Click "Initialize Database" for first setup
3. **Re-seed**: Use "Force Re-seed Data" to refresh sample data

## 🌐 Live Demo Link

You can visit the live deployed version of Nexus TechHubr here:

👉 [Nexus TechHub](https://nexus-techhub.vercel.app/)

## 🎨 Customization

### **Animations**
Custom CSS animations in `globals.css`:
- `animate-gradient-x` - Flowing gradient backgrounds
- `animate-spin-slow` - Slow rotation effects
- `animate-shimmer` - Loading shimmer effects
- Hover transformations and transitions

### **Theming**
- Tailwind CSS with custom color palette
- Dark/light mode support
- Responsive breakpoints
- Custom component styling

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for medium screens
- **Desktop**: Full-featured desktop experience
- **Touch-friendly**: Optimized touch targets and interactions

## 🔧 Development Features

- **TypeScript**: Full type safety
- **Hot Reload**: Instant development feedback
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Skeleton loaders and spinners
- **Toast System**: User feedback notifications
- **Route Protection**: Authentication-gated pages

## 📈 Performance

- **Optimized Images**: Next.js Image optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Efficient API response caching
- **Lazy Loading**: Component and route lazy loading
- **Bundle Analysis**: Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Next.js 15, PostgreSQL, and modern web technologies.**
