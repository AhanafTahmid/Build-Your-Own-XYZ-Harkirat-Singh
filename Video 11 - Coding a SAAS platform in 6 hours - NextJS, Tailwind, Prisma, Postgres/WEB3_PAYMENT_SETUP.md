# Web3 Priority Payment System - Setup Guide

## Overview
This feature allows users to pay with Solana (SOL) to skip the queue and play their song immediately. The payment system includes:
- Wallet integration (Phantom, Solflare, etc.)
- Blockchain payment verification
- Priority queue based on payment amount
- Real-time payment status tracking

## Prerequisites

1. **Solana Wallet** (for testing):
   - Install Phantom Wallet: https://phantom.app/
   - Or Solflare: https://solflare.com/

2. **Devnet SOL** (free test tokens):
   - Go to: https://faucet.solana.com/
   - Enter your wallet address
   - Get free devnet SOL for testing

3. **Platform Wallet**:
   - Create a new wallet to receive payments
   - Copy the public key to use as `SOLANA_RECIPIENT_PUBLIC_KEY`

## Configuration

### 1. Environment Variables

#### `next-app/.env`
```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta for production
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_RECIPIENT_PUBLIC_KEY=<YOUR_PLATFORM_WALLET_PUBLIC_KEY>
```

#### `ws/.env`
```env
# Solana Payment Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
SOLANA_RECIPIENT_PUBLIC_KEY=<YOUR_PLATFORM_WALLET_PUBLIC_KEY>
MIN_PAYMENT_SOL=0.01

# YouTube API
YOUTUBE_API_KEY=<YOUR_YOUTUBE_API_KEY>

# Server Configuration
HTTP_PORT=8081
WS_PORT=8080
```

### 2. Database Migration

Run the migration to add payment tables:

```bash
cd ws
pnpm exec prisma migrate dev --name add_web3_payments
pnpm exec prisma generate
```

### 3. Update `ws/src/app.ts`

Add payment routes to your WebSocket server:

```typescript
import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payments';

const app = express();

app.use(cors());
app.use(express.json());

// Add payment routes
app.use(paymentRoutes);

// ... existing WebSocket code ...

// Start HTTP server for API
const HTTP_PORT = process.env.HTTP_PORT || 8081;
app.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on port ${HTTP_PORT}`);
});
```

### 4. Update `next-app/app/layout.tsx`

Wrap your app with the WalletProvider:

```typescript
import { WalletProvider } from '@/components/WalletProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

### 5. Integrate PayToPlay Component

Add to your StreamView or wherever you want the payment option:

```typescript
import { PayToPlay } from '@/components/StreamView/PayToPlay';

export function AddSongForm({ spaceId }: { spaceId: string }) {
  const [streamId, setStreamId] = useState<string | null>(null);

  const handlePaymentSuccess = () => {
    // Refresh queue or show success message
    toast.success('Your song has been prioritized!');
  };

  return (
    <div className="space-y-4">
      {/* Your existing add song form */}
      
      {streamId && (
        <PayToPlay 
          streamId={streamId}
          spaceId={spaceId}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
```

## How It Works

### 1. Payment Flow

```
User adds song → Gets streamId → Clicks "Pay to Play First" 
→ Connects wallet → Enters amount → Sends SOL 
→ Transaction confirmed → Backend verifies → Queue reordered → Song plays next
```

### 2. Queue Priority Logic

Update your StreamManager to sort by payment amount:

```typescript
// In ws/src/StreamManager.ts

async getQueue(spaceId: string) {
  const streams = await prismaClient.stream.findMany({
    where: { spaceId, played: false },
    orderBy: [
      { priorityAmount: 'desc' },  // Paid songs first
      { upvotes: { _count: 'desc' } },  // Then by upvotes
      { createAt: 'asc' }  // Then by time added
    ],
    include: {
      user: true,
      upvotes: true,
      payment: true,  // Include payment info
    },
  });

  return streams;
}
```

### 3. Interrupt Current Song (Optional)

To interrupt the currently playing song when a high-priority payment comes in:

