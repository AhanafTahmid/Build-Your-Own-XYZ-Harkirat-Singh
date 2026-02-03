import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PrismaClient } from '@prisma/client';
import bs58 from 'bs58';

export interface PaymentVerificationResult {
  isValid: boolean;
  amount: number;
  signature: string;
  error?: string;
}

export class SolanaPaymentService {
  private connection: Connection;
  private prisma: PrismaClient;
  private recipientPublicKey: PublicKey;
  private minPaymentAmount: number;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    
    // Use devnet for development, mainnet-beta for production
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    // Recipient wallet (your platform wallet)
    const recipientKey = process.env.SOLANA_RECIPIENT_PUBLIC_KEY || '';
    if (!recipientKey) {
      throw new Error('SOLANA_RECIPIENT_PUBLIC_KEY not set');
    }
    this.recipientPublicKey = new PublicKey(recipientKey);
    
    // Minimum payment amount in SOL
    this.minPaymentAmount = parseFloat(process.env.MIN_PAYMENT_SOL || '0.01');
  }

  /**
   * Verify a Solana transaction signature
   */
  async verifyPayment(
    signature: string,
    senderPublicKey: string,
    expectedAmount: number
  ): Promise<PaymentVerificationResult> {
    try {
      console.log(`Verifying payment: ${signature}`);

      // Fetch transaction details
      const transaction = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!transaction) {
        return {
          isValid: false,
          amount: 0,
          signature,
          error: 'Transaction not found',
        };
      }

      // Check if transaction was successful
      if (transaction.meta?.err) {
        return {
          isValid: false,
          amount: 0,
          signature,
          error: 'Transaction failed',
        };
      }

      // Get account keys
      const accountKeys = transaction.transaction.message.getAccountKeys();
      const senderPubkey = new PublicKey(senderPublicKey);

      // Find transfer instruction
      let transferAmount = 0;
      const preBalances = transaction.meta?.preBalances || [];
      const postBalances = transaction.meta?.postBalances || [];

      // Check if recipient received SOL
      const recipientIndex = accountKeys.staticAccountKeys.findIndex(
        (key) => key.equals(this.recipientPublicKey)
      );

      if (recipientIndex === -1) {
        return {
          isValid: false,
          amount: 0,
          signature,
          error: 'Recipient not found in transaction',
        };
      }

      // Calculate amount transferred to recipient
      const preBalance = preBalances[recipientIndex] || 0;
      const postBalance = postBalances[recipientIndex] || 0;
      transferAmount = (postBalance - preBalance) / LAMPORTS_PER_SOL;

      console.log(`Transfer amount: ${transferAmount} SOL`);

      // Verify amount
      if (transferAmount < this.minPaymentAmount) {
        return {
          isValid: false,
          amount: transferAmount,
          signature,
          error: `Amount too low. Minimum: ${this.minPaymentAmount} SOL`,
        };
      }

      if (Math.abs(transferAmount - expectedAmount) > 0.001) {
        return {
          isValid: false,
          amount: transferAmount,
          signature,
          error: `Amount mismatch. Expected: ${expectedAmount}, Got: ${transferAmount}`,
        };
      }

      return {
        isValid: true,
        amount: transferAmount,
        signature,
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        isValid: false,
        amount: 0,
        signature,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Record payment in database
   */
  async recordPayment(
    userId: string,
    streamId: string,
    signature: string,
    amount: number,
    walletAddress: string,
    status: 'PENDING' | 'VERIFIED' | 'FAILED' = 'PENDING'
  ) {
    try {
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          streamId,
          signature,
          amount,
          walletAddress,
          status,
          verifiedAt: status === 'VERIFIED' ? new Date() : null,
        },
      });

      // Update stream priority amount
      if (status === 'VERIFIED') {
        await this.prisma.stream.update({
          where: { id: streamId },
          data: { priorityAmount: amount },
        });
      }

      return payment;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  /**
   * Verify and record payment
   */
  async processPayment(
    userId: string,
    streamId: string,
    signature: string,
    walletAddress: string,
    expectedAmount: number
  ) {
    // Check if payment already processed
    const existingPayment = await this.prisma.payment.findUnique({
      where: { signature },
    });

    if (existingPayment) {
      return {
        success: existingPayment.status === 'VERIFIED',
        payment: existingPayment,
        message: 'Payment already processed',
      };
    }

    // Verify payment on blockchain
    const verification = await this.verifyPayment(signature, walletAddress, expectedAmount);

    const status = verification.isValid ? 'VERIFIED' : 'FAILED';
    const payment = await this.recordPayment(
      userId,
      streamId,
      signature,
      verification.amount,
      walletAddress,
      status
    );

    return {
      success: verification.isValid,
      payment,
      message: verification.error || 'Payment processed successfully',
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(signature: string) {
    return await this.prisma.payment.findUnique({
      where: { signature },
      include: {
        stream: {
          select: {
            title: true,
            extractedId: true,
          },
        },
      },
    });
  }

  /**
   * Check if a stream has been paid for
   */
  async hasValidPayment(streamId: string): Promise<boolean> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        streamId,
        status: 'VERIFIED',
      },
    });

    return !!payment;
  }

  /**
   * Get payment amount for a stream
   */
  async getStreamPaymentAmount(streamId: string): Promise<number> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        streamId,
        status: 'VERIFIED',
      },
      select: { amount: true },
    });

    return payment ? parseFloat(payment.amount.toString()) : 0;
  }
}
