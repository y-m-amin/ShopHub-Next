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
      'https://images.samsung.com/bd/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-black-back-mo.jpg?imbypass=true',
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
      'https://assets.gadgetandgear.com/upload/media/1708837385023112.jpeg',
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
      'https://www.assets.signify.com/is/image/Signify/046677563301-929002468706-Philips-Hue_WCA-10_5W-A19-E26-4set-CA-RTP',
    rating: 4.7,
    stock: 40,
    sellerId: 'philips@smart.com',
    verified: true,
    createdAt: '2025-01-01T07:00:00.000Z',
  },
  {
    id: '7',
    name: 'Nexus Pro Ultra',
    description: 'High-performance computing device for the modern professional. Featuring zero-latency architecture and titanium casing.',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://www.yankodesign.com/images/design_news/2022/12/teenage-engineering-desktop-pc-case-exudes-raw-power-with-a-retro-futuristic-vibe/teenage-engineering-computer-1-aluminum-3.jpg',
    rating: 4.8,
    stock: 12,
    sellerId: 'admin@nexus.com',
    verified: true,
    createdAt: '2025-01-01T08:00:00.000Z'
  },
  {
    id: '8',
    name: 'Stealth Audio X',
    description: 'Noise-cancelling headphones with biometric sensors and immersive spatial audio engineering.',
    price: 349,
    category: 'Audio',
    image: 'https://designwanted.com/wp-content/uploads/2023/01/Wireless-headphone-concepts-cover.jpg',
    rating: 4.9,
    stock: 45,
    sellerId: 'admin@nexus.com',
    verified: false,
    createdAt: '2025-01-01T09:00:00.000Z'
  },
  {
    id: '9',
    name: 'Lumina Smart Light',
    description: 'Ambient lighting system controlled by AI, adapting to your circadian rhythm for better sleep.',
    price: 89.99,
    category: 'Home',
    image: 'https://img.freepik.com/free-photo/side-view-hand-with-smartphone-smart-light_23-2150671605.jpg?semt=ais_hybrid&w=740&q=80',
    rating: 4.5,
    stock: 120,
    sellerId: 'admin@nexus.com',
    verified: true,
    createdAt: '2025-01-01T10:00:00.000Z'
  },
  {
    id: '10',
    name: 'Vanguard Backpack',
    description: 'Anti-theft modular backpack designed for digital nomads. Waterproof and includes solar charging panel.',
    price: 159.5,
    category: 'Travel',
    image: 'https://conceptkart.com/cdn/shop/files/Concept-Kart-BANGE-BG-7216plus-Antitheft-Lock-USBPort-Travel-Backpack-_2_grande.jpg?v=1690539064',
    rating: 4.7,
    stock: 30,
    sellerId: 'admin@nexus.com',
    verified: false,
    createdAt: '2025-01-01T11:00:00.000Z'
  },
  {
    id: '11',
    name: 'Core Fitness Tracker',
    description: 'Advanced metabolic tracking in a sleek, minimalist band. 30-day battery life.',
    price: 199,
    category: 'Fitness',
    image: 'https://www.sbsmobile.com/cdn/shop/files/GLBEATSMARTHRA_PAN_1.jpg?v=1742378002&width=2048',
    rating: 4.3,
    stock: 80,
    sellerId: 'admin@nexus.com',
    verified: false,
    createdAt: '2025-01-01T12:00:00.000Z'
  },
  {
    id: '12',
    name: 'Infinite Ergo Chair',
    description: 'The last office chair you will ever need. Self-adjusting lumbar support and breathable mesh.',
    price: 899,
    category: 'Furniture',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScamQKxtGnB1WfM96fMMQ3886jkcQta5ccdg&s',
    rating: 4.9,
    stock: 5,
    sellerId: 'admin@nexus.com',
    verified: true,
    createdAt: '2025-01-01T13:00:00.000Z'
  },
  {
    id: '1768730198049',
    name: 'RTX 3060 MSI Gaming X',
    description: 'Graphics card',
    price: 200,
    category: 'Electronics',
    image: 'https://www.startech.com.bd/image/cache/catalog/graphics-card/msi/rtx-3060-gaming-x/rtx-3060-gaming-x-01-500x500.jpg',
    stock: 8,
    sellerId: 'ymohammad18@gmail.com',
    verified: false,
    rating: 5,
    createdAt: '2026-01-18T09:56:38.049Z',
    updatedAt: '2026-01-18T10:19:56.910Z'
  }
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
        sellerid TEXT NOT NULL,
        verified BOOLEAN DEFAULT false,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userid TEXT NOT NULL,
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
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create wishlists table
    await sql`
      CREATE TABLE IF NOT EXISTS wishlists (
        id SERIAL PRIMARY KEY,
        userid TEXT NOT NULL,
        productid TEXT NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userid, productid)
      )
    `;

    // console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Seed initial data (only for database)
