'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900'>
      <div className='max-w-md w-full mx-auto p-6 text-center'>
        <div className='text-6xl mb-4'>💥</div>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
          Oops! Something went wrong
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mb-6'>
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className='mb-6 text-left'>
            <summary className='cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              Error Details (Development)
            </summary>
            <pre className='text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto'>
              {error?.message || 'Unknown error'}
            </pre>
          </details>
        )}
        <div className='space-y-3'>
          <Button onClick={() => reset()} className='w-full'>
            Try Again
          </Button>
          <Button
            variant='outline'
            onClick={() => (window.location.href = '/')}
            className='w-full'
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
