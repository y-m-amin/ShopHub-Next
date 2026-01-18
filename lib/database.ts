import Database from 'better-sqlite3';
import { Order, Product } from '../types';

// In-memory SQLite database for demo purposes
let db: Database.Database | null = null;

function getDatabase() {
  if (!db) {
    // Create in-memory database
    db = new Database(':memory:');

    // Initialize tables
    initializeTables();

    // Seed with initial data
    seedDatabase();
  }
  return db;
}

function initializeTables() {
  if (!db) return;

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image TEXT,
      rating REAL DEFAULT 5.0,
      stock INTEGER DEFAULT 0,
      sellerId TEXT NOT NULL,
      verified BOOLEAN DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      items TEXT NOT NULL, -- JSON string
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      date TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL
    )
  `);
}

function seedDatabase() {
  if (!db) return;

  // Check if data already exists
  const productCount = db
    .prepare('SELECT COUNT(*) as count FROM products')
    .get() as { count: number };
  if (productCount.count > 0) return;

  // Insert initial products
  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerId, verified, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    // Electronics
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
      sellerId: 'admin@nexus.com',
      verified: true,
      createdAt: '2025-01-01T02:00:00.000Z',
    },
    {
      id: '4',
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
      createdAt: '2025-01-01T03:00:00.000Z',
    },

    // Audio
    {
      id: '5',
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
      id: '6',
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
      id: '7',
      name: 'Marshall Acton III',
      description:
        'Iconic Bluetooth speaker with classic Marshall design, delivering room-filling sound with deep bass.',
      price: 279.99,
      category: 'Audio',
      image:
        'https://m.media-amazon.com/images/I/71Iq3JTgVeL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.6,
      stock: 22,
      sellerId: 'admin@nexus.com',
      verified: false,
      createdAt: '2025-01-01T06:00:00.000Z',
    },

    // Home
    {
      id: '8',
      name: 'Philips Hue Smart Bulb Starter Kit',
      description:
        'Smart LED bulbs with 16 million colors, voice control compatibility, and energy-efficient lighting.',
      price: 199.99,
      category: 'Home',
      image:
        'https://m.media-amazon.com/images/I/61J8UP8pEWL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.7,
      stock: 40,
      sellerId: 'admin@nexus.com',
      verified: true,
      createdAt: '2025-01-01T07:00:00.000Z',
    },
    {
      id: '9',
      name: 'Dyson V15 Detect',
      description:
        'Powerful cordless vacuum with laser dust detection, intelligent suction, and up to 60 minutes runtime.',
      price: 749.99,
      category: 'Home',
      image:
        'https://m.media-amazon.com/images/I/61VuVU94RnL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.8,
      stock: 12,
      sellerId: 'dyson@official.com',
      verified: true,
      createdAt: '2025-01-01T08:00:00.000Z',
    },
    {
      id: '10',
      name: 'Instant Pot Duo 7-in-1',
      description:
        'Multi-functional electric pressure cooker that replaces 7 kitchen appliances with smart programming.',
      price: 99.99,
      category: 'Home',
      image:
        'https://m.media-amazon.com/images/I/71VqJtcOmvL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.6,
      stock: 30,
      sellerId: 'instantpot@kitchen.com',
      verified: false,
      createdAt: '2025-01-01T09:00:00.000Z',
    },

    // Travel
    {
      id: '11',
      name: 'Samsonite Winfield 3 Hardside Luggage',
      description:
        'Durable polycarbonate hardside luggage with TSA lock, spinner wheels, and lightweight design.',
      price: 179.99,
      category: 'Travel',
      image:
        'https://m.media-amazon.com/images/I/81VpVU2JmJL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.5,
      stock: 18,
      sellerId: 'samsonite@travel.com',
      verified: true,
      createdAt: '2025-01-01T10:00:00.000Z',
    },
    {
      id: '12',
      name: 'Peak Design Everyday Backpack',
      description:
        'Premium camera and laptop backpack with modular organization, weatherproof zippers, and lifetime warranty.',
      price: 259.95,
      category: 'Travel',
      image:
        'https://m.media-amazon.com/images/I/81QcVVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.8,
      stock: 14,
      sellerId: 'peakdesign@gear.com',
      verified: true,
      createdAt: '2025-01-01T11:00:00.000Z',
    },
    {
      id: '13',
      name: 'Portable Travel Organizer Set',
      description:
        'Complete packing cube set with compression zippers, laundry bag, and shoe organizers for efficient travel.',
      price: 39.99,
      category: 'Travel',
      image:
        'https://m.media-amazon.com/images/I/81VGvVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.3,
      stock: 45,
      sellerId: 'travelgear@store.com',
      verified: false,
      createdAt: '2025-01-01T12:00:00.000Z',
    },

    // Fitness
    {
      id: '14',
      name: 'Apple Watch Series 9',
      description:
        'Advanced fitness tracker with ECG, blood oxygen monitoring, GPS, and comprehensive health insights.',
      price: 399.0,
      category: 'Fitness',
      image:
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-45mm-pink-sport-band-pink?wid=1000&hei=1000&fmt=p-jpg&qlt=95&.v=1692720175&',
      rating: 4.9,
      stock: 28,
      sellerId: 'admin@nexus.com',
      verified: true,
      createdAt: '2025-01-01T13:00:00.000Z',
    },
    {
      id: '15',
      name: 'Fitbit Charge 6',
      description:
        'Advanced fitness tracker with built-in GPS, heart rate monitoring, and 7-day battery life.',
      price: 159.99,
      category: 'Fitness',
      image:
        'https://m.media-amazon.com/images/I/61VGvVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.4,
      stock: 35,
      sellerId: 'fitbit@health.com',
      verified: true,
      createdAt: '2025-01-01T14:00:00.000Z',
    },
    {
      id: '16',
      name: 'Resistance Bands Set',
      description:
        'Professional resistance bands with door anchor, handles, and ankle straps for full-body workouts.',
      price: 29.99,
      category: 'Fitness',
      image:
        'https://m.media-amazon.com/images/I/81VGvVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.2,
      stock: 60,
      sellerId: 'admin@nexus.com',
      verified: false,
      createdAt: '2025-01-01T15:00:00.000Z',
    },

    // Furniture
    {
      id: '17',
      name: 'Herman Miller Aeron Chair',
      description:
        'Iconic ergonomic office chair with breathable mesh, PostureFit SL support, and 12-year warranty.',
      price: 1395.0,
      category: 'Furniture',
      image:
        'https://m.media-amazon.com/images/I/61VGvVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.9,
      stock: 5,
      sellerId: 'hermanmiller@office.com',
      verified: true,
      createdAt: '2025-01-01T16:00:00.000Z',
    },
    {
      id: '18',
      name: 'IKEA BEKANT Desk',
      description:
        'Modern office desk with cable management, adjustable legs, and durable laminate surface.',
      price: 149.99,
      category: 'Furniture',
      image:
        'https://m.media-amazon.com/images/I/61VGvVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.3,
      stock: 25,
      sellerId: 'ikea@furniture.com',
      verified: true,
      createdAt: '2025-01-01T17:00:00.000Z',
    },
    {
      id: '19',
      name: 'Gaming Chair RGB',
      description:
        'High-back gaming chair with RGB lighting, lumbar support, and 360-degree swivel with smooth casters.',
      price: 299.99,
      category: 'Furniture',
      image:
        'https://m.media-amazon.com/images/I/61VGvVzVvyL._AC_UY327_FMwebp_QL65_.jpg',
      rating: 4.1,
      stock: 12,
      sellerId: 'admin@nexus.com',
      verified: false,
      createdAt: '2025-01-01T18:00:00.000Z',
    },
  ];

  for (const product of products) {
    insertProduct.run(
      product.id,
      product.name,
      product.description,
      product.price,
      product.category,
      product.image,
      product.rating,
      product.stock,
      product.sellerId,
      product.verified ? 1 : 0,
      product.createdAt,
    );
  }

  // Insert initial user
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, name)
    VALUES (?, ?, ?)
  `);

  insertUser.run('admin@nexus.com', 'admin@nexus.com', 'Alex Johnson');
}

