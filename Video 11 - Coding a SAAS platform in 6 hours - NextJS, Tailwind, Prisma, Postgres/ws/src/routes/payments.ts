import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { SolanaPaymentService } from '../services/SolanaPaymentService';

const router = express.Router();
const prisma = new PrismaClient();
const paymentService = new SolanaPaymentService(prisma);

// POST /payments/verify - Verify and process a payment
router.post('/payments/verify', async (req: Request, res: Response) => {
  try {
    const { userId, streamId, signature, walletAddress, amount } = req.body;

    if (!userId || !streamId || !signature || !walletAddress || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: userId, streamId, signature, walletAddress, amount',
      });
    }

    const result = await paymentService.processPayment(
      userId,
      streamId,
      signature,
      walletAddress,
      parseFloat(amount)
    );

    if (result.success) {
      res.json({
        success: true,
        payment: result.payment,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// GET /payments/status/:signature - Get payment status
router.get('/payments/status/:signature', async (req: Request, res: Response) => {
  try {
    const { signature } = req.params;

    const payment = await paymentService.getPaymentStatus(signature);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// GET /payments/stream/:streamId - Check if stream has valid payment
router.get('/payments/stream/:streamId', async (req: Request, res: Response) => {
  try {
    const { streamId } = req.params;

    const hasPayment = await paymentService.hasValidPayment(streamId);
    const amount = await paymentService.getStreamPaymentAmount(streamId);

    res.json({
      hasPaid: hasPayment,
      amount,
    });
  } catch (error) {
    console.error('Error checking stream payment:', error);
    res.status(500).json({ error: 'Failed to check payment' });
  }
});

// GET /payments/config - Get payment configuration
router.get('/payments/config', async (req: Request, res: Response) => {
  try {
    res.json({
      recipientPublicKey: process.env.SOLANA_RECIPIENT_PUBLIC_KEY || '',
      minPaymentSol: parseFloat(process.env.MIN_PAYMENT_SOL || '0.01'),
      network: process.env.SOLANA_NETWORK || 'devnet',
    });
  } catch (error) {
    console.error('Error getting payment config:', error);
    res.status(500).json({ error: 'Failed to get payment config' });
  }
});

export default router;
