'use client';

import { Button } from '@/components/ui/button';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function ItemDetails({ itemId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      animations.pageEnter(containerRef.current);
    }
  }, [loading]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/items/${itemId}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError('Item not found');
        } else {
          throw new Error(data.error || 'Failed to fetch item');
        }
        return;
      }

      if (data.success && data.item) {
        setItem(data.item);
      } else {
        throw new Error(data.error || 'Item not found');
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          {/* Back button skeleton */}
          <div className='mb-6'>
            <div className='h-10 bg-slate-200 dark:bg-slate-700 rounded w-32'></div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Image skeleton */}
            <div className='aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg'></div>

            {/* Content skeleton */}
            <div className='space-y-6'>
              <div className='h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4'></div>
              <div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-24'></div>
              <div className='h-12 bg-slate-200 dark:bg-slate-700 rounded w-32'></div>
              <div className='space-y-2'>
                <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded'></div>
                <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6'></div>
                <div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          {/* Back button */}
          <div className='mb-8 text-left'>
            <Link href='/products'>
              <Button variant='outline' className='gap-2'>
                ← Back to Products
              </Button>
            </Link>
          </div>

          <div className='text-6xl mb-4'>
            {error === 'Item not found' ? '🔍' : '😞'}
          </div>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
            {error === 'Item not found'
              ? 'Item Not Found'
              : 'Oops! Something went wrong'}
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mb-6'>
            {error === 'Item not found'
              ? "The item you're looking for doesn't exist or may have been removed."
              : error}
          </p>
          <div className='space-x-4'>
            <Link href='/products'>
              <Button>Browse All Products</Button>
            </Link>
            {error !== 'Item not found' && (
              <Button variant='outline' onClick={() => fetchItem()}>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>🔍</div>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
            Item Not Found
          </h1>
          <p className='text-slate-600 dark:text-slate-400 mb-6'>
            The item you're looking for doesn't exist.
          </p>
          <Link href='/products'>
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className='container mx-auto px-4 py-8 opacity-0'>
      {/* Back button */}
      <div className='mb-6'>
        <Link href='/products'>
          <Button variant='outline' className='gap-2'>
            ← Back to Products
          </Button>
        </Link>
      </div>

      {/* Breadcrumb */}
      <nav className='mb-6 text-sm text-slate-600 dark:text-slate-400'>
        <Link
          href='/'
          className='hover:text-slate-900 dark:hover:text-slate-50'
        >
          Home
        </Link>
        <span className='mx-2'>/</span>
        <Link
          href='/products'
          className='hover:text-slate-900 dark:hover:text-slate-50'
        >
          Products
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-slate-900 dark:text-slate-50'>{item.name}</span>
      </nav>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Image */}
        <div className='aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden relative'>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 50vw'
              priority
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <div className='text-slate-400 dark:text-slate-500 text-8xl'>
                📦
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='space-y-6'>
          {/* Title and Category */}
          <div>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
              {item.name}
            </h1>
            {item.category && (
              <span className='inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-sm'>
                {item.category}
              </span>
            )}
          </div>

          {/* Price and Stock Status */}
          <div className='space-y-2'>
            <div className='text-4xl font-bold text-blue-600 dark:text-blue-400'>
              {formatPrice(item.price)}
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={cn(
                  'inline-block px-3 py-1 rounded-full text-sm font-medium',
                  item.inStock
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
                )}
              >
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3'>
              Description
            </h2>
            <p className='text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap'>
              {item.description}
            </p>
          </div>

          {/* Item Details */}
          <div>
            <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3'>
              Item Details
            </h2>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Item ID:
                </span>
                <span className='text-slate-900 dark:text-slate-50 font-mono'>
                  {item.id}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600 dark:text-slate-400'>
                  Added:
                </span>
                <span className='text-slate-900 dark:text-slate-50'>
                  {formatDate(item.createdAt)}
                </span>
              </div>
              {item.updatedAt !== item.createdAt && (
                <div className='flex justify-between'>
                  <span className='text-slate-600 dark:text-slate-400'>
                    Last Updated:
                  </span>
                  <span className='text-slate-900 dark:text-slate-50'>
                    {formatDate(item.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3 pt-4'>
            {item.inStock ? (
              <Button size='lg' className='w-full'>
                Add to Cart
              </Button>
            ) : (
              <Button size='lg' className='w-full' disabled>
                Out of Stock
              </Button>
            )}
            <Button variant='outline' size='lg' className='w-full'>
              Add to Wishlist
            </Button>
          </div>

          {/* Additional Actions */}
          <div className='pt-4 border-t border-slate-200 dark:border-slate-700'>
            <div className='flex gap-4 text-sm'>
              <button className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors'>
                Share
              </button>
              <button className='text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors'>
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items Section (placeholder) */}
      <div className='mt-16'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6'>
          You might also like
        </h2>
        <div className='text-center py-12 text-slate-500 dark:text-slate-400'>
          Related items will be displayed here
        </div>
      </div>
    </div>
  );
}
