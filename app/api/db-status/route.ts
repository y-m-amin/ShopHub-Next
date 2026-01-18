import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasPostgresUrl = !!process.env.POSTGRES_URL;

    if (!hasPostgresUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'POSTGRES_URL environment variable not set',
        hasPostgresUrl: false,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    }

    // Try to import and test the database connection
    const { sql } = await import('@vercel/postgres');

    // Simple connection test
    const result = await sql`SELECT 1 as test`;

    return NextResponse.json({
      status: 'connected',
      message: 'Database connection successful',
      hasPostgresUrl: true,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      testQuery: result.rows[0],
    });
  } catch (error) {
    console.error('Database status check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Unknown database error',
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
