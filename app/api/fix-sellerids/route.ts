import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    console.log('Starting sellerId fix...');
    
    // Check current state
    const { rows: beforeCheck } = await sql`
      SELECT 
        CASE 
          WHEN sellerId IS NULL THEN 'NULL'
          WHEN sellerId = '' THEN 'EMPTY'
          ELSE sellerId 
        END as seller_status,
        COUNT(*) as count 
      FROM products 
      GROUP BY seller_status 
      ORDER BY count DESC
    `;
    
    console.log('Before fix - Seller status:', beforeCheck);
    
    // Fix null and empty sellerIds
    const { rowCount: nullFixed } = await sql`
      UPDATE products 
      SET sellerId = 'admin@nexus.com' 
      WHERE sellerId IS NULL OR sellerId = ''
    `;
    
    console.log(`Fixed ${nullFixed} products with null/empty sellerId`);
    
    // Assign specific products to users
    const { rowCount: userProducts } = await sql`
      UPDATE products 
      SET sellerId = 'user@nexus.com' 
      WHERE id IN ('15', '16', '17')
    `;
    
    const { rowCount: ymProducts } = await sql`
      UPDATE products 
      SET sellerId = 'ymohammad18@gmail.com' 
      WHERE id IN ('18', '19', '20')
    `;
    
    console.log(`Assigned ${userProducts} products to user@nexus.com`);
    console.log(`Assigned ${ymProducts} products to ymohammad18@gmail.com`);
    
    // Verify the fix
    const { rows: afterCheck } = await sql`
      SELECT sellerId, COUNT(*) as count 
      FROM products 
      WHERE sellerId IS NOT NULL AND sellerId != ''
      GROUP BY sellerId 
      ORDER BY count DESC
    `;
    
    const { rows: stillNull } = await sql`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE sellerId IS NULL OR sellerId = ''
    `;
    
    return NextResponse.json({
      success: true,
      message: 'SellerId fix completed',
      results: {
        beforeFix: beforeCheck,
        nullFixed: nullFixed,
        userProductsAssigned: userProducts,
        ymProductsAssigned: ymProducts,
        afterFix: afterCheck,
        stillNullCount: stillNull[0]?.count || 0
      }
    });
    
  } catch (error) {
    console.error('SellerId fix error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Fix failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}