# ShopHub - Modern E-Commerce Platform

A comprehensive e-commerce platform built with Next.js 15, featuring authentication, product browsing, and item management capabilities. This application demonstrates modern web development practices with a focus on performance, accessibility, and user experience.

## 🚀 Features

### Core Functionality

- **Product Browsing**: Public access to view all products with detailed information
- **User Authentication**: Secure login system with session management
- **Item Management**: Protected interface for authenticated users to add new products
- **Responsive Design**: Optimized for all device sizes using Tailwind CSS
- **Theme Support**: Light and dark mode with system preference detection
- **Smooth Animations**: GSAP-powered animations for enhanced user experience

### Technical Features

- **Next.js 15**: Latest App Router with server-side rendering
- **JSON Database**: File-based data persistence with concurrent access safety
- **RESTful API**: Express.js backend with comprehensive error handling
- **Property-Based Testing**: Comprehensive test coverage with correctness properties
- **Performance Optimization**: Lazy loading, caching, and animation optimization
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠 Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn UI component library
- **Animations**: GSAP (GreenSock Animation Platform)
- **State Management**: React Context API
- **Authentication**: NextAuth.js with multiple providers

### Backend

- **API**: Next.js API Routes with Express.js middleware
- **Database**: JSON file-based storage with atomic operations
- **Session Management**: HTTP-only cookies with secure configuration
- **Validation**: Custom validation middleware with schema support

### Development & Testing

- **Testing**: Jest with React Testing Library
- **Property Testing**: Fast-check for property-based testing
- **Linting**: ESLint with Next.js configuration
- **Type Safety**: JSDoc annotations with TypeScript checking

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── items/         # Item management endpoints
│   ├── products/          # Product browsing pages
│   ├── login/             # Authentication page
│   ├── add-item/          # Protected item creation page
│   └── layout.js          # Root layout with providers
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── items/             # Product-related components
│   ├── navigation/        # Navigation components
│   ├── ui/                # Reusable UI components
│   └── __tests__/         # Component tests
├── lib/                   # Utility libraries
│   ├── auth.js            # Authentication utilities
│   ├── database.js        # Database operations
│   ├── animations.js      # Animation utilities
│   ├── performance.js     # Performance optimization
│   └── accessibility.js   # Accessibility helpers
├── hooks/                 # Custom React hooks
└── contexts/              # React context providers
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shophub
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Configure the following variables in `.env.local`:

   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id (optional)
   GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
   ```

4. **Initialize the database**

   ```bash
   npm run db:init
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Credentials

For testing purposes, use these credentials:

- **Email**: `admin@example.com`
- **Password**: `password123`

## 📖 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`

Authenticate user with credentials.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

#### POST `/api/auth/logout`

Logout current user and clear session.

#### GET `/api/auth/session`

Get current user session information.

### Items Endpoints

#### GET `/api/items`

Retrieve all items (public access).

**Query Parameters:**

- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "items": [
    {
      "id": "item-id",
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "image": "image-url",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### GET `/api/items/[id]`

Retrieve specific item by ID (public access).

#### POST `/api/items` (Protected)

Create new item (requires authentication).

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 29.99,
  "image": "image-url"
}
```

#### PUT `/api/items/[id]` (Protected)

Update existing item (requires authentication).

#### DELETE `/api/items/[id]` (Protected)

Delete item (requires authentication).

## 🗺 Route Summary

### Public Routes

- `/` - Landing page with 7 content sections
- `/products` - Product listing page
- `/products/[id]` - Individual product details
- `/login` - User authentication page
- `/about` - About page
- `/contact` - Contact information

### Protected Routes

- `/add-item` - Create new products (requires authentication)
- `/dashboard/profile` - User profile management

### API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/items` - Item management endpoints

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run property-based tests
npm run test:properties

# Run with coverage
npm run test:coverage
```

### Test Categories

1. **Unit Tests**: Component and function testing
2. **Property-Based Tests**: Correctness properties validation
3. **Integration Tests**: End-to-end workflow testing
4. **Accessibility Tests**: WCAG compliance verification

### Property-Based Testing

The application includes comprehensive property-based tests that validate:

- **Route Protection**: Unauthenticated access redirects
- **Authentication Persistence**: Session state maintenance
- **Item Display Completeness**: Required field presence
- **Navigation Consistency**: Link behavior validation
- **Data Persistence**: CRUD operation integrity
- **Form Validation**: Input validation enforcement
- **Theme System**: Consistent theme application
- **Loading States**: Proper loading indicator display

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography

- **Primary Font**: Geist Sans
- **Monospace Font**: Geist Mono
- **Font Sizes**: Tailwind CSS scale (text-xs to text-9xl)

### Components

All UI components are built with Shadcn UI and customized for the application's design system.

## 🚀 Performance Optimization

### Implemented Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Animation Performance**: GPU-accelerated animations with GSAP
- **Caching**: Memoization and TTL-based caching
- **Bundle Optimization**: Tree shaking and dead code elimination

### Performance Monitoring

- **Core Web Vitals**: Monitored and optimized
- **Animation Performance**: 60fps target with fallbacks
- **API Response Times**: Optimized database operations
- **Memory Usage**: Efficient component lifecycle management

## ♿ Accessibility Features

### WCAG Compliance

- **Level AA**: Full compliance with WCAG 2.1 AA standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Visible focus indicators and logical tab order

### Accessibility Tools

- **Focus Trapping**: Modal and overlay focus management
- **Skip Links**: Keyboard navigation shortcuts
- **Reduced Motion**: Respects user motion preferences
- **High Contrast**: Support for high contrast themes

## 🔧 Configuration

### Environment Variables

```env
# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_PATH=./data/database.json

# Development
NODE_ENV=development
```

### Build Configuration

The application uses Next.js default configuration with custom optimizations for:

- Bundle analysis
- Image optimization
- Performance monitoring
- Security headers

## 📦 Deployment

### Production Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Deployment Platforms

- **Vercel**: Recommended platform with zero configuration
- **Netlify**: Static site deployment with serverless functions
- **Docker**: Containerized deployment option
- **Traditional Hosting**: Node.js server deployment

### Environment Setup

1. Set production environment variables
2. Configure database persistence
3. Set up monitoring and logging
4. Configure security headers
5. Enable HTTPS

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- **ESLint**: Follow the configured linting rules
- **Prettier**: Use for code formatting
- **Commit Messages**: Follow conventional commit format
- **Testing**: Maintain test coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Shadcn**: For the beautiful component library
- **GSAP**: For powerful animation capabilities
- **Vercel**: For hosting and deployment platform

## 📞 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: contact@shophub.example.com

---

**Built with ❤️ using Next.js 15 and modern web technologies**
