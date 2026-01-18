import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/postgres-database';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, image } = await request.json();

    // Validation
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

    // Check if database is configured
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        {
          message:
            'Database not configured. Please set up PostgreSQL database first.',
          setupUrl: '/setup',
        },
        { status: 503 },
      );
    }

    // Check if user already exists
    const existingUser = await userService.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await userService.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || undefined,
      image: image || undefined,
      provider: 'credentials',
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);

    // More detailed error logging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      timestamp: new Date().toISOString(),
    };

    console.error('Detailed registration error:', errorDetails);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Database not configured')) {
        return NextResponse.json(
          {
            message:
              'Database not configured. Please set up PostgreSQL database first.',
            setupUrl: '/setup',
            debug: errorDetails,
          },
          { status: 503 },
        );
      }

      if (
        error.message.includes('duplicate key') ||
        error.message.includes('unique constraint')
      ) {
        return NextResponse.json(
          { message: 'User with this email already exists' },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Internal server error',
        debug:
          process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 },
    );
  }
}
