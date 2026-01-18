# Data Persistence Migration Guide

## Current State

- In-memory SQLite database
- Data resets on serverless function cold starts
- No persistence across sessions

## Recommended Solution: Vercel Postgres

### Why Vercel Postgres?

1. **Minimal Code Changes**: Similar SQL syntax to SQLite
2. **Vercel Integration**: Built-in, no external accounts needed
3. **Serverless**: Scales automatically with your app
4. **Free Tier**: 60 hours compute/month (plenty for demos)

### Migration Steps

#### 1. Install Vercel Postgres

```bash
npm install @vercel/postgres
```

#### 2. Set up Database in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string

#### 3. Update Environment Variables

Add to your Vercel project:

```
POSTGRES_URL="postgres://..."
```

#### 4. Update Database Service

Replace `lib/database.ts` with Postgres version:

```typescript
import { sql } from '@vercel/postgres';

// Initialize tables (run once)
export async function initializeTables() {
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

  await sql`
    CREATE TABLE IF NOT EXISTS wishlists (
      id SERIAL PRIMARY KEY,
      userId TEXT NOT NULL,
      productId TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, productId)
    )
  `;
}

// Product operations
export const productService = {
  async getAll(sortBy?: string) {
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
    return rows;
  },

  async getById(id: string) {
    const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
    return rows[0] || null;
  },

  async create(product: any) {
    const id = Date.now().toString();
    const { rows } = await sql`
      INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerId, verified)
      VALUES (${id}, ${product.name}, ${product.description}, ${product.price}, 
              ${product.category}, ${product.image}, 5.0, ${product.stock}, 
              ${product.sellerId}, ${product.verified || false})
      RETURNING *
    `;
    return rows[0];
  },

  async update(id: string, updates: any) {
    const { rows } = await sql`
      UPDATE products 
      SET name = ${updates.name}, description = ${updates.description}, 
          price = ${updates.price}, stock = ${updates.stock}, 
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0];
  },

  async delete(id: string) {
    const { rowCount } = await sql`DELETE FROM products WHERE id = ${id}`;
    return rowCount > 0;
  },
};

// Wishlist operations (NEW!)
export const wishlistService = {
  async getByUserId(userId: string) {
    const { rows } = await sql`
      SELECT w.*, p.name, p.price, p.image 
      FROM wishlists w 
      JOIN products p ON w.productId = p.id 
      WHERE w.userId = ${userId}
    `;
    return rows;
  },

  async add(userId: string, productId: string) {
    const { rows } = await sql`
      INSERT INTO wishlists (userId, productId) 
      VALUES (${userId}, ${productId})
      ON CONFLICT (userId, productId) DO NOTHING
      RETURNING *
    `;
    return rows[0];
  },

  async remove(userId: string, productId: string) {
    const { rowCount } = await sql`
      DELETE FROM wishlists 
      WHERE userId = ${userId} AND productId = ${productId}
    `;
    return rowCount > 0;
  },
};
```

#### 5. Seed Initial Data

Create `scripts/seed.js`:

```javascript
import { sql } from '@vercel/postgres';

async function seed() {
  // Insert your 19 products here
  await sql`INSERT INTO products (id, name, description, price, category, image, rating, stock, sellerId, verified) VALUES ...`;
}

seed().catch(console.error);
```

#### 6. Update API Routes

Minimal changes needed - just replace database calls:

```typescript
// Before (SQLite)
const products = productService.getAll();

// After (Postgres)
const products = await productService.getAll();
```

### Alternative: Quick Setup with Vercel KV

If you want the absolute quickest setup:

```typescript
import { kv } from '@vercel/kv';

export const productService = {
  async getAll() {
    const products = (await kv.get('products')) || [];
    return products;
  },

  async create(product) {
    const products = (await kv.get('products')) || [];
    const newProduct = { id: Date.now().toString(), ...product };
    products.push(newProduct);
    await kv.set('products', products);
    return newProduct;
  },
};
```

### Migration Checklist

- [ ] Choose database solution (Vercel Postgres recommended)
- [ ] Set up database in Vercel dashboard
- [ ] Install required packages
- [ ] Update environment variables
- [ ] Migrate database service code
- [ ] Add async/await to API routes
- [ ] Create seed script for initial data
- [ ] Test locally with database
- [ ] Deploy and verify persistence

### Benefits After Migration

✅ **Persistent Data**: Products, orders, wishlists survive deployments
✅ **User-Specific Data**: Each user has their own wishlist
✅ **Real Database**: Proper ACID transactions, constraints
✅ **Scalable**: Handles multiple concurrent users
✅ **Backup**: Automatic backups and point-in-time recovery
✅ **Analytics**: Query data for insights and reporting

### Cost Considerations

**Vercel Postgres Free Tier:**

- 60 compute hours/month
- 256MB storage
- Perfect for demos and small apps

**When you might need paid tier:**

- High traffic (>1000 daily active users)
- Large datasets (>256MB)
- Complex analytics queries
