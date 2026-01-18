import { NextResponse } from 'next/server';
import { healthService } from '../../../lib/postgres-database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const healthData = await healthService.check();
    return NextResponse.json(healthData, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL (Vercel)',
        error: 'Database connection failed',
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
