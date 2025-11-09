import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wallets, transactions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount } = body;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID'
        },
        { status: 400 }
      );
    }

    // Validate amount presence
    if (amount === undefined || amount === null) {
      return NextResponse.json(
        { 
          error: 'Amount is required',
          code: 'MISSING_AMOUNT'
        },
        { status: 400 }
      );
    }

    // Validate amount is a valid number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json(
        { 
          error: 'Amount must be a valid number',
          code: 'INVALID_AMOUNT'
        },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { 
          error: 'Amount must be greater than 0',
          code: 'INVALID_AMOUNT'
        },
        { status: 400 }
      );
    }

    // Check if wallet exists
    const wallet = await db.select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (wallet.length === 0) {
      return NextResponse.json(
        { error: 'Wallet not found for user' },
        { status: 404 }
      );
    }

    // Check sufficient balance
    if (wallet[0].balance < amount) {
      return NextResponse.json(
        { 
          error: 'Insufficient balance',
          code: 'INSUFFICIENT_BALANCE'
        },
        { status: 400 }
      );
    }

    // Generate transaction reference
    const txnRef = 'UPI' + Date.now();

    // Update wallet balance
    const updatedWallet = await db.update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${amount}`,
        updatedAt: new Date().toISOString()
      })
      .where(eq(wallets.userId, userId))
      .returning();

    // Create transaction record
    await db.insert(transactions)
      .values({
        txnRef,
        type: 'WITHDRAW',
        fromUserId: userId,
        toUserId: null,
        toMerchantId: null,
        recipientName: 'Bank Withdrawal',
        amount: -amount,
        status: 'SUCCESS',
        channel: 'BANK',
        description: 'Withdrawn money from wallet',
        createdAt: new Date().toISOString()
      });

    return NextResponse.json(updatedWallet[0], { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}