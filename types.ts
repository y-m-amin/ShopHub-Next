export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
  sellerId: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface WishlistItem {
  productId: string;
}