// Product operations
export const productService = {
  getAll(sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating'): Product[] {
    const db = getDatabase();
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

    const stmt = db.prepare(`SELECT * FROM products ${orderClause}`);
    const products = stmt.all() as any[];

    // Convert verified from integer to boolean
    return products.map((product) => ({
      ...product,
      verified: Boolean(product.verified),
    })) as Product[];
  },

  getById(id: string): Product | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(id) as any;

    if (!product) return null;

    return {
      ...product,
      verified: Boolean(product.verified),
    } as Product;
  },

  getBySellerId(sellerId: string): Product[] {
    const db = getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM products WHERE sellerId = ? ORDER BY createdAt DESC',
    );
    const products = stmt.all(sellerId) as any[];

    return products.map((product) => ({
      ...product,
      verified: Boolean(product.verified),
    })) as Product[];
  },

  create(product: Omit<Product, 'id' | 'rating' | 'createdAt'>): Product {
    const db = getDatabase();
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerId, verified, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      product.name,
      product.description,
      product.price,
      product.category,
      product.image,
      5.0, // default rating
      product.stock,
      product.sellerId,
      (product as any).verified ? 1 : 0,
      createdAt,
    );

    return this.getById(id)!;
  },

  update(id: string, updates: Partial<Product>): Product | null {
    const db = getDatabase();
    const updatedAt = new Date().toISOString();

    // Build dynamic update query
    const fields = Object.keys(updates).filter((key) => key !== 'id');
    if (fields.length === 0) return this.getById(id);

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => {
      const value = (updates as any)[field];
      // Convert boolean to integer for verified field
      if (field === 'verified') return value ? 1 : 0;
      return value;
    });
    values.push(updatedAt, id);

    const stmt = db.prepare(`
      UPDATE products 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.getById(id);
  },

  delete(id: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },
};

// Order operations
export const orderService = {
  getByUserId(userId: string): Order[] {
    const db = getDatabase();
    const stmt = db.prepare(
      'SELECT * FROM orders WHERE userId = ? ORDER BY date DESC',
    );
    const rows = stmt.all(userId) as any[];

    return rows.map((row) => ({
      ...row,
      items: JSON.parse(row.items),
    })) as Order[];
  },

  create(order: Omit<Order, 'id' | 'date'>): Order {
    const db = getDatabase();
    const id = `ORD-${Date.now()}`;
    const date = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO orders (id, userId, items, total, status, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      order.userId,
      JSON.stringify(order.items),
      order.total,
      order.status || 'pending',
      date,
    );

    const getStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const result = getStmt.get(id) as any;

    return {
      ...result,
      items: JSON.parse(result.items),
    } as Order;
  },
};

// Health check
export const healthService = {
  check() {
    const db = getDatabase();
    const productCount = db
      .prepare('SELECT COUNT(*) as count FROM products')
      .get() as { count: number };
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'SQLite (in-memory)',
      productCount: productCount.count,
    };
  },
};
