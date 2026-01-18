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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await readDB();
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...body,
      date: new Date().toISOString()
    };
    
    db.orders.push(newOrder);
    const success = await writeDB(db);
    
    if (success) {
      return NextResponse.json(newOrder, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}