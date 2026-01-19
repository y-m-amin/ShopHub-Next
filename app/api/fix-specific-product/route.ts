import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { productId, newSellerId } = await request.json();
    
    if (!productId || !newSellerId) {
      return NextResponse.json(
        { error: 'Missing productId or newSellerId' },
        { status: 400 }
      );
    }
    
    console.log(`Fixing product ${productId} to belong to ${newSellerId}`);
    
    // Check current state
    const { rows: before } = await sql`
      SELECT id, name, sellerId FROM products WHERE id = ${productId}
    `;
    
    if (before.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Update the product
    const { rowCount } = await sql`
      UPDATE products 
      SET sellerId = ${newSellerId}
      WHERE id = ${productId}
    `;
    
    // Verify the fix
    const { rows: after } = await sql`
      SELECT id, name, sellerId FROM products WHERE id = ${productId}
    `;
    
    return NextResponse.json({
      success: true,
      message: `Product ${productId} updated successfully`,
      before: before[0],
      after: after[0],
      rowsUpdated: rowCount
    });
    
  } catch (error) {
    console.error('Fix specific product error:', error);
    return NextResponse.json(
      { 
        error: 'Fix failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}