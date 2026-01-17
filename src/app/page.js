'use client';

import { Button } from '@/components/ui/button';
import { animations } from '@/lib/animations';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Home() {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Animate hero section on load
    if (heroRef.current) {
      animations.fadeIn(heroRef.current);
    }

    // Stagger animate content sections
    if (sectionsRef.current.length > 0) {
      animations.staggerFadeIn(sectionsRef.current, 0.2);
    }
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-slate-900 transition-colors'>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className='relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 py-20'
      >
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
            Welcome to ShopHub
          </h1>
          <p className='text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8'>
            Discover amazing products, manage your inventory, and enjoy a
            seamless shopping experience with our modern e-commerce platform
            built with cutting-edge technology.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/products'>
              <Button size='lg' className='w-full sm:w-auto'>
                Browse Products
              </Button>
            </Link>
            <Link href='/login'>
              <Button variant='outline' size='lg' className='w-full sm:w-auto'>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: Features Overview */}
      <section ref={addToRefs} className='py-16 bg-white dark:bg-slate-900'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
              Powerful Features
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              Everything you need to build and manage your online presence
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🛍️</span>
              </div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Product Browsing
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Browse through our extensive catalog with detailed product
                information and images
              </p>
            </div>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🔐</span>
              </div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Secure Authentication
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Multiple authentication options including social login and
                secure session management
              </p>
            </div>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>⚡</span>
              </div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Fast Performance
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Built with Next.js 15 for lightning-fast page loads and smooth
                animations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Technology Stack */}
      <section ref={addToRefs} className='py-16 bg-slate-50 dark:bg-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
              Built with Modern Technology
            </h2>
            <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              Leveraging the latest tools and frameworks for optimal performance
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {[
              { name: 'Next.js 15', desc: 'React Framework' },
              { name: 'Tailwind CSS', desc: 'Utility-First CSS' },
              { name: 'Shadcn UI', desc: 'Component Library' },
              { name: 'GSAP', desc: 'Animation Library' },
            ].map((tech, index) => (
              <div key={index} className='text-center p-4'>
                <div className='w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3'></div>
                <h4 className='font-semibold text-slate-900 dark:text-slate-50'>
                  {tech.name}
                </h4>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: User Experience */}
      <section ref={addToRefs} className='py-16 bg-white dark:bg-slate-900'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
                Exceptional User Experience
              </h2>
              <p className='text-lg text-slate-600 dark:text-slate-400 mb-6'>
                Our platform is designed with user experience at its core,
                featuring intuitive navigation, responsive design, and smooth
                animations that make shopping a pleasure.
              </p>
              <ul className='space-y-3'>
                <li className='flex items-center text-slate-600 dark:text-slate-400'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mr-3'></span>
                  Responsive design for all devices
                </li>
                <li className='flex items-center text-slate-600 dark:text-slate-400'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mr-3'></span>
                  Dark and light theme support
                </li>
                <li className='flex items-center text-slate-600 dark:text-slate-400'>
                  <span className='w-2 h-2 bg-green-500 rounded-full mr-3'></span>
                  Smooth GSAP animations
                </li>
              </ul>
            </div>
            <div className='bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 rounded-lg p-8 text-center'>
              <div className='text-6xl mb-4'>🎨</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50'>
                Beautiful Design
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Product Management */}
      <section ref={addToRefs} className='py-16 bg-slate-50 dark:bg-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='bg-gradient-to-br from-green-100 to-blue-100 dark:from-slate-700 dark:to-slate-600 rounded-lg p-8 text-center'>
              <div className='text-6xl mb-4'>📦</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50'>
                Easy Management
              </h3>
            </div>
            <div>
              <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
                Powerful Product Management
              </h2>
              <p className='text-lg text-slate-600 dark:text-slate-400 mb-6'>
                Authenticated users can easily add, edit, and manage products
                with our intuitive interface. Real-time updates and validation
                ensure data integrity.
              </p>
              <Link href='/login'>
                <Button>Start Managing Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Security & Authentication */}
      <section ref={addToRefs} className='py-16 bg-white dark:bg-slate-900'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
            Security First
          </h2>
          <p className='text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12'>
            Your data security is our priority. We implement industry-standard
            authentication and session management to keep your information safe.
          </p>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='p-6'>
              <div className='text-4xl mb-4'>🛡️</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Secure Sessions
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                HTTP-only cookies and secure session management
              </p>
            </div>
            <div className='p-6'>
              <div className='text-4xl mb-4'>🔑</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Multiple Auth Options
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Support for credentials and social login providers
              </p>
            </div>
            <div className='p-6'>
              <div className='text-4xl mb-4'>🔒</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Route Protection
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Automatic protection for authenticated-only features
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Performance & Reliability */}
      <section ref={addToRefs} className='py-16 bg-slate-50 dark:bg-slate-800'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
            Built for Performance
          </h2>
          <p className='text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12'>
            Our platform is optimized for speed and reliability, ensuring your
            users have the best possible experience every time they visit.
          </p>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm'>
              <div className='text-4xl mb-4'>⚡</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4'>
                Lightning Fast
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Next.js App Router with server-side rendering and optimized
                bundling for maximum performance.
              </p>
            </div>
            <div className='bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm'>
              <div className='text-4xl mb-4'>🔄</div>
              <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4'>
                Reliable Data
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                JSON-based data persistence with concurrent access safety and
                automatic error recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Call to Action */}
      <section
        ref={addToRefs}
        className='py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white'
      >
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-4xl font-bold mb-6'>Ready to Get Started?</h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
            Join thousands of users who trust our platform for their e-commerce
            needs. Start browsing products or create your account today.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/products'>
              <Button
                size='lg'
                variant='secondary'
                className='w-full sm:w-auto'
              >
                Browse Products Now
              </Button>
            </Link>
            <Link href='/login'>
              <Button
                size='lg'
                variant='outline'
                className='w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600'
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
