import { sql } from '@vercel/postgres';
import { Order, Product } from '../types';

// Check if database is configured
function isDatabaseConfigured(): boolean {
  return !!process.env.POSTGRES_URL;
}

// Fallback data when database is not configured
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description:
      'Latest Apple iPhone with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.',
    price: 1199.99,
    category: 'Electronics',
    image:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702654',
    rating: 4.8,
    stock: 25,
    sellerId: 'apple@store.com',
    verified: true,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    description:
      'Ultra-thin laptop with M3 chip, 13.6-inch Liquid Retina display, and up to 18 hours of battery life.',
    price: 1099.0,
    category: 'Electronics',
    image:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665',
    rating: 4.9,
    stock: 15,
    sellerId: 'apple@store.com',
    verified: true,
    createdAt: '2025-01-01T01:00:00.000Z',
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features for productivity.',
    price: 1299.99,
    category: 'Electronics',
    image:
      'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzkeusq-thumb-539573016',
    rating: 4.7,
    stock: 20,
    sellerId: 'samsung@official.com',
    verified: true,
    createdAt: '2025-01-01T02:00:00.000Z',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    description:
      'Industry-leading noise canceling headphones with 30-hour battery life and crystal-clear hands-free calling.',
    price: 399.99,
    category: 'Audio',
    image:
      'https://m.media-amazon.com/images/I/51QeS0jkx+L._AC_UY327_FMwebp_QL65_.jpg',
    rating: 4.8,
    stock: 35,
    sellerId: 'sony@official.com',
    verified: true,
    createdAt: '2025-01-01T04:00:00.000Z',
  },
  {
    id: '5',
    name: 'AirPods Pro (2nd Gen)',
    description:
      "Apple's premium wireless earbuds with active noise cancellation, spatial audio, and MagSafe charging case.",
    price: 249.99,
    category: 'Audio',
    image:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361',
    rating: 4.9,
    stock: 50,
    sellerId: 'apple@store.com',
    verified: true,
    createdAt: '2025-01-01T05:00:00.000Z',
  },
  {
    id: '6',
    name: 'Philips Hue Smart Bulb Starter Kit',
    description:
      'Smart LED bulbs with 16 million colors, voice control compatibility, and energy-efficient lighting.',
    price: 199.99,
    category: 'Home',
    image:
      'https://m.media-amazon.com/images/I/61J8UP8pEWL._AC_UY327_FMwebp_QL65_.jpg',
    rating: 4.7,
    stock: 40,
    sellerId: 'philips@smart.com',
    verified: true,
    createdAt: '2025-01-01T07:00:00.000Z',
  },
];

