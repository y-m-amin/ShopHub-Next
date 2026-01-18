import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../lib/postgres-database';

export async function POST(request: NextRequest) {
  try {
    console.log('Test registration started');

    const { name, email, password } = await request.json();
    console.log('Received data:', {
      name,
      email,
      passwordLength: password?.length,
    });

    // Test database connection
    console.log('Testing database connection...');
    const { sql } = await import('@vercel/postgres');
    const testResult = await sql`SELECT 1 as test`;
    console.log('Database test result:', testResult.rows[0]);

    // Test userService.getByEmail
    console.log('Testing userService.getByEmail...');
    try {
      const existingUser = await userService.getByEmail(email);
      console.log(
        'Existing user check result:',
        existingUser ? 'User exists' : 'User does not exist',
      );

      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: 'User already exists',
          step: 'user_check',
        });
      }
    } catch (userCheckError) {
      console.error('User check error:', userCheckError);
      return NextResponse.json(
        {
          success: false,
          message: 'User check failed',
          error:
            userCheckError instanceof Error
              ? userCheckError.message
              : 'Unknown error',
          step: 'user_check',
        },
        { status: 500 },
      );
    }

    // Test password hashing
    console.log('Testing password hashing...');
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(
        'Password hashed successfully, length:',
        hashedPassword.length,
      );
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return NextResponse.json(
        {
          success: false,
          message: 'Password hashing failed',
          error:
            hashError instanceof Error ? hashError.message : 'Unknown error',
          step: 'password_hash',
        },
        { status: 500 },
      );
    }

    // Test user creation
    console.log('Testing user creation...');
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await userService.create({
        name,
        email,
        password: hashedPassword,
        provider: 'credentials',
      });

      console.log('User created successfully:', user.id);

      return NextResponse.json({
        success: true,
        message: 'Test registration successful',
        userId: user.id,
        step: 'complete',
      });
    } catch (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        {
          success: false,
          message: 'User creation failed',
          error:
            createError instanceof Error
              ? createError.message
              : 'Unknown error',
          stack: createError instanceof Error ? createError.stack : undefined,
          step: 'user_create',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Test registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Test registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        step: 'general',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test registration',
    example: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    },
  });
}
