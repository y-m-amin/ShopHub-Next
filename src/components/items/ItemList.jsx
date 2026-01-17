'use client';

import { animations } from '@/lib/animations';
import { useEffect, useRef, useState } from 'react';
import { ItemCard } from './ItemCard';
import { ItemCardSkeleton } from './ItemCardSkeleton';

export function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!loading && items.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.item-card');
      animations.staggerFadeIn(cards, 0.1);
    }
  }, [loading, items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/items');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch items');
      }

      if (data.success) {
        setItems(data.items || []);
      } else {
        throw new Error(data.error || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchItems();
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>😞</div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
            Oops! Something went wrong
          </h2>
          <p className='text-slate-600 dark:text-slate-400 mb-6'>{error}</p>
          <button
            onClick={handleRetry}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>📦</div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
            No items available
          </h2>
          <p className='text-slate-600 dark:text-slate-400 mb-6'>
            There are currently no items in our catalog. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
          Our Products
        </h1>
        <p className='text-slate-600 dark:text-slate-400'>
          Discover our amazing collection of products
        </p>
      </div>

      <div
        ref={gridRef}
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      >
        {items.map((item) => (
          <ItemCard key={item.id} item={item} className='item-card opacity-0' />
        ))}
      </div>

      <div className='mt-8 text-center text-slate-500 dark:text-slate-400'>
        Showing {items.length} {items.length === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
}
