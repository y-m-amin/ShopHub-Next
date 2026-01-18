import { NextResponse } from 'next/server';
import { initializeTables, seedDatabase } from '../../../lib/postgres-database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST() {
  try {
    console.log('Initializing database tables...');
    await initializeTables();

    console.log('Seeding database...');
    await seedDatabase();

    return NextResponse.json(
      {
        success: true,
        message: 'Database initialized and seeded successfully',
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
