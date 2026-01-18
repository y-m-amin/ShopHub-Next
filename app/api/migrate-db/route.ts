import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 400 },
      );
    }

    console.log('Starting database migration...');

    // Add missing columns to users table
    try {
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS password TEXT,
        ADD COLUMN IF NOT EXISTS phone TEXT,
        ADD COLUMN IF NOT EXISTS image TEXT,
        ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'credentials',
        ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `;
      console.log('Users table migration completed');
    } catch (error) {
      console.log('Users table migration error (might be expected):', error);
    }

    // Check current table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      message: 'Database migration completed',
      usersTableColumns: tableInfo.rows,
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 400 },
      );
    }

    // Check current table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      message: 'Current users table structure',
      columns: tableInfo.rows,
    });
  } catch (error) {
    console.error('Table check error:', error);
    return NextResponse.json(
      {
        error: 'Table check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
