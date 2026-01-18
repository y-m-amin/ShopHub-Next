'use client';

import { ArrowRight, Eye, EyeOff, Lock, Mail, ShoppingBag } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MOCK_USER } from '../../constants';
import { dbService } from '../../services/dbService';

interface LoginPageProps {
  onLogin?: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check for success message from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
      setSuccessMessage(message);
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleAuthSuccess = (token: string) => {
    if (onLogin) {
      onLogin(token);
    } else {
      dbService.setAuth(token);
    }
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Try next-auth signIn first, fallback to mock if needed for environment
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Hint: admin@nexus.com / password123');
        setIsLoading(false);
      } else {
        handleAuthSuccess('next-auth-session-token');
      }
    } catch (err) {
      // Mock fallback if next-auth is not working in this specific preview env
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        handleAuthSuccess('mock_jwt_token_credentials');
      } else {
        setError('Invalid credentials. Hint: admin@nexus.com / password123');
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      // For preview purposes, we'll simulate a successful Google login if the actual redirect fails
      handleAuthSuccess('mock_jwt_token_google');
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
            Welcome Back
          </h1>
          <p className='text-zinc-600 dark:text-zinc-400'>
            Sign in to your Nexus account
          </p>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none'>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className='w-full py-3 mb-6 flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50'
          >
            <img
              src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
              className='w-5 h-5'
              alt='Google'
            />
            Sign in with Google
          </button>

          <div className='relative mb-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-zinc-100 dark:border-zinc-800'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase tracking-widest text-zinc-400'>
              <span className='bg-white dark:bg-zinc-900 px-4'>
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {successMessage && (
              <div className='p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-xl border border-green-100 dark:border-green-900/50'>
                {successMessage}
              </div>
            )}

            {error && (
              <div className='p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-900/50'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Email
              </label>
              <div className='relative group'>
                <Mail
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type='email'
                  required
                  className='w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='admin@nexus.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1'>
                Password
              </label>
              <div className='relative group'>
                <Lock
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
                  size={20}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className='w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
                  placeholder='password123'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center group'
            >
              {isLoading ? (
                <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
              ) : (
                <>
                  Sign In{' '}
                  <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-zinc-600 dark:text-zinc-400'>
              Don't have an account?{' '}
              <Link
                href='/register'
                className='text-primary-600 hover:text-primary-700 font-medium'
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
