'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { animations } from '@/lib/animations';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function AddItemForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    inStock: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    // Animate form entrance
    if (formRef.current && user) {
      animations.pageEnter(formRef.current);
    }
  }, [user, authLoading, router]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Item name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Item name must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        newErrors.price = 'Price must be a valid number';
      } else if (price < 0) {
        newErrors.price = 'Price must be non-negative';
      } else if (price > 999999) {
        newErrors.price = 'Price must be less than $999,999';
      }
    }

    // Image URL validation (optional)
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image.trim());
      } catch {
        newErrors.image = 'Please enter a valid URL';
      }
    }

    // Category validation (optional)
    if (formData.category && formData.category.trim().length > 50) {
      newErrors.category = 'Category must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim() || null,
        category: formData.category.trim() || null,
        inStock: formData.inStock,
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          router.push('/login');
          return;
        }
        throw new Error(data.message || data.error || 'Failed to create item');
      }

      if (data.success) {
        // Show success toast
        showToast({
          title: 'Item Created Successfully!',
          description: 'Your item has been added to the catalog.',
          variant: 'success',
        });

        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
          category: '',
          inStock: true,
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/products');
        }, 1500);
      } else {
        throw new Error(data.message || data.error || 'Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);

      // Show error toast
      showToast({
        title: 'Failed to Create Item',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });

      setErrors({
        submit: error.message || 'Failed to create item. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300'></div>
      </div>
    );
  }

  // Don't render form if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div ref={formRef} className='opacity-0'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Item Name */}
        <div>
          <Label htmlFor='name' className='text-sm font-medium'>
            Item Name *
          </Label>
          <Input
            id='name'
            type='text'
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={cn(
              'mt-1',
              errors.name &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
            placeholder='Enter item name'
            disabled={loading}
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor='description' className='text-sm font-medium'>
            Description *
          </Label>
          <textarea
            id='description'
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={cn(
              'mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-slate-50 resize-vertical',
              errors.description &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
            placeholder='Enter item description'
            rows={4}
            disabled={loading}
          />
          {errors.description && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <Label htmlFor='price' className='text-sm font-medium'>
            Price (USD) *
          </Label>
          <Input
            id='price'
            type='number'
            step='0.01'
            min='0'
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className={cn(
              'mt-1',
              errors.price &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
            placeholder='0.00'
            disabled={loading}
          />
          {errors.price && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.price}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <Label htmlFor='image' className='text-sm font-medium'>
            Image URL (optional)
          </Label>
          <Input
            id='image'
            type='url'
            value={formData.image}
            onChange={(e) => handleInputChange('image', e.target.value)}
            className={cn(
              'mt-1',
              errors.image &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
            placeholder='https://example.com/image.jpg'
            disabled={loading}
          />
          {errors.image && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.image}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label htmlFor='category' className='text-sm font-medium'>
            Category (optional)
          </Label>
          <Input
            id='category'
            type='text'
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={cn(
              'mt-1',
              errors.category &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
            placeholder='e.g., Electronics, Clothing, Books'
            disabled={loading}
          />
          {errors.category && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.category}
            </p>
          )}
        </div>

        {/* In Stock */}
        <div className='flex items-center space-x-2'>
          <input
            id='inStock'
            type='checkbox'
            checked={formData.inStock}
            onChange={(e) => handleInputChange('inStock', e.target.checked)}
            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded'
            disabled={loading}
          />
          <Label htmlFor='inStock' className='text-sm font-medium'>
            Item is in stock
          </Label>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className='p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg'>
            <p className='text-red-800 dark:text-red-200 text-sm'>
              {errors.submit}
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className='flex gap-4 pt-4'>
          <Button type='submit' disabled={loading} className='flex-1'>
            {loading ? (
              <div className='flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2'></div>
                Creating Item...
              </div>
            ) : (
              'Create Item'
            )}
          </Button>

          <Link href='/products'>
            <Button type='button' variant='outline' disabled={loading}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
