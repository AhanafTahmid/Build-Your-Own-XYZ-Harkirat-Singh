import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { streamId, signature, walletAddress, amount } = await req.json();

    if (!streamId || !signature || !walletAddress || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call WebSocket service to verify payment
    const wsUrl = process.env.NEXT_PUBLIC_WSS_URL?.replace('ws://', 'http://').replace(':8080', ':8081') || 'http://localhost:8081';
    
    const response = await fetch(`${wsUrl}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        streamId,
        signature,
        walletAddress,
        amount,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        payment: data.payment,
        message: 'Payment verified successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
