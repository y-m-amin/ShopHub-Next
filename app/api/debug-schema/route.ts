import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Check table schema
    const { rows: schemaInfo } = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `;

    // Get a sample product with all columns
    const { rows: sampleProduct } = await sql`
      SELECT * FROM products 
      WHERE id = '1768730198049' 
      LIMIT 1
    `;

    // Check what columns actually exist in the raw query
    const { rows: rawCheck } = await sql`
      SELECT id, name, sellerId, sellerid 
      FROM products 
      WHERE id = '1768730198049' 
      LIMIT 1
    `;

    return NextResponse.json({
      schemaInfo,
      sampleProduct: sampleProduct[0] || null,
      rawCheck: rawCheck[0] || null,
      columnNames: sampleProduct[0] ? Object.keys(sampleProduct[0]) : []
    });
  } catch (error) {
    console.error('Schema debug error:', error);
    return NextResponse.json(
      { 
        error: 'Schema check failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}