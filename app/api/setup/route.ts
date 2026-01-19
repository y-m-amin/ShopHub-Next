import { NextResponse } from 'next/server';
import { initializeTables, seedDatabase } from '../../../lib/postgres-database';

export async function POST(request: Request) {
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

    // Parse request body to check for force parameter
    let force = false;
    try {
      const body = await request.json();
      force = body.force === true;
    } catch {
      // If no body or invalid JSON, use default force = false
    }

    // Initialize tables
    await initializeTables();

    // Seed with initial data (with force option)
    await seedDatabase(force);

    return NextResponse.json({
      message: force 
        ? 'Database force re-seeded successfully' 
        : 'Database setup completed successfully',
      status: 'success',
      force,
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
