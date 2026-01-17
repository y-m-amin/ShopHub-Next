'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>SH</span>
            </div>
            <span className='text-xl font-bold text-slate-900 dark:text-slate-50'>
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-6'>
            <Link
              href='/'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors'
            >
              Home
            </Link>
            <Link
              href='/products'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors'
            >
              Products
            </Link>
            <Link
              href='/about'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors'
            >
              About
            </Link>
            <Link
              href='/contact'
              className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors'
            >
              Contact
            </Link>
          </div>

          {/* Right side - Theme toggle and auth */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />

            {user ? (
              <div className='hidden md:flex items-center space-x-4'>
                <Link href='/add-item'>
                  <Button variant='ghost' size='sm'>
                    Add Item
                  </Button>
                </Link>
                <Link href='/dashboard/profile'>
                  <Button variant='ghost' size='sm'>
                    Profile
                  </Button>
                </Link>
                <Button variant='outline' size='sm' onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className='hidden md:flex items-center space-x-2'>
                <Link href='/login'>
                  <Button variant='ghost' size='sm'>
                    Login
                  </Button>
                </Link>
                <Link href='/login'>
                  <Button size='sm'>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className='md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
              onClick={toggleMobileMenu}
              aria-label='Toggle mobile menu'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-slate-200 dark:border-slate-700'>
            <div className='flex flex-col space-y-3'>
              <Link
                href='/'
                className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors px-2 py-1'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href='/products'
                className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors px-2 py-1'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href='/about'
                className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors px-2 py-1'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href='/contact'
                className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors px-2 py-1'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className='border-t border-slate-200 dark:border-slate-700 pt-3 mt-3'>
                {user ? (
                  <div className='flex flex-col space-y-2'>
                    <Link
                      href='/add-item'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start'
                      >
                        Add Item
                      </Button>
                    </Link>
                    <Link
                      href='/dashboard/profile'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start'
                      >
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className='w-full'
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className='flex flex-col space-y-2'>
                    <Link
                      href='/login'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-start'
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      href='/login'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button size='sm' className='w-full'>
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
