import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, image } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 },
      );
    }

    // For now, just simulate successful registration
    // TODO: Add actual database integration once debugging is complete

    return NextResponse.json(
      {
        message:
          'Registration received successfully. Database integration pending.',
        user: {
          id: `temp_${Date.now()}`,
          name,
          email,
          phone: phone || null,
          image: image || null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Simple registration error:', error);
    return NextResponse.json(
      {
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
