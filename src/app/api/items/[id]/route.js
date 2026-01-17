import {
  deleteItem,
  getItemById,
  updateItem,
} from '@/lib/database-operations.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/items/[id] - Get a specific item by ID
 * Public endpoint - no authentication required
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Item ID is required',
        },
        { status: 400 },
      );
    }

    const item = await getItemById(id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
          message: `Item with ID ${id} does not exist`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch item',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/items/[id] - Update a specific item
 * Protected endpoint - requires authentication
 */
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token');

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to update items',
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Item ID is required',
        },
        { status: 400 },
      );
    }

    // Check if item exists
    const existingItem = await getItemById(id);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
          message: `Item with ID ${id} does not exist`,
        },
        { status: 404 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate update data
    const updateData = {};

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid input',
            message: 'Name must be a non-empty string',
          },
          { status: 400 },
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== 'string' ||
        body.description.trim().length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid input',
            message: 'Description must be a non-empty string',
          },
          { status: 400 },
        );
      }
      updateData.description = body.description.trim();
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid input',
            message: 'Price must be a non-negative number',
          },
          { status: 400 },
        );
      }
      updateData.price = body.price;
    }

    if (body.image !== undefined) {
      updateData.image = body.image;
    }

    if (body.category !== undefined) {
      updateData.category = body.category;
    }

    if (body.inStock !== undefined) {
      updateData.inStock = body.inStock;
    }

    // Update the item
    const updatedItem = await updateItem(id, updateData);

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Item updated successfully',
    });
  } catch (error) {
    console.error('Error updating item:', error);

    // Handle validation errors
    if (
      error.message.includes('Invalid item data') ||
      error.message.includes('Item not found')
    ) {
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
        error: 'Failed to update item',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/items/[id] - Delete a specific item
 * Protected endpoint - requires authentication
 */
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token');

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to delete items',
        },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Item ID is required',
        },
        { status: 400 },
      );
    }

    // Check if item exists
    const existingItem = await getItemById(id);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
          message: `Item with ID ${id} does not exist`,
        },
        { status: 404 },
      );
    }

    // Delete the item
    await deleteItem(id);

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);

    if (error.message.includes('Item not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
          message: error.message,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete item',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
