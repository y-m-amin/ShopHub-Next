import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '../../../lib/postgres-database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, action } = await request.json();

    if (action === 'toggle') {
      const result = await wishlistService.toggle(userId, productId);
      return NextResponse.json(result, { headers: corsHeaders });
    } else if (action === 'add') {
      const result = await wishlistService.add(userId, productId);
      return NextResponse.json(result, { headers: corsHeaders });
    } else if (action === 'remove') {
      const result = await wishlistService.remove(userId, productId);
      return NextResponse.json({ success: result }, { headers: corsHeaders });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400, headers: corsHeaders },
    );
  } catch (error) {
    console.error('Error managing wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to manage wishlist' },
      { status: 500, headers: corsHeaders },
    );
  }
}
