import { NextResponse } from 'next/server';
import { initializeTables, seedDatabase } from '../../../lib/postgres-database';

export async function POST() {
  try {
    // Check if POSTGRES_URL is configured
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          message: 'Please set up Postgres integration in Vercel dashboard',
        },
        { status: 400 },
      );
    }

    // Initialize tables
    await initializeTables();

    // Seed with initial data
    await seedDatabase();

    return NextResponse.json({
      message: 'Database setup completed successfully',
      status: 'success',
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        error: 'Database setup failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to initialize database',
    configured: !!process.env.POSTGRES_URL,
  });
}
