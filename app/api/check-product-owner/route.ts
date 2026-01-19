import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../lib/postgres-database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');

    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'Missing productId or userId' },
        { status: 400 }
      );
    }

    // Get the product
    const product = await productService.getById(productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const canEdit = product.sellerId === userId;
    
    return NextResponse.json({
      productId,
      productName: product.name,
      productSellerId: product.sellerId,
      userId,
      canEdit,
      reason: canEdit 
        ? 'User owns this product' 
        : `Product belongs to '${product.sellerId}', but user is '${userId}'`
    });
  } catch (error) {
    console.error('Check product owner error:', error);
    return NextResponse.json(
      { 
        error: 'Check failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}