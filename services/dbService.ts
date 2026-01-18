
import { Product, Order, WishlistItem } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const KEYS = {
  PRODUCTS: 'nexus_products',
  ORDERS: 'nexus_orders',
  WISHLIST: 'nexus_wishlist',
  AUTH: 'nexus_auth_token',
};

const isClient = typeof window !== 'undefined';

export const dbService = {
  getProducts: (): Product[] => {
    if (!isClient) return INITIAL_PRODUCTS;
    const data = localStorage.getItem(KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },

  getProductById: (id: string): Product | undefined => {
    const products = dbService.getProducts();
    return products.find(p => p.id === id);
  },

  addProduct: (product: Product): void => {
    if (!isClient) return;
    const products = dbService.getProducts();
    products.push(product);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getOrders: (userId: string): Order[] => {
    if (!isClient) return [];
    const data = localStorage.getItem(KEYS.ORDERS);
    if (!data) return [];
    const allOrders: Order[] = JSON.parse(data);
    return allOrders.filter(o => o.userId === userId);
  },

  addOrder: (order: Order): void => {
    if (!isClient) return;
    const data = localStorage.getItem(KEYS.ORDERS);
    const allOrders: Order[] = data ? JSON.parse(data) : [];
    allOrders.push(order);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(allOrders));
  },

  getWishlist: (): WishlistItem[] => {
    if (!isClient) return [];
    const data = localStorage.getItem(KEYS.WISHLIST);
    return data ? JSON.parse(data) : [];
  },

  toggleWishlist: (productId: string): void => {
    if (!isClient) return;
    const wishlist = dbService.getWishlist();
    const index = wishlist.findIndex(item => item.productId === productId);
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push({ productId });
    }
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
  },

  // Added missing auth methods for SPA support in App.tsx
  getAuth: (): string | null => {
    if (!isClient) return null;
    return localStorage.getItem(KEYS.AUTH);
  },

  setAuth: (token: string): void => {
    if (!isClient) return;
    localStorage.setItem(KEYS.AUTH, token);
  },

  clearAuth: (): void => {
    if (!isClient) return;
    localStorage.removeItem(KEYS.AUTH);
  }
};
