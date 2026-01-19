import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../lib/postgres-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId') || 'user@nexus.com';

    // Get products for this seller
    // console.log('Debug API: Getting products for sellerId:', sellerId);
    const sellerProducts = await productService.getBySellerId(sellerId);
    
    // Get all products for comparison
    // console.log('Debug API: Getting all products...');
    const allProducts = await productService.getAll();
    
    // console.log('Debug API: Raw data:', {
    //   sellerProductsCount: sellerProducts.length,
    //   allProductsCount: allProducts.length,
    //   sellerProductSellerIds: sellerProducts.map(p => p.sellerId),
    //   allProductSellerIds: allProducts.map(p => p.sellerId).slice(0, 10) // First 10
    // });
    
    const debugInfo = {
      sellerId,
      sellerProductsCount: sellerProducts.length,
      totalProductsCount: allProducts.length,
      sellerProducts: sellerProducts.map(p => ({
        id: p.id,
        name: p.name,
        sellerId: p.sellerId,
        sellerIdType: typeof p.sellerId
      })),
      allSellers: [...new Set(allProducts.map(p => p.sellerId))].filter(Boolean), // Remove null values
      nullSellerCount: allProducts.filter(p => !p.sellerId).length,
      sampleProducts: allProducts.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        sellerId: p.sellerId,
        sellerIdIsNull: p.sellerId === null
      }))
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug products error:', error);
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}