'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className,
      )}
      {...props}
    />
  );
}

export function TextSkeleton({ lines = 3, className, ...props }) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'h-4',
            index === lines - 1 ? 'w-3/4' : 'w-full', // Last line is shorter
          )}
        />
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 4, className, ...props }) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className='space-y-2'>
          <Skeleton className='h-4 w-24' /> {/* Label */}
          <Skeleton className='h-10 w-full' /> {/* Input */}
        </div>
      ))}
      <Skeleton className='h-10 w-32' /> {/* Button */}
    </div>
  );
}

export function CardSkeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 p-4',
        className,
      )}
      {...props}
    >
      <Skeleton className='aspect-square mb-4' />
      <Skeleton className='h-6 mb-2' />
      <TextSkeleton lines={2} className='mb-3' />
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-20' />
        <Skeleton className='h-5 w-16' />
      </div>
    </div>
  );
}
