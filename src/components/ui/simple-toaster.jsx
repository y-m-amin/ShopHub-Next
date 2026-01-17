'use client';

import { useToastState } from '@/contexts/ToastContext';
import { X } from 'lucide-react';

export function SimpleToaster() {
  const toasts = useToastState();

  if (toasts.length === 0) return null;

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-2 duration-300
            ${
              toast.variant === 'success'
                ? 'bg-green-500 text-white border-green-600'
                : toast.variant === 'destructive'
                  ? 'bg-red-500 text-white border-red-600'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border-slate-200 dark:border-slate-700'
            }
          `}
        >
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              {toast.title && (
                <div className='font-semibold text-sm mb-1'>{toast.title}</div>
              )}
              {toast.description && (
                <div className='text-sm opacity-90'>{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => {
                /* Toast will auto-remove */
              }}
              className='ml-2 opacity-70 hover:opacity-100 transition-opacity'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
