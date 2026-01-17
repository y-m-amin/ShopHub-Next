import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900'>
      <div className='max-w-md w-full mx-auto p-6 text-center'>
        <div className='text-6xl mb-4'>🔍</div>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4'>
          Page Not Found
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mb-6'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className='space-y-3'>
          <Link href='/' className='block'>
            <Button className='w-full'>Go Home</Button>
          </Link>
          <Link href='/products' className='block'>
            <Button variant='outline' className='w-full'>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