// Initialize database tables
export async function initializeTables() {
  if (!isDatabaseConfigured()) {
    throw new Error(
      'Database not configured. Please set POSTGRES_URL environment variable.',
    );
  }

  try {
    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL NOT NULL,
        category TEXT,
        image TEXT,
        rating DECIMAL DEFAULT 5.0,
        stock INTEGER DEFAULT 0,
        sellerId TEXT NOT NULL,
        verified BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL NOT NULL,
        status TEXT DEFAULT 'pending',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT,
        phone TEXT,
        image TEXT,
        provider TEXT DEFAULT 'credentials',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create wishlists table
    await sql`
      CREATE TABLE IF NOT EXISTS wishlists (
        id SERIAL PRIMARY KEY,
        userId TEXT NOT NULL,
        productId TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, productId)
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Seed initial data (only for database)
export async function seedDatabase() {
  if (!isDatabaseConfigured()) {
    throw new Error(
      'Database not configured. Please set POSTGRES_URL environment variable.',
    );
  }

  try {
    // Check if products already exist
    const { rows: existingProducts } =
      await sql`SELECT COUNT(*) as count FROM products`;
    if (existingProducts[0].count > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database with initial products...');

    // Insert all fallback products plus additional ones
    const allProducts = [
      ...fallbackProducts,
      {
        id: '7',
        name: 'Gaming Laptop RTX 4070',
        description:
          'High-performance gaming laptop with NVIDIA RTX 4070, Intel i7-13700H, 16GB RAM, and 144Hz display.',
        price: 1599.99,
        category: 'Electronics',
        image:
          'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg',
        rating: 4.5,
        stock: 8,
        sellerId: 'techdeals@store.com',
        verified: false,
      },
      {
        id: '8',
        name: 'Marshall Acton III',
        description:
          'Iconic Bluetooth speaker with classic Marshall design, delivering room-filling sound with deep bass.',
        price: 279.99,
        category: 'Audio',
        image:
          'https://m.media-amazon.com/images/I/71Iq3JTgVeL._AC_UY327_FMwebp_QL65_.jpg',
        rating: 4.6,
        stock: 22,
        sellerId: 'marshall@audio.com',
        verified: false,
      },
    ];

    // Insert products
    for (const product of allProducts) {
      await sql`
        INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerId, verified)
        VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, 
                ${product.category}, ${product.image}, ${product.rating}, ${product.stock}, 
                ${product.sellerId}, ${product.verified})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    console.log(
      'Database seeded successfully with',
      allProducts.length,
      'products',
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Product operations
export const productService = {
  async getAll(
    sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating',
  ): Promise<Product[]> {
    if (!isDatabaseConfigured()) {
      // Return fallback data with sorting
      let products = [...fallbackProducts];

      switch (sortBy) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
      }

      return products;
    }

    let orderClause = 'ORDER BY createdAt DESC';

    switch (sortBy) {
      case 'price-asc':
        orderClause = 'ORDER BY price ASC';
        break;
      case 'price-desc':
        orderClause = 'ORDER BY price DESC';
        break;
      case 'name':
        orderClause = 'ORDER BY name ASC';
        break;
      case 'rating':
        orderClause = 'ORDER BY rating DESC';
        break;
    }

    const { rows } = await sql.query(`SELECT * FROM products ${orderClause}`);
    return rows as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    if (!isDatabaseConfigured()) {
      return fallbackProducts.find((p) => p.id === id) || null;
    }

    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
    return (rows[0] as Product) || null;
  },

  async getBySellerId(sellerId: string): Promise<Product[]> {
    if (!isDatabaseConfigured()) {
      return fallbackProducts.filter((p) => p.sellerId === sellerId);
    }

    const { rows } =
      await sql`SELECT * FROM products WHERE sellerId = ${sellerId} ORDER BY createdAt DESC`;
    return rows as Product[];
  },

  async create(
    product: Omit<Product, 'id' | 'rating' | 'createdAt'>,
  ): Promise<Product> {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database not configured. Cannot create products without database.',
      );
    }

    const id = Date.now().toString();

    const { rows } = await sql`
      INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerId, verified)
      VALUES (${id}, ${product.name}, ${product.description}, ${product.price}, 
              ${product.category}, ${product.image}, 5.0, ${product.stock}, 
              ${product.sellerId}, ${(product as any).verified || false})
      RETURNING *
    `;

    return rows[0] as Product;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database not configured. Cannot update products without database.',
      );
    }

    // Build dynamic update query
    const fields = Object.keys(updates).filter((key) => key !== 'id');
    if (fields.length === 0) return this.getById(id);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    const values = [id, ...fields.map((field) => (updates as any)[field])];

    const { rows } = await sql.query(
      `
      UPDATE products 
      SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `,
      values,
    );

    return (rows[0] as Product) || null;
  },

  async delete(id: string): Promise<boolean> {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database not configured. Cannot delete products without database.',
      );
    }

    const { rowCount } = await sql`DELETE FROM products WHERE id = ${id}`;
    return rowCount > 0;
  },
};

// Order operations
export const orderService = {
  async getByUserId(userId: string): Promise<Order[]> {
    if (!isDatabaseConfigured()) {
      return []; // Return empty array for fallback
    }

    const { rows } =
      await sql`SELECT * FROM orders WHERE userId = ${userId} ORDER BY date DESC`;
    return rows as Order[];
  },

  async create(order: Omit<Order, 'id' | 'date'>): Promise<Order> {
    if (!isDatabaseConfigured()) {
      // Return mock order for fallback
      return {
        id: `ORD-${Date.now()}`,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status || 'pending',
        date: new Date().toISOString(),
      };
    }

    const id = `ORD-${Date.now()}`;

    const { rows } = await sql`
      INSERT INTO orders (id, userId, items, total, status)
      VALUES (${id}, ${order.userId}, ${JSON.stringify(order.items)}, ${order.total}, ${order.status || 'pending'})
      RETURNING *
    `;

    const result = rows[0] as any;
    return {
      ...result,
      items:
        typeof result.items === 'string'
          ? JSON.parse(result.items)
          : result.items,
    } as Order;
  },
};

