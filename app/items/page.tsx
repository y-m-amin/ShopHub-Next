'use client';

import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import { dbService } from '../../services/dbService';
import { apiService } from '../../services/apiService';
import { Product } from '../../types';
import { MOCK_USER } from '../../constants';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}

export default function ItemsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<
    'price-asc' | 'price-desc' | 'name' | 'rating' | ''
  >('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const userId = session?.user?.email || MOCK_USER.email;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 9,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const wishlistData = await apiService.getWishlist(userId);
      setWishlist(wishlistData.map((item) => item.productId));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Fallback to localStorage
      const w = dbService.getWishlist();
      setWishlist(w.map((i) => i.productId));
    }
  };

  const fetchProducts = async (sort?: string, page = 1, limit = productsPerPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sort) params.append('sortBy', sort);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const url = `/api/products?${params.toString()}`;
      const response = await fetch(url);
      const data: ProductsResponse = await response.json();
      
      if (data.products && data.pagination) {
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(data.pagination.currentPage);
        
        // Also fetch all products for filtering (without pagination)
        const allResponse = await fetch('/api/products?limit=1000');
        const allData: ProductsResponse = await allResponse.json();
        setAllProducts(allData.products || []);
        setFilteredProducts(data.products);
      } else {
        // Handle legacy response format
        setProducts(data as any);
        setAllProducts(data as any);
        setFilteredProducts(data as any);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      // Fallback to localStorage data
      const localData = dbService.getProducts();
      setProducts(localData);
      setAllProducts(localData);
      setFilteredProducts(localData);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination changes
  useEffect(() => {
    if (!search && category === 'All') {
      // Only use API pagination when no client-side filtering
      fetchProducts(sortBy || undefined, currentPage, productsPerPage);
    }
  }, [currentPage, productsPerPage, sortBy]);

  // Handle client-side filtering
  useEffect(() => {
    let result = allProducts;
    
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

    // Apply client-side pagination for filtered results
    if (search || category !== 'All') {
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginatedResult = result.slice(startIndex, endIndex);
      
      setFilteredProducts(paginatedResult);
      setPagination({
        currentPage,
        totalPages: Math.ceil(result.length / productsPerPage),
        totalProducts: result.length,
        productsPerPage,
        hasNextPage: currentPage < Math.ceil(result.length / productsPerPage),
        hasPreviousPage: currentPage > 1,
      });
    } else {
      setFilteredProducts(products);
    }
  }, [search, category, allProducts, currentPage, productsPerPage, products]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, productsPerPage]);

  const handleToggleWishlist = async (id: string) => {
    setWishlistLoading(true);
    try {
      const result = await apiService.toggleWishlist(userId, id);
      
      // Update local wishlist state
      if (result.action === 'added') {
        setWishlist(prev => [...prev, id]);
        const product = allProducts.find(p => p.id === id);
        toast.success(`Added "${product?.name}" to wishlist! ❤️`);
      } else {
        setWishlist(prev => prev.filter(productId => productId !== id));
        const product = allProducts.find(p => p.id === id);
        toast.success(`Removed "${product?.name}" from wishlist`);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Fallback to localStorage
      dbService.toggleWishlist(id);
      const w = dbService.getWishlist();
      setWishlist(w.map((i) => i.productId));
      toast.error('Using offline mode. Changes may not sync across devices.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductsPerPageChange = (newLimit: number) => {
    setProductsPerPage(newLimit);
    setCurrentPage(1);
  };

  const categories = ['All', ...new Set(allProducts.map((p) => p.category))];

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const perPageOptions = [9, 18, 27, 36, 45];

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

      {/* Products per page selector and results info */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <div className='text-sm text-zinc-600 dark:text-zinc-400'>
          Showing {filteredProducts.length > 0 ? ((currentPage - 1) * productsPerPage) + 1 : 0} to{' '}
          {Math.min(currentPage * productsPerPage, pagination.totalProducts)} of{' '}
          {pagination.totalProducts} products
        </div>
        <div className='flex items-center gap-2 relative'>
          <span className='text-sm text-zinc-600 dark:text-zinc-400'>Show:</span>
          <div className='relative'>
            <select
              className='appearance-none pl-3 pr-8 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white cursor-pointer text-sm'
              value={productsPerPage}
              onChange={(e) => handleProductsPerPageChange(Number(e.target.value))}
            >
              {perPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400'>
              <ChevronDown size={14} />
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
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={wishlist.includes(product.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </>
      )}
    </div>
  );
}
