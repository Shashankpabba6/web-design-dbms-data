import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, wallets } from '@/db/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';

const VALID_TYPES = ['P2P', 'PAYMENT', 'TOPUP', 'BILL', 'WITHDRAW'];
const VALID_STATUSES = ['SUCCESS', 'FAILED', 'REFUNDED', 'INITIATED'];
const VALID_CHANNELS = ['UPI', 'WALLET', 'BANK'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let query = db.select().from(transactions);

    const conditions = [];

    if (userId) {
      conditions.push(
        or(
          eq(transactions.fromUserId, userId),
          eq(transactions.toUserId, userId)
        )
      );
    }

    if (type) {
      conditions.push(eq(transactions.type, type));
    }

    if (status) {
      conditions.push(eq(transactions.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(transactions.createdAt))
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      fromUserId,
      toUserId,
      toMerchantId,
      recipientName,
      amount,
      status,
      channel,
      description,
    } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    if (!recipientName) {
      return NextResponse.json(
        { error: 'Recipient name is required', code: 'MISSING_RECIPIENT_NAME' },
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Amount is required', code: 'MISSING_AMOUNT' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel is required', code: 'MISSING_CHANNEL' },
        { status: 400 }
      );
    }

    // Validate type
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
          code: 'INVALID_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate channel
    if (!VALID_CHANNELS.includes(channel)) {
      return NextResponse.json(
        {
          error: `Invalid channel. Must be one of: ${VALID_CHANNELS.join(', ')}`,
          code: 'INVALID_CHANNEL',
        },
        { status: 400 }
      );
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Amount must be a valid number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    // Auto-generate fields
    const txnRef = 'UPI' + Date.now();
    const createdAt = new Date().toISOString();

    // Create transaction
    const newTransaction = await db
      .insert(transactions)
      .values({
        txnRef,
        type,
        fromUserId: fromUserId || null,
        toUserId: toUserId || null,
        toMerchantId: toMerchantId || null,
        recipientName,
        amount,
        status,
        channel,
        description: description || null,
        createdAt,
      })
      .returning();

    // Update wallet balances only if status is SUCCESS
    if (status === 'SUCCESS') {
      const updatedAt = new Date().toISOString();

      // Deduct from sender wallet if fromUserId is provided
      if (fromUserId) {
        await db
          .update(wallets)
          .set({
            balance: sql`${wallets.balance} - ${amount}`,
            updatedAt,
          })
          .where(eq(wallets.userId, fromUserId));
      }

      // Add to receiver wallet if toUserId is provided
      if (toUserId) {
        await db
          .update(wallets)
          .set({
            balance: sql`${wallets.balance} + ${amount}`,
            updatedAt,
          })
          .where(eq(wallets.userId, toUserId));
      }
    }

    return NextResponse.json(newTransaction[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}