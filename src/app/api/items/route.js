import { createItem, getAllItems } from '@/lib/database-operations.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/items - Get all items
 * Public endpoint - no authentication required
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit'))
      : undefined;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset'))
      : undefined;
    const category = searchParams.get('category') || undefined;
    const inStock = searchParams.get('inStock')
      ? searchParams.get('inStock') === 'true'
      : undefined;

    const options = {
      limit,
      offset,
      category,
      inStock,
    };

    const result = await getAllItems(options);

    return NextResponse.json({
      success: true,
      items: result.items,
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch items',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/items - Create a new item
 * Protected endpoint - requires authentication
 */
export async function POST(request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token');

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to create items',
        },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || typeof body.price !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          message: 'Name, description, and price are required fields',
        },
        { status: 400 },
      );
    }

    // Validate price
    if (body.price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          message: 'Price must be a non-negative number',
        },
        { status: 400 },
      );
    }

    // Create the item
    const itemData = {
      name: body.name.trim(),
      description: body.description.trim(),
      price: body.price,
      image: body.image || null,
      category: body.category || null,
      inStock: body.inStock !== undefined ? body.inStock : true,
      createdBy: sessionToken.value, // Use session token as user identifier for now
    };

    const newItem = await createItem(itemData);

    return NextResponse.json(
      {
        success: true,
        item: newItem,
        message: 'Item created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating item:', error);

    // Handle validation errors
    if (error.message.includes('Invalid item data')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create item',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
