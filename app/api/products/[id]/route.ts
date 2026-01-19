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

    // console.log('PUT /api/products/[id] - Update request:', {
    //   productId: id,
    //   requestSellerId: body.sellerId,
    //   requestSellerIdType: typeof body.sellerId
    // });

    // Check if product exists and user owns it
    const existingProduct = await productService.getById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    // console.log('Existing product sellerId:', {
    //   existingSellerId: existingProduct.sellerId,
    //   existingSellerIdType: typeof existingProduct.sellerId,
    //   providedSellerId: body.sellerId,
    //   providedSellerIdType: typeof body.sellerId,
    //   match: existingProduct.sellerId === body.sellerId,
    //   isExistingNull: existingProduct.sellerId === null,
    //   isExistingUndefined: existingProduct.sellerId === undefined,
    //   isExistingEmpty: existingProduct.sellerId === ''
    // });

    if (existingProduct.sellerId !== body.sellerId) {
      // console.log('Authorization failed:', {
      //   existing: existingProduct.sellerId,
      //   provided: body.sellerId,
      //   comparison: `"${existingProduct.sellerId}" !== "${body.sellerId}"`,
      //   reason: existingProduct.sellerId === null ? 'Product has null sellerId - needs force fix' : 'sellerId mismatch'
      // });
      return NextResponse.json(
        { 
          error: 'Unauthorized to update this product',
          debug: {
            productSellerId: existingProduct.sellerId,
            userSellerId: body.sellerId,
            reason: existingProduct.sellerId === null ? 'Product has null sellerId - use /test-debug to force fix' : 'sellerId mismatch'
          }
        },
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

    // console.log('DELETE /api/products/[id] - Delete request:', {
    //   productId: id,
    //   headerSellerId: sellerId,
    //   headerSellerIdType: typeof sellerId,
    //   allHeaders: Object.fromEntries(request.headers.entries())
    // });

    // Check if product exists and user owns it
    const existingProduct = await productService.getById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: corsHeaders },
      );
    }

    // console.log('DELETE - Existing product sellerId:', {
    //   existingSellerId: existingProduct.sellerId,
    //   existingSellerIdType: typeof existingProduct.sellerId,
    //   headerSellerId: sellerId,
    //   headerSellerIdType: typeof sellerId,
    //   match: existingProduct.sellerId === sellerId,
    //   isExistingNull: existingProduct.sellerId === null,
    //   isExistingUndefined: existingProduct.sellerId === undefined,
    //   isExistingEmpty: existingProduct.sellerId === ''
    // });

    if (existingProduct.sellerId !== sellerId) {
      // console.log('DELETE Authorization failed:', {
      //   existing: existingProduct.sellerId,
      //   provided: sellerId,
      //   comparison: `"${existingProduct.sellerId}" !== "${sellerId}"`,
      //   reason: existingProduct.sellerId === null ? 'Product has null sellerId - needs force fix' : 'sellerId mismatch'
      // });
      return NextResponse.json(
        { 
          error: 'Unauthorized to delete this product',
          debug: {
            productSellerId: existingProduct.sellerId,
            userSellerId: sellerId,
            reason: existingProduct.sellerId === null ? 'Product has null sellerId - use /test-debug to force fix' : 'sellerId mismatch'
          }
        },
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
