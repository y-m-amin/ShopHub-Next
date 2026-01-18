'use client';

import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard';
import { dbService } from '../../services/dbService';
import { Product } from '../../types';

export default function ItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<
    'price-asc' | 'price-desc' | 'name' | 'rating' | ''
  >('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const w = dbService.getWishlist();
    setWishlist(w.map((i) => i.productId));
  }, []);

  const fetchProducts = async (sort?: string) => {
    try {
      setLoading(true);
      const url = sort ? `/api/products?sortBy=${sort}` : '/api/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      // Fallback to localStorage data
      const localData = dbService.getProducts();
      setProducts(localData);
      setFilteredProducts(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sortBy) {
      fetchProducts(sortBy);
    }
  }, [sortBy]);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }
    setFilteredProducts(result);
  }, [search, category, products]);

  const handleToggleWishlist = (id: string) => {
    dbService.toggleWishlist(id);
    const w = dbService.getWishlist();
    setWishlist(w.map((i) => i.productId));
  };

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
        <div>
          <h1 className='text-4xl font-extrabold dark:text-white mb-2'>
            Marketplace
          </h1>
          <p className='text-zinc-600 dark:text-zinc-400'>
            Discover premium hardware and assets.
          </p>
        </div>
        <div className='w-full md:w-auto flex flex-col sm:flex-row gap-4'>
          <div className='relative group'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-600 transition-colors'
              size={20}
            />
            <input
              type='text'
              placeholder='Search products...'
              className='w-full sm:w-64 pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='relative inline-block text-left w-full sm:w-48'>
            <select
              className='w-full appearance-none pl-4 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white cursor-pointer'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400'>
              <ChevronDown size={18} />
            </div>
          </div>
          <div className='relative inline-block text-left w-full sm:w-48'>
            <select
              className='w-full appearance-none pl-4 pr-10 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white cursor-pointer'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400'>
              <ArrowUpDown size={18} />
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className='text-center py-20'>
          <h3 className='text-xl font-bold dark:text-white mb-2'>
            No products found
          </h3>
          <p className='text-zinc-500'>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={wishlist.includes(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
