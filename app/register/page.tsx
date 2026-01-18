'use client';

import {
  ArrowRight,
  Eye,
  EyeOff,
  Image,
  Lock,
  Mail,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          image: formData.image || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?message=Registration successful! Please sign in.');
      } else {
        if (response.status === 503 && data.setupUrl) {
          setError(`${data.message} Click here to set up the database.`);
          // You could also redirect to setup page automatically
          // router.push(data.setupUrl);
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Registration request failed:', err);
      setError(
        'Network error occurred. Please check your connection and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-10'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-xl shadow-primary-500/30 mb-6'>
            <ShoppingBag className='text-white w-8 h-8' />
          </div>
          <h1 className='text-3xl font-extrabold dark:text-white mb-2'>
            Create Account
          </h1>
          <p className='text-zinc-600 dark:text-zinc-400'>
            Join Nexus TechHub today
          </p>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-900/50'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Full Name *
              </label>
              <div className='relative group'>
                <User
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type='text'
                  name='name'
                  required
                  className='w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='John Doe'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Email *
              </label>
              <div className='relative group'>
                <Mail
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type='email'
                  name='email'
                  required
                  className='w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='john@example.com'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Password *
              </label>
              <div className='relative group'>
                <Lock
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  required
                  className='w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='Minimum 6 characters'
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Confirm Password *
              </label>
              <div className='relative group'>
                <Lock
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  required
                  className='w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='Confirm your password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Phone (Optional)
              </label>
              <div className='relative group'>
                <Phone
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type='tel'
                  name='phone'
                  className='w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='+1 (555) 123-4567'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Profile Image URL (Optional)
              </label>
              <div className='relative group'>
                <Image
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type='url'
                  name='image'
                  className='w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='https://example.com/avatar.jpg'
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
              <p className='text-xs text-zinc-500 ml-1'>
                Leave empty to use default avatar
              </p>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center group'
            >
              {isLoading ? (
                <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
              ) : (
                <>
                  Create Account{' '}
                  <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-zinc-600 dark:text-zinc-400'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-primary-600 hover:text-primary-700 font-medium'
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
