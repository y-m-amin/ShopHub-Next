'use client';

import { ArrowRight, CheckCircle, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onToggleWishlist: (id: string) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleWishlist,
  isInWishlist,
}) => {
  return (
    <div className='group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1'>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isInWishlist
            ? 'bg-red-500 text-white'
            : 'bg-white/70 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-300'
        }`}
      >
        <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Verified Badge */}
      {product.verified && (
        <div className='absolute top-4 left-4 z-10 flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full'>
          <CheckCircle size={12} />
          Verified
        </div>
      )}

      <Link
        href={`/items/${product.id}`}
        className='block overflow-hidden h-64 bg-zinc-100 dark:bg-zinc-800'
      >
        <img
          src={product.image}
          alt={product.name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
      </Link>

      <div className='p-5'>
        <div className='flex justify-between items-start mb-2'>
          <span className='px-2 py-1 rounded text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'>
            {product.category}
          </span>
          <div className='flex items-center text-amber-500 text-sm font-medium'>
            <Star size={14} className='mr-1 fill-current' />
            {product.rating}
          </div>
        </div>
        <Link href={`/items/${product.id}`}>
          <h3 className='text-lg font-bold dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors'>
            {product.name}
          </h3>
        </Link>
        <div className='flex items-center justify-between mt-auto'>
          <span className='text-2xl font-bold dark:text-white'>
            ${product.price.toLocaleString()}
          </span>
          <Link
            href={`/items/${product.id}`}
            className='inline-flex items-center text-sm font-bold text-primary-600'
          >
            View <ArrowRight size={16} className='ml-1' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
