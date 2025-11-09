import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { merchants } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featuredParam = searchParams.get('featured');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Build query conditions
    const conditions = [];

    // Filter by category (exact match)
    if (category) {
      conditions.push(eq(merchants.category, category));
    }

    // Filter by featured status
    if (featuredParam !== null) {
      const featured = featuredParam === 'true' || featuredParam === '1';
      conditions.push(eq(merchants.featured, featured));
    }

    // Search in name field
    if (search) {
      conditions.push(like(merchants.name, `%${search}%`));
    }

    // Execute query with conditions
    let query = db.select().from(merchants);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(merchants.totalTransactions))
      .limit(limit);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}