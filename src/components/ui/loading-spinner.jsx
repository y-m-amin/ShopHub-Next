'use client';

import { cn } from '@/lib/utils';

export function LoadingSpinner({ size = 'default', className, ...props }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300',
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

export function LoadingDots({ className, ...props }) {
  return (
    <div className={cn('flex space-x-1', className)} {...props}>
      <div className='h-2 w-2 bg-slate-600 dark:bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-2 w-2 bg-slate-600 dark:bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-2 w-2 bg-slate-600 dark:bg-slate-300 rounded-full animate-bounce'></div>
    </div>
  );
}

export function LoadingPulse({ className, ...props }) {
  return (
    <div
      className={cn(
        'h-4 w-4 bg-slate-600 dark:bg-slate-300 rounded-full animate-pulse',
        className,
      )}
      {...props}
    />
  );
}
