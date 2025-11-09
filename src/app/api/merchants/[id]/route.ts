import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { merchants } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid merchant ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    // Query merchant by merchantId
    const merchant = await db.select()
      .from(merchants)
      .where(eq(merchants.merchantId, parseInt(id)))
      .limit(1);

    // Check if merchant exists
    if (merchant.length === 0) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Return merchant object
    return NextResponse.json(merchant[0], { status: 200 });

  } catch (error) {
    console.error('GET merchant error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}