'use client';

import {
  Clock,
  Heart,
  Package,
  Settings,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MOCK_USER } from '../../constants';
import { apiService } from '../../services/apiService';
import { dbService } from '../../services/dbService';
import { Order, Product } from '../../types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Utility function to safely convert to number and format
const formatPrice = (value: number | string): string => {
  const numValue = typeof value === 'number' ? value : parseFloat(String(value));
  return numValue.toFixed(2);
};

// ProfileSettings Component
function ProfileSettings() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    image: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        phone: (session.user as any).phone || '',
        image: session.user.image || '',
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: formData.image || session?.user?.image,
          },
        });
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        phone: (session.user as any).phone || '',
        image: session.user.image || '',
      });
    }
    setIsEditing(false);
  };

  const userName = session?.user?.name || MOCK_USER.name;
  const userEmail = session?.user?.email || MOCK_USER.email;
  const userImage = session?.user?.image || formData.image;

  return (
    <div className='bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm'>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-bold dark:text-white'>
          Profile Information
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'
          >
            Edit Profile
          </button>
        ) : (
          <div className='flex gap-2'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-sm font-medium'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50'
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className='space-y-6'>
        {/* Profile Image */}
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl overflow-hidden'>
            {userImage ? (
              <img
                src={userImage}
                className='w-full h-full object-cover'
                alt='Profile'
              />
            ) : (
              <UserIcon size={32} />
            )}
          </div>
          {isEditing && (
            <div className='flex-1'>
              <label className='text-sm font-bold text-zinc-500 uppercase block mb-2'>
                Profile Image URL
              </label>
              <input
                type='url'
                name='image'
                value={formData.image}
                onChange={handleChange}
                placeholder='https://example.com/avatar.jpg'
                className='w-full p-3 bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-primary-500'
              />
            </div>
          )}
        </div>

        {/* Name */}
        <div className='space-y-2'>
          <label className='text-sm font-bold text-zinc-500 uppercase'>
            Full Name
          </label>
          <input
            type='text'
            name='name'
            value={isEditing ? formData.name : userName}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-3 border rounded-xl outline-none dark:text-white ${
              isEditing
                ? 'bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary-500'
                : 'bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700'
            }`}
          />
        </div>

        {/* Email (always readonly) */}
        <div className='space-y-2'>
          <label className='text-sm font-bold text-zinc-500 uppercase'>
            Email
          </label>
          <input
            type='email'
            value={userEmail}
            readOnly
            className='w-full p-3 bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl outline-none dark:text-white'
          />
          <p className='text-xs text-zinc-500'>Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div className='space-y-2'>
          <label className='text-sm font-bold text-zinc-500 uppercase'>
            Phone
          </label>
          <input
            type='tel'
            name='phone'
            value={
              isEditing
                ? formData.phone
                : (session?.user as any)?.phone || 'Not provided'
            }
            onChange={handleChange}
            readOnly={!isEditing}
            placeholder={isEditing ? '+1 (555) 123-4567' : undefined}
            className={`w-full p-3 border rounded-xl outline-none dark:text-white ${
              isEditing
                ? 'bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary-500'
                : 'bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>(
    'orders',
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [session]);

  const fetchData = async () => {
    // Use consistent user ID - prioritize session email, fallback to mock email
    const userId = session?.user?.email || MOCK_USER.email;
    const userEmail = session?.user?.email || MOCK_USER.email;

    if (userEmail) {
      try {
        // Try to fetch orders from API
        const userOrders = await apiService.getOrders(userId);
        setOrders(
          userOrders.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );
      } catch (error) {
        console.error('Error fetching orders from API:', error);
        // Fallback to localStorage
        const userOrders = dbService.getOrders(userId);
        setOrders(
          userOrders.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );
      }

      // Fetch wishlist
      setWishlistLoading(true);
      try {
        // Try to fetch wishlist from API
        const wishlistData = await apiService.getWishlist(userId);
        console.log('Wishlist from API:', wishlistData);
        console.log('First wishlist item:', wishlistData[0]);
        
        if (wishlistData && wishlistData.length > 0) {
          // Wishlist data now always includes product info with explicit productId
          const mappedProducts = wishlistData.map((item: any) => {
            console.log('Mapping wishlist item:', item);
            return {
              id: item.productId, // Now guaranteed to exist
              name: item.name,
              price: parseFloat(item.price),
              image: item.image,
              verified: item.verified,
              description: item.description || '',
              category: item.category || '',
              rating: 5,
              stock: 0,
              sellerId: '',
              createdAt: new Date().toISOString()
            };
          });
          console.log('Mapped wishlist products:', mappedProducts);
          setWishlistProducts(mappedProducts);
        } else {
          setWishlistProducts([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist from API:', error);
        // Fallback to localStorage
        const wishlist = dbService.getWishlist();
        const products = dbService.getProducts();
        setWishlistProducts(
          products.filter((p) => wishlist.some((w) => w.productId === p.id)),
        );
      } finally {
        setWishlistLoading(false);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const userId = session?.user?.email || MOCK_USER.email;
    try {
      console.log('Removing from wishlist:', { userId, productId });
      await apiService.toggleWishlist(userId, productId);
      // Refresh wishlist
      fetchData();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const userName = session?.user?.name || MOCK_USER.name;
  const userEmail = session?.user?.email || MOCK_USER.email;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex flex-col md:flex-row gap-12'>
        <aside className='w-full md:w-64 space-y-2'>
          <div className='p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center mb-8 shadow-sm'>
            <div className='w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl overflow-hidden'>
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  className='w-full h-full object-cover'
                  alt='Profile'
                />
              ) : (
                <UserIcon size={32} />
              )}
            </div>
            <h2 className='font-bold dark:text-white'>{userName}</h2>
            <p className='text-xs text-zinc-500 truncate'>{userEmail}</p>
          </div>

          {[
            { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
            { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
            {
              id: 'listings',
              label: 'My Listings',
              icon: <ShoppingBag size={18} />,
            },
            { id: 'profile', label: 'Settings', icon: <Settings size={18} /> },
          ].map((tab) =>
            tab.id === 'listings' ? (
              <Link
                key={tab.id}
                href='/my-listings'
                className='w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-all text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              >
                <span className='mr-3'>{tab.icon}</span> {tab.label}
              </Link>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span className='mr-3'>{tab.icon}</span> {tab.label}
              </button>
            ),
          )}
        </aside>

        <main className='flex-1'>
          {activeTab === 'orders' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold dark:text-white flex items-center'>
                <Package className='mr-3 text-primary-600' /> My Orders
              </h2>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className='bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow'
                  >
                    <div className='flex justify-between items-start mb-4 border-b pb-4 border-zinc-100 dark:border-zinc-800'>
                      <div>
                        <span className='text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1'>
                          Order ID
                        </span>
                        <span className='font-mono text-sm dark:text-zinc-400'>
                          #{o.id}
                        </span>
                      </div>
                      <div className='text-right'>
                        <span className='text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1'>
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            o.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : o.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}
                        >
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </span>
                      </div>
                      <div className='text-right'>
                        <span className='text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1'>
                          Total
                        </span>
                        <span className='text-lg font-bold text-primary-600'>
                          ${formatPrice(o.total)}
                        </span>
                      </div>
                    </div>
                    <div className='space-y-3 mb-4'>
                      {o.items.map((item, idx) => (
                        <div
                          key={idx}
                          className='flex justify-between items-center'
                        >
                          <div className='flex-1'>
                            <span className='text-zinc-900 dark:text-zinc-100 font-medium'>
                              {item.name}
                            </span>
                            <span className='text-zinc-500 text-sm ml-2'>
                              ×{item.quantity}
                            </span>
                          </div>
                          <span className='dark:text-zinc-300 font-medium'>
                            ${formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className='flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800/50'>
                      <div className='flex items-center text-xs text-zinc-500'>
                        <Clock size={12} className='mr-1' />
                        Ordered on{' '}
                        {new Date(o.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <button className='text-primary-600 hover:text-primary-700 text-sm font-medium'>
                        Track Order
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800'>
                  <ShoppingBag
                    size={48}
                    className='mx-auto text-zinc-300 mb-4'
                  />
                  <p className='text-zinc-500 mb-4'>
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    href='/items'
                    className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors'
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold dark:text-white flex items-center'>
                <Heart className='mr-3 text-red-500' /> Wishlist
              </h2>
              {wishlistLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-zinc-500">Loading wishlist...</span>
                </div>
              ) : wishlistProducts.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className='bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex gap-4 shadow-sm hover:shadow-md transition-shadow'
                    >
                      <img
                        src={p.image}
                        className='w-20 h-20 rounded-xl object-cover'
                        alt={p.name}
                      />
                      <div className="flex-1">
                        <h4 className='font-bold dark:text-white text-sm line-clamp-1'>
                          {p.name}
                        </h4>
                        <p className='text-primary-600 font-bold text-sm mb-2'>
                          ${p.price}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              (window.location.href = `/items/${p.id}`)
                            }
                            className='text-xs font-bold text-zinc-500 hover:text-primary-600 transition-colors'
                          >
                            View Product
                          </button>
                          <button
                            onClick={() => removeFromWishlist(p.id)}
                            className='text-xs font-bold text-red-500 hover:text-red-600 transition-colors'
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800'>
                  <Heart size={48} className='mx-auto text-zinc-300 mb-4' />
                  <h3 className='text-xl font-bold dark:text-white mb-2'>Your wishlist is empty</h3>
                  <p className='text-zinc-500 mb-6'>Save items you love for later by adding them to your wishlist.</p>
                  <Link
                    href='/items'
                    className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors'
                  >
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold dark:text-white flex items-center'>
                <Settings className='mr-3 text-zinc-500' /> Settings
              </h2>
              <ProfileSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
