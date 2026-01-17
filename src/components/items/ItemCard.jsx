'use client';

import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export function ItemCard({ item, className }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      animations.cardHover(card);
    };

    const handleMouseLeave = () => {
      animations.cardHoverOut(card);
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Link href={`/products/${item.id}`} className='block'>
      <div
        ref={cardRef}
        className={cn(
          'bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-shadow duration-300 hover:shadow-lg cursor-pointer',
          className,
        )}
      >
        {/* Image */}
        <div className='aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative'>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            />
          ) : (
            <div className='text-slate-400 dark:text-slate-500 text-4xl'>
              📦
            </div>
          )}
        </div>

        {/* Content */}
        <div className='p-4'>
          <h3 className='font-semibold text-lg text-slate-900 dark:text-slate-50 mb-2 overflow-hidden'>
            <span className='block overflow-hidden text-ellipsis whitespace-nowrap'>
              {item.name}
            </span>
          </h3>

          <p className='text-slate-600 dark:text-slate-400 text-sm mb-3 overflow-hidden'>
            <span
              className='block overflow-hidden'
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.description}
            </span>
          </p>

          <div className='flex items-center justify-between'>
            <span className='text-xl font-bold text-blue-600 dark:text-blue-400'>
              {formatPrice(item.price)}
            </span>

            {item.category && (
              <span className='text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full'>
                {item.category}
              </span>
            )}
          </div>

          {!item.inStock && (
            <div className='mt-2'>
              <span className='text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full'>
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
