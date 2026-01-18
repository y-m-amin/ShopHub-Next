import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../lib/postgres-database';

export async function POST(request: NextRequest) {
  try {
    const { email, name, image } = await request.json();

    console.log('Testing Google user creation:', {
      email,
      name,
      hasImage: !!image,
    });

    // Test creating a Google OAuth user
    const user = await userService.create({
      email,
      name,
      image: image || null,
      provider: 'google',
      // No password for Google users
    });

    console.log('Google user created successfully:', user);

    return NextResponse.json({
      success: true,
      message: 'Google user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Google user creation test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test Google user creation',
    example: {
      email: 'test@gmail.com',
      name: 'Test User',
      image: 'https://example.com/avatar.jpg',
    },
  });
}