```typescript
async handlePriorityPayment(streamId: string, amount: number, spaceId: string) {
  // Get current playing song
  const currentStream = await prismaClient.currentStream.findUnique({
    where: { spaceId },
    include: { stream: { include: { payment: true } } },
  });

  // If new payment is higher, interrupt current song
  if (currentStream?.stream) {
    const currentAmount = currentStream.stream.priorityAmount || 0;
    
    if (amount > currentAmount) {
      // Mark current as unplayed so it goes back to queue
      await prismaClient.stream.update({
        where: { id: currentStream.stream.id },
        data: { played: false },
      });

      // Set new high-priority song as current
      await prismaClient.currentStream.update({
        where: { spaceId },
        data: { streamId },
      });

      // Broadcast to all clients to switch songs
      this.broadcast(spaceId, {
        type: 'PRIORITY_INTERRUPT',
        streamId,
        message: 'A high-priority song is now playing',
      });
    }
  }
}
```

## Testing

### 1. Local Testing with Devnet

```bash
# Terminal 1 - Start WS server
cd ws
pnpm dev

# Terminal 2 - Start Next.js
cd next-app
pnpm dev
```

### 2. Test Payment Flow

1. Open http://localhost:3000
2. Add a song to get a `streamId`
3. Click "Pay to Play First"
4. Connect your Phantom wallet
5. Enter amount (e.g., 0.01 SOL)
6. Click "Pay to Play First"
7. Approve transaction in wallet
8. Wait for verification
9. Song should move to top of queue

### 3. Verify Payment

Check Redis for payment tracking:
```bash
redis-cli
> KEYS payment:*
> GET payment:<signature>
```

Check database:
```sql
SELECT * FROM "Payment" ORDER BY "createdAt" DESC LIMIT 10;
```

## Production Deployment

### 1. Switch to Mainnet

Update `.env` files:
```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta
```

### 2. Use Premium RPC (Recommended)

Free RPC endpoints have rate limits. Use paid services:
- QuickNode: https://www.quicknode.com/
- Alchemy: https://www.alchemy.com/
- Helius: https://www.helius.dev/

### 3. Security Checklist

- [ ] Secure your recipient wallet private key (never commit to git)
- [ ] Implement rate limiting on payment endpoints
- [ ] Add webhook for failed payments
- [ ] Monitor for duplicate signature attacks
- [ ] Set reasonable MIN_PAYMENT_SOL (e.g., $0.10 equivalent)
- [ ] Add payment expiration (e.g., 24 hours)
- [ ] Implement refund mechanism for failed payments

### 4. Monitor Payments

Create admin dashboard to track:
- Total payments received
- Average payment amount
- Payment success rate
- Failed payment reasons
- Top paying users

## Troubleshooting

### "Transaction not found"
- Wait longer (devnet can be slow)
- Check signature is correct
- Verify RPC endpoint is working

### "Amount mismatch"
- Check network fees aren't included in amount
- Verify recipient public key is correct
- Check MIN_PAYMENT_SOL threshold

### "Payment verification failed"
- Ensure backend can access Solana RPC
- Check database connection
- Verify signature format (base58)

### Wallet not connecting
- Check browser extension is installed
- Try different wallet adapter
- Clear browser cache
- Check network (devnet vs mainnet)

## Cost Analysis

### Devnet (Free)
- Free SOL from faucet
- No real money needed
- Perfect for testing

### Mainnet
- Network fee: ~0.000005 SOL (~$0.0001)
- Platform receives: Full payment amount
- User pays: Amount + network fee

Example:
- User wants to pay 0.1 SOL
- They pay: 0.100005 SOL
- Platform receives: 0.1 SOL
- Solana network: 0.000005 SOL

## Advanced Features

### 1. Dynamic Pricing
Adjust prices based on demand:
```typescript
const calculateMinPayment = (queueLength: number) => {
  const basePrice = 0.01;
  const demandMultiplier = Math.log10(queueLength + 1);
  return basePrice * (1 + demandMultiplier);
};
```

### 2. Payment Tiers
Different priority levels:
- Bronze: 0.01 SOL (skip 10 songs)
- Silver: 0.05 SOL (skip 50 songs)
- Gold: 0.1 SOL (play immediately)

### 3. Refund System
Refund if song doesn't play within X minutes

### 4. Revenue Sharing
Split payments between platform and space host

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Solana Web3.js docs: https://solana-labs.github.io/solana-web3.js/
3. Check wallet adapter docs: https://github.com/solana-labs/wallet-adapter

## License
MIT
