'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Zap, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface PayToPlayProps {
  streamId: string;
  spaceId: string;
  onPaymentSuccess: () => void;
}

export function PayToPlay({ streamId, spaceId, onPaymentSuccess }: PayToPlayProps) {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [amount, setAmount] = useState('0.01');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'sending' | 'verifying' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setProcessing(true);
      setPaymentStatus('sending');

      // Fetch payment config from backend
      const configResponse = await fetch(`${process.env.NEXT_PUBLIC_WSS_URL?.replace('ws://', 'http://').replace(':8080', ':8081')}/payments/config`);
      const config = await configResponse.json();

      const recipientPublicKey = new PublicKey(config.recipientPublicKey);
      const paymentAmount = parseFloat(amount);

      if (paymentAmount < config.minPaymentSol) {
        toast.error(`Minimum payment is ${config.minPaymentSol} SOL`);
        setProcessing(false);
        setPaymentStatus('idle');
        return;
      }

      // Create connection
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: paymentAmount * LAMPORTS_PER_SOL,
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction signature:', signature);

      toast.info('Transaction sent! Waiting for confirmation...');

      // Wait for confirmation
      setPaymentStatus('verifying');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Verify payment on backend
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId,
          signature,
          walletAddress: publicKey.toString(),
          amount: paymentAmount,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        setPaymentStatus('success');
        toast.success('Payment verified! Your song will play next!');
        setTimeout(() => {
          onPaymentSuccess();
          setPaymentStatus('idle');
        }, 2000);
      } else {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error(error instanceof Error ? error.message : 'Payment failed');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'sending':
      case 'verifying':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'sending':
        return 'Sending transaction...';
      case 'verifying':
        return 'Verifying payment...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return 'Payment failed';
      default:
        return 'Pay to Play First';
    }
  };

  return (
    <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Priority Play
        </CardTitle>
        <CardDescription>
          Pay with SOL to skip the queue and play your song immediately!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Solana wallet to enable priority play
            </p>
            <WalletMultiButton />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (SOL)</label>
              <Input
                type="number"
                step="0.001"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                disabled={processing}
              />
              <p className="text-xs text-muted-foreground">
                Higher amounts get higher priority. Minimum: 0.01 SOL
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{amount} SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee:</span>
                <span className="font-medium">~0.000005 SOL</span>
              </div>
              <div className="border-t pt-1 mt-1 flex justify-between">
                <span className="text-sm font-semibold">Total:</span>
                <span className="font-semibold">{(parseFloat(amount) + 0.000005).toFixed(6)} SOL</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={processing || !amount || parseFloat(amount) < 0.01}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {getStatusIcon()}
              <span className="ml-2">{getStatusText()}</span>
            </Button>

            <div className="flex items-center gap-2 justify-center">
              <WalletMultiButton />
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>🔒 Secure payment via Solana blockchain</p>
          <p>⚡ Instant verification and priority placement</p>
          <p>💰 Funds go directly to the platform wallet</p>
        </div>
      </CardContent>
    </Card>
  );
}
