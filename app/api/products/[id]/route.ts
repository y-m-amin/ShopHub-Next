import { NextRequest, NextResponse } from 'next/server';
import { productService } from '../../../../lib/postgres-database';

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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await productService.getById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(product, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if product exists and user owns it
    const existingProduct = await productService.getById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    if (existingProduct.sellerId !== body.sellerId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this product' },
        { status: 403, headers: corsHeaders },
      );
    }

    const updatedProduct = await productService.update(id, body);

    if (updatedProduct) {
      return NextResponse.json(updatedProduct, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500, headers: corsHeaders },
      );
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const sellerId = request.headers.get('x-seller-id');

    // Check if product exists and user owns it
    const existingProduct = await productService.getById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    if (existingProduct.sellerId !== sellerId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this product' },
        { status: 403, headers: corsHeaders },
      );
    }

    const success = await productService.delete(id);

    if (success) {
      return NextResponse.json(
        { message: 'Product deleted successfully' },
        { headers: corsHeaders },
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500, headers: corsHeaders },
      );
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500, headers: corsHeaders },
    );
  }
}