export async function seedDatabase(force = false) {
  if (!isDatabaseConfigured()) {
    throw new Error(
      'Database not configured. Please set POSTGRES_URL environment variable.',
    );
  }

  try {
    // Check if products already exist
    const { rows: existingProducts } =
      await sql`SELECT COUNT(*) as count FROM products`;
    if (existingProducts[0].count > 0 && !force) {
      // console.log('Database already seeded');
      return;
    }

    if (force && existingProducts[0].count > 0) {
      // console.log('Force re-seeding: Clearing existing products...');
      await sql`DELETE FROM products`;
    }

    // console.log('Seeding database with initial products...');

    // Insert all fallback products plus additional ones
    const allProducts = [
      ...fallbackProducts,
      {
        id: '13',
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
        id: '14',
        name: 'Marshall Acton III',
        description:
          'Iconic Bluetooth speaker with classic Marshall design, delivering room-filling sound with deep bass.',
        price: 279.99,
        category: 'Audio',
        image:
          'https://www.applegadgetsbd.com/_next/image?url=https%3A%2F%2Fadminapi.applegadgetsbd.com%2Fstorage%2Fmedia%2Flarge%2FMarshall-Acton-III-Portable-Wireless-Speaker-cream-1560.jpg&w=3840&q=100',
        rating: 4.6,
        stock: 22,
        sellerId: 'marshall@audio.com',
        verified: false,
      },
      // Add some products for the demo user (user@nexus.com)
      {
        id: '15',
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
        price: 29.99,
        category: 'Electronics',
        image: 'https://assets.gadgetandgear.com/upload/product/20230309_1678362137_709452.jpeg',
        rating: 4.3,
        stock: 50,
        sellerId: 'user@nexus.com',
        verified: false,
      },
      {
        id: '16',
        name: 'Bluetooth Mechanical Keyboard',
        description: 'Premium mechanical keyboard with RGB backlighting and wireless connectivity. Perfect for gaming and productivity.',
        price: 149.99,
        category: 'Electronics',
        image: 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg',
        rating: 4.7,
        stock: 25,
        sellerId: 'user@nexus.com',
        verified: false,
      },
      {
        id: '17',
        name: 'Smart Water Bottle',
        description: 'Insulated smart water bottle that tracks hydration and maintains temperature for 24 hours.',
        price: 79.99,
        category: 'Fitness',
        image: 'https://www.waterh.com/cdn/shop/files/WaterH_Boost_32oz_Smart_Water_Bottle_App_Connected_Insulated-Black.jpg?v=1767694977&width=1946',
        rating: 4.4,
        stock: 35,
        sellerId: 'user@nexus.com',
        verified: false,
      },
      // Add products for ymohammad18@gmail.com (current logged in user)
      {
        id: '18',
        name: 'Portable SSD 1TB',
        description: 'Ultra-fast portable SSD with USB-C connectivity. Perfect for content creators and professionals.',
        price: 129.99,
        category: 'Electronics',
        image: 'https://cdn.shopz.com.bd/2024/12/Sandisk-1TB-Extreme-V2-Portable-SSD-SDSSDE61-1T00-G25-1.jpg',
        rating: 4.6,
        stock: 40,
        sellerId: 'ymohammad18@gmail.com',
        verified: true,
      },
      {
        id: '19',
        name: 'Wireless Mouse Pro',
        description: 'Ergonomic wireless mouse with precision tracking and long battery life. Great for productivity.',
        price: 59.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
        rating: 4.5,
        stock: 60,
        sellerId: 'ymohammad18@gmail.com',
        verified: false,
      },
      {
        id: '20',
        name: 'USB-C Hub 7-in-1',
        description: 'Compact USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging. Essential for laptops.',
        price: 39.99,
        category: 'Electronics',
        image: 'https://extremegadgets.com.bd/wp-content/uploads/2024/05/61rns8Cs0nL._AC_SL1500_.jpg',
        rating: 4.3,
        stock: 75,
        sellerId: 'ymohammad18@gmail.com',
        verified: false,
      },
    ];

    // Insert products
    for (const product of allProducts) {
      await sql`
        INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerid, verified)
        VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, 
                ${product.category}, ${product.image}, ${product.rating}, ${product.stock}, 
                ${product.sellerId}, ${product.verified})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // console.log(
    //   'Database seeded successfully with',
    //   allProducts.length,
    //   'products (including 3 for user@nexus.com and 3 for ymohammad18@gmail.com)',
    // );

    // Fix any products with null sellerId (cleanup existing data)
    // console.log('Fixing products with null sellerId...');
    
    // First, update all null sellerIds to admin@nexus.com
    const { rowCount: adminUpdated } = await sql`
      UPDATE products 
      SET sellerid = 'admin@nexus.com' 
      WHERE sellerid IS NULL OR sellerid = ''
    `;
    // console.log(`Updated ${adminUpdated} products to admin@nexus.com`);
    
    // Then, specifically assign the new products to the correct users
    await sql`
      UPDATE products 
      SET sellerid = 'user@nexus.com' 
      WHERE id IN ('15', '16', '17')
    `;
    
    await sql`
      UPDATE products 
      SET sellerid = 'ymohammad18@gmail.com' 
      WHERE id IN ('18', '19', '20')
    `;
    
    // Verify the fix
    const { rows: sellerCheck } = await sql`
      SELECT sellerid, COUNT(*) as count 
      FROM products 
      GROUP BY sellerid 
      ORDER BY count DESC
    `;
    
    // console.log('Seller distribution after fix:', sellerCheck);
    
    const { rows: nullCheck } = await sql`
      SELECT COUNT(*) as count FROM products WHERE sellerid IS NULL OR sellerid = ''
    `;
    
    // console.log(`Products with null sellerId after fix: ${nullCheck[0]?.count || 0}`);

    // Add some sample wishlist data for the demo user
    // console.log('Adding sample wishlist data...');
    const sampleWishlistItems = [
      { userId: 'user@nexus.com', productId: '1' },
      { userId: 'user@nexus.com', productId: '5' },
      { userId: 'user@nexus.com', productId: '8' },
    ];

    for (const item of sampleWishlistItems) {
      await sql`
        INSERT INTO wishlists (userid, productid)
        VALUES (${item.userId}, ${item.productId})
        ON CONFLICT (userid, productid) DO NOTHING
      `;
    }

    // console.log('Sample wishlist data added successfully');
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

    let orderClause = 'ORDER BY createdat DESC';

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
    // Convert numeric fields from strings to numbers and map column names
    return rows.map((product: any) => ({
      ...product,
      sellerId: product.sellerid, // Map lowercase to camelCase
      createdAt: product.createdat, // Map lowercase to camelCase
      updatedAt: product.updatedat, // Map lowercase to camelCase
      price: parseFloat(product.price),
      rating: parseFloat(product.rating),
      stock: parseInt(product.stock),
    })) as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    if (!isDatabaseConfigured()) {
      return fallbackProducts.find((p) => p.id === id) || null;
    }

    // console.log('getById called for product:', id);
    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (!rows[0]) {
      // console.log('getById: Product not found');
      return null;
    }
    
    // Convert numeric fields from strings to numbers and map column names
    const product = rows[0] as any;
    const result = {
      ...product,
      sellerId: product.sellerid, // Map lowercase to camelCase
      createdAt: product.createdat, // Map lowercase to camelCase
      updatedAt: product.updatedat, // Map lowercase to camelCase
      price: parseFloat(product.price),
      rating: parseFloat(product.rating),
      stock: parseInt(product.stock),
    } as Product;
    
    // console.log('getById result:', {
    //   id: result.id,
    //   name: result.name,
    //   sellerId: result.sellerId,
    //   sellerIdType: typeof result.sellerId
    // });
    
    return result;
  },

  async getBySellerId(sellerId: string): Promise<Product[]> {
    if (!isDatabaseConfigured()) {
      return fallbackProducts.filter((p) => p.sellerId === sellerId);
    }

    // console.log('getBySellerId called with:', sellerId);
    const { rows } =
      await sql`SELECT * FROM products WHERE sellerid = ${sellerId} ORDER BY createdat DESC`;
    
    // console.log('getBySellerId raw results:', {
    //   sellerId,
    //   rowCount: rows.length,
    //   sampleRow: rows[0] ? {
    //     id: rows[0].id,
    //     name: rows[0].name,
    //     sellerid: rows[0].sellerid,
    //     selleridType: typeof rows[0].sellerid
    //   } : null
    // });
    
    // Convert numeric fields from strings to numbers and map column names
    const products = rows.map((product: any) => ({
      ...product,
      sellerId: product.sellerid, // Map lowercase to camelCase
      createdAt: product.createdat, // Map lowercase to camelCase
      updatedAt: product.updatedat, // Map lowercase to camelCase
      price: parseFloat(product.price),
      rating: parseFloat(product.rating),
      stock: parseInt(product.stock),
    })) as Product[];
    
    // console.log('getBySellerId processed results:', {
    //   sellerId,
    //   productCount: products.length,
    //   productIds: products.map(p => p.id),
    //   productSellerIds: products.map(p => ({ id: p.id, sellerId: p.sellerId }))
    // });
    
    return products;
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
      INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerid, verified)
      VALUES (${id}, ${product.name}, ${product.description}, ${product.price}, 
              ${product.category}, ${product.image}, 5.0, ${product.stock}, 
              ${product.sellerId}, ${(product as any).verified || false})
      RETURNING *
    `;

    const result = rows[0] as any;
    return {
      ...result,
      sellerId: result.sellerid,
      createdAt: result.createdat,
      updatedAt: result.updatedat,
    } as Product;
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
      .map((field, index) => {
        const fieldMap: { [key: string]: string } = {
          sellerId: 'sellerid',
          createdAt: 'createdat',
          updatedAt: 'updatedat'
        };
        const dbColumn = fieldMap[field] || field;
        return `${dbColumn} = $${index + 2}`;
      })
      .join(', ');
    const values = [id, ...fields.map((field) => (updates as any)[field])];

    const { rows } = await sql.query(
      `
      UPDATE products 
      SET ${setClause}, updatedat = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `,
      values,
    );

    if (!rows[0]) return null;
    
    const result = rows[0] as any;
    return {
      ...result,
      sellerId: result.sellerid,
      createdAt: result.createdat,
      updatedAt: result.updatedat,
    } as Product;
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
      await sql`SELECT * FROM orders WHERE userid = ${userId} ORDER BY date DESC`;
    // Convert numeric fields and parse JSON items
    return rows.map((order: any) => ({
      ...order,
      userId: order.userid, // Map lowercase to camelCase
      total: parseFloat(order.total),
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    })) as Order[];
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
      INSERT INTO orders (id, userid, items, total, status)
      VALUES (${id}, ${order.userId}, ${JSON.stringify(order.items)}, ${order.total}, ${order.status || 'pending'})
      RETURNING *
    `;

    const result = rows[0] as any;
    return {
      ...result,
      userId: result.userid, // Map lowercase to camelCase
      total: parseFloat(result.total),
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

    try {
      const { rows } = await sql`
        SELECT w.id as wishlist_id, w.userid, w.productid, w.createdat as wishlist_created,
               p.id as product_id, p.name, p.price, p.image, p.verified, p.description, p.category
        FROM wishlists w 
        JOIN products p ON w.productid = p.id 
        WHERE w.userid = ${userId}
        ORDER BY w.createdat DESC
      `;
      
      // Map the results to ensure we have the correct productId
      return rows.map((row: any) => ({
        id: row.wishlist_id,
        userId: row.userid,
        productId: row.productid || row.product_id, // Ensure we have productId
        createdAt: row.wishlist_created,
        // Product info
        name: row.name,
        price: row.price,
        image: row.image,
        verified: row.verified,
        description: row.description,
        category: row.category
      }));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  async add(userId: string, productId: string) {
    if (!isDatabaseConfigured()) {
      return { id: Date.now(), userId, productId };
    }

    const { rows } = await sql`
      INSERT INTO wishlists (userid, productid) 
      VALUES (${userId}, ${productId})
      ON CONFLICT (userid, productid) DO NOTHING
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
      WHERE userid = ${userId} AND productid = ${productId}
    `;
    return rowCount > 0;
  },

  async toggle(userId: string, productId: string) {
    if (!isDatabaseConfigured()) {
      return { action: 'added' }; // Mock response
    }

    // Check if exists
    const { rows: existing } = await sql`
      SELECT * FROM wishlists WHERE userid = ${userId} AND productid = ${productId}
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
      RETURNING id, email, name, phone, image, provider, createdat
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
      SET ${setClause}, updatedat = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, name, phone, image, provider, createdat, updatedat
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
      SET password = ${hashedPassword}, updatedat = CURRENT_TIMESTAMP
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
