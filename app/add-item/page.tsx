
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { PlusCircle, Tag, DollarSign, Package, Check, ArrowLeft, Image, Link as LinkIcon } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { MOCK_USER } from '../../constants';
import toast from 'react-hot-toast';

export default function AddItemPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    category: 'Electronics', 
    stock: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = ['Electronics', 'Audio', 'Home', 'Travel', 'Fitness', 'Furniture', 'Gaming', 'Tools', 'Books', 'Clothing'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sellerId = session?.user?.email || MOCK_USER.email;
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || `https://picsum.photos/seed/${Date.now()}/800/600`,
        stock: parseInt(formData.stock),
        sellerId: sellerId
      };

      await apiService.createProduct(productData);
      
      setSuccess(true);
      toast.success('Product listed successfully! 🎉');
      
      setTimeout(() => {
        router.push('/items');
      }, 2000);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to list product. Please try again.');
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, image: e.target.value});
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center text-sm text-zinc-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>
      
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {success ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white mb-4">Product Listed Successfully!</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">Your item is now live on the marketplace.</p>
            <div className="text-sm text-zinc-500">Redirecting to marketplace...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="text-primary-600" size={32} />
              </div>
              <h1 className="text-2xl font-bold dark:text-white">List Your Product</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Fill in the details to add your item to the marketplace</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold dark:text-zinc-300 flex items-center">
                <Tag size={16} className="mr-2" /> Product Name
              </label>
              <input 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all" 
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold dark:text-zinc-300 flex items-center">
                <LinkIcon size={16} className="mr-2" /> Image URL
              </label>
              <input 
                type="url"
                value={formData.image} 
                onChange={handleImageUrlChange}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all" 
                placeholder="https://example.com/image.jpg (optional - random image will be generated if empty)"
              />
              {formData.image && (
                <div className="mt-3">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/placeholder/800/600`;
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold dark:text-zinc-300 flex items-center">
                  <DollarSign size={16} className="mr-2" /> Price (USD)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all" 
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold dark:text-zinc-300 flex items-center">
                  <Package size={16} className="mr-2" /> Stock Quantity
                </label>
                <input 
                  type="number" 
                  required 
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all" 
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold dark:text-zinc-300">Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold dark:text-zinc-300">Description</label>
              <textarea 
                required 
                rows={4} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all resize-none" 
                placeholder="Describe your product in detail..."
              />
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:opacity-75 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center group"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <PlusCircle size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                  List Product
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
