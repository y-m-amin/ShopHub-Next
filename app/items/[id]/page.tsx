
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Shield, Truck, RefreshCw, ShoppingCart, Heart, ArrowLeft, Check } from 'lucide-react';
import { dbService } from '../../../services/dbService';
import { apiService } from '../../../services/apiService';
import { Product } from '../../../types';

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  const fetchProduct = async () => {
    try {
      const data = await apiService.getProduct(id);
      setProduct(data);
      const wishlist = dbService.getWishlist();
      setIsInWishlist(wishlist.some(item => item.productId === id));
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to localStorage
      const data = dbService.getProductById(id);
      if (data) {
        setProduct(data);
        const wishlist = dbService.getWishlist();
        setIsInWishlist(wishlist.some(item => item.productId === id));
      } else {
        router.push('/items');
      }
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      dbService.toggleWishlist(product.id);
      setIsInWishlist(!isInWishlist);
    }
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      router.push(`/checkout?productId=${product?.id}&qty=${quantity}`);
    }, 1000);
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center dark:text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/items" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Marketplace
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center text-amber-500 text-sm font-bold">
              <Star size={14} className="mr-1 fill-current" />
              {product.rating}
            </div>
          </div>
          <h1 className="text-4xl font-extrabold dark:text-white mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-600 mb-6">${product.price.toLocaleString()}</p>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg leading-relaxed">{product.description}</p>
          
          <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="font-bold dark:text-white">Quantity</span>
              <div className="flex items-center space-x-4">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">-</button>
                <span className="font-bold dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))} className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">+</button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-12">
            <button 
              onClick={handleAddToCart} 
              disabled={isAdded}
              className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl flex items-center justify-center hover:bg-primary-700 transition-all disabled:opacity-75"
            >
              {isAdded ? <Check className="mr-2" /> : <ShoppingCart size={20} className="mr-2" />}
              {isAdded ? 'Redirecting...' : 'Buy Now'}
            </button>
            <button onClick={handleToggleWishlist} className={`p-4 rounded-2xl border-2 transition-colors ${isInWishlist ? 'border-red-500 text-red-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
              <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield className="text-primary-600" size={24} />
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Escrow Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck className="text-primary-600" size={24} />
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Fast Logistics</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RefreshCw className="text-primary-600" size={24} />
              <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">14-Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
