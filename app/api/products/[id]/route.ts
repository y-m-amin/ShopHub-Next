import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { products: [], orders: [], users: [] };
  }
}

async function writeDB(data: any) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await readDB();
    const product = db.products.find((p: any) => p.id === id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await readDB();
    const productIndex = db.products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Check if user owns the product
    if (db.products[productIndex].sellerId !== body.sellerId) {
      return NextResponse.json({ error: 'Unauthorized to update this product' }, { status: 403 });
    }
    
    db.products[productIndex] = {
      ...db.products[productIndex],
      ...body,
      id: id,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writeDB(db);
    
    if (success) {
      return NextResponse.json(db.products[productIndex]);
    } else {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sellerId = request.headers.get('x-seller-id');
    const db = await readDB();
    const productIndex = db.products.findIndex((p: any) => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    if (db.products[productIndex].sellerId !== sellerId) {
      return NextResponse.json({ error: 'Unauthorized to delete this product' }, { status: 403 });
    }
    
    db.products.splice(productIndex, 1);
    const success = await writeDB(db);
    
    if (success) {
      return NextResponse.json({ message: 'Product deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}