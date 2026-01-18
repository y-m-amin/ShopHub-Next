import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../../../lib/postgres-database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-seller-id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> },
) {
  try {
    const { sellerId } = await params;
    const products = await productService.getBySellerId(sellerId);
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller products' },
      { status: 500, headers: corsHeaders },
    );
  }
}
