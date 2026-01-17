'use client';

import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';

export function LoadingOverlay({
  isLoading,
  children,
  message = 'Loading...',
  className,
  spinnerSize = 'lg',
  ...props
}) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
      {isLoading && (
        <div className='absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg'>
          <div className='flex flex-col items-center space-y-3'>
            <LoadingSpinner size={spinnerSize} />
            {message && (
              <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FullPageLoader({ message = 'Loading...', isVisible = true }) {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='flex flex-col items-center space-y-4'>
        <LoadingSpinner size='xl' />
        <p className='text-lg text-slate-700 dark:text-slate-300 font-medium'>
          {message}
        </p>
      </div>
    </div>
  );
}
