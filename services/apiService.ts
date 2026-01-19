import { Product, Order } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getSellerProducts(sellerId: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/seller/${sellerId}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'rating' | 'createdAt'>): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string, sellerId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        'x-seller-id': sellerId,
      },
    });
  }

  // Orders
  async getOrders(userId: string): Promise<Order[]> {
    return this.request<Order[]>(`/orders/${userId}`);
  }

  async createOrder(order: Omit<Order, 'id' | 'date'>): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Wishlist
  async getWishlist(userId: string): Promise<any[]> {
    return this.request<any[]>(`/wishlist/${userId}`);
  }

  async toggleWishlist(userId: string, productId: string): Promise<{ action: string }> {
    return this.request<{ action: string }>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, action: 'toggle' }),
    });
  }
}

export const apiService = new ApiService();