'use client';

import { SimpleToaster } from '@/components/ui/simple-toaster';
import { ToastProvider } from '@/contexts/ToastContext';

export function ClientLayout({ children }) {
  return (
    <ToastProvider>
      {children}
      <SimpleToaster />
    </ToastProvider>
  );
}