// Wishlist operations
export const wishlistService = {
  async getByUserId(userId: string) {
    if (!isDatabaseConfigured()) {
      return []; // Return empty array for fallback
    }

    const { rows } = await sql`
      SELECT w.*, p.name, p.price, p.image, p.verified
      FROM wishlists w 
      JOIN products p ON w.productId = p.id 
      WHERE w.userId = ${userId}
      ORDER BY w.createdAt DESC
    `;
    return rows;
  },

  async add(userId: string, productId: string) {
    if (!isDatabaseConfigured()) {
      return { id: Date.now(), userId, productId };
    }

    const { rows } = await sql`
      INSERT INTO wishlists (userId, productId) 
      VALUES (${userId}, ${productId})
      ON CONFLICT (userId, productId) DO NOTHING
      RETURNING *
    `;
    return rows[0];
  },

  async remove(userId: string, productId: string) {
    if (!isDatabaseConfigured()) {
      return true;
    }

    const { rowCount } = await sql`
      DELETE FROM wishlists 
      WHERE userId = ${userId} AND productId = ${productId}
    `;
    return rowCount > 0;
  },

  async toggle(userId: string, productId: string) {
    if (!isDatabaseConfigured()) {
      return { action: 'added' }; // Mock response
    }

    // Check if exists
    const { rows: existing } = await sql`
      SELECT * FROM wishlists WHERE userId = ${userId} AND productId = ${productId}
    `;

    if (existing.length > 0) {
      // Remove from wishlist
      await this.remove(userId, productId);
      return { action: 'removed' };
    } else {
      // Add to wishlist
      await this.add(userId, productId);
      return { action: 'added' };
    }
  },
};

// User operations
export const userService = {
  async getByEmail(email: string) {
    if (!isDatabaseConfigured()) {
      return null;
    }

    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows[0] || null;
  },

  async getById(id: string) {
    if (!isDatabaseConfigured()) {
      return null;
    }

    const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
    return rows[0] || null;
  },

  async create(user: {
    email: string;
    name: string;
    password?: string;
    phone?: string;
    image?: string;
    provider?: string;
  }) {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database not configured. Cannot create users without database.',
      );
    }

    const id = Date.now().toString();

    const { rows } = await sql`
      INSERT INTO users (id, email, name, password, phone, image, provider)
      VALUES (${id}, ${user.email}, ${user.name}, ${user.password || null}, 
              ${user.phone || null}, ${user.image || null}, ${user.provider || 'credentials'})
      RETURNING id, email, name, phone, image, provider, createdAt
    `;

    return rows[0];
  },

  async update(
    id: string,
    updates: {
      name?: string;
      phone?: string;
      image?: string;
    },
  ) {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database not configured. Cannot update users without database.',
      );
    }

    const fields = Object.keys(updates).filter(
      (key) => updates[key as keyof typeof updates] !== undefined,
    );
    if (fields.length === 0) return this.getById(id);

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    const values = [
      id,
      ...fields.map((field) => updates[field as keyof typeof updates]),
    ];

    const { rows } = await sql.query(
      `
      UPDATE users 
      SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, name, phone, image, provider, createdAt, updatedAt
    `,
      values,
    );

    return rows[0] || null;
  },

  async updatePassword(id: string, hashedPassword: string) {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database not configured. Cannot update password without database.',
      );
    }

    const { rows } = await sql`
      UPDATE users 
      SET password = ${hashedPassword}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, email, name
    `;

    return rows[0] || null;
  },
};

// Health check
export const healthService = {
  async check() {
    try {
      if (!isDatabaseConfigured()) {
        return {
          status: 'OK',
          timestamp: new Date().toISOString(),
          database: 'Fallback Mode (No Database)',
          productCount: fallbackProducts.length,
          orderCount: 0,
          wishlistCount: 0,
          note: 'Using fallback data. Set POSTGRES_URL to enable database.',
        };
      }

      const { rows: productCount } =
        await sql`SELECT COUNT(*) as count FROM products`;
      const { rows: orderCount } =
        await sql`SELECT COUNT(*) as count FROM orders`;
      const { rows: wishlistCount } =
        await sql`SELECT COUNT(*) as count FROM wishlists`;

      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL (Vercel)',
        productCount: parseInt(productCount[0].count),
        orderCount: parseInt(orderCount[0].count),
        wishlistCount: parseInt(wishlistCount[0].count),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL (Vercel)',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
