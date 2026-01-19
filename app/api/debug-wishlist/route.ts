import { NextRequest, NextResponse } from 'next/server';
import { wishlistService, productService } from '../../../lib/postgres-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user@nexus.com';

    // Get raw wishlist data
    const wishlistData = await wishlistService.getByUserId(userId);
    
    // Get all products for comparison
    const allProducts = await productService.getAll();
    
    // Get raw database query for debugging
    const debugInfo = {
      userId,
      wishlistCount: wishlistData.length,
      productsCount: allProducts.length,
      wishlistData: wishlistData.map(item => ({
        ...item,
        productIdType: typeof item.productId,
        productIdValue: item.productId
      })),
      sampleProducts: allProducts.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        idType: typeof p.id
      }))
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug wishlist error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}