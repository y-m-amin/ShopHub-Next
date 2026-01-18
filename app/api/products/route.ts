import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../lib/postgres-database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-seller-id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') as
      | 'price-asc'
      | 'price-desc'
      | 'name'
      | 'rating'
      | null;

    const products = await productService.getAll(sortBy || undefined);
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct = await productService.create(body);
    return NextResponse.json(newProduct, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500, headers: corsHeaders },
    );
  }
}
