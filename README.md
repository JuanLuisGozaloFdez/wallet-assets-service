# Wallet Assets Service

Microservice for managing user wallets, NFT assets, and transaction history in the NFT ticketing marketplace.

## Features

- **Wallet Management**: Create and manage user wallets with Ethereum addresses
- **NFT Asset Tracking**: Track NFT ownership, metadata, and provenance
- **Transaction History**: Record and retrieve all wallet transactions (send, receive, mint, burn)
- **Balance Management**: Update and query wallet balances

## Tech Stack

- **Node.js** 20 LTS
- **TypeScript** 5.2 (strict mode)
- **Express** 4.18
- **Ethers.js** 6.9 (blockchain utilities)
- **Jest** 29.6 (testing)
- **Supertest** 7.1 (HTTP testing)

## Setup

```bash
npm install
npm run dev   # Start development server
npm test      # Run test suite (15 tests passing)
npm run build # Compile TypeScript
```

## API Endpoints

### Wallet CRUD
- `POST /wallets` - Create a new wallet
- `GET /wallets/:walletId` - Retrieve a wallet by ID
- `GET /wallets/user/:userId` - Get all wallets for a user
- `PUT /wallets/:walletId/balance` - Update wallet balance

### NFT Management
- `POST /wallets/:walletId/nfts` - Add NFT asset to wallet
- `GET /wallets/:walletId/nfts` - List all NFTs in a wallet

### Transaction Tracking
- `POST /wallets/:walletId/transactions` - Record a transaction
- `GET /wallets/:walletId/transactions` - Retrieve transaction history

### Health Check
- `GET /health` - Service health status

## Example Requests

### Create Wallet
```bash
curl -X POST http://localhost:3005/wallets \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "address": "0x1234567890abcdef1234567890abcdef12345678"
  }'
```

### Add NFT Asset
```bash
curl -X POST http://localhost:3005/wallets/{walletId}/nfts \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "tokenId": "1",
    "name": "NFT Ticket #1",
    "description": "Event ticket",
    "imageUrl": "https://example.com/ticket.png"
  }'
```

### Record Transaction
```bash
curl -X POST http://localhost:3005/wallets/{walletId}/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "send",
    "amount": "10",
    "to": "0xrecipient",
    "from": "0x1234567890abcdef1234567890abcdef12345678",
    "hash": "0xtxhash"
  }'
```

## Data Models

### Wallet
```typescript
interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: string;
}
```

### NFTAsset
```typescript
interface NFTAsset {
  id: string;
  walletId: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  walletId: string;
  type: 'send' | 'receive' | 'mint' | 'burn';
  amount: string;
  to?: string;
  from?: string;
  hash?: string;
  timestamp: number;
}
```

## Testing

The service includes **15 comprehensive tests** covering:

✅ Wallet creation and retrieval
✅ User wallet queries
✅ Balance updates
✅ NFT asset management (add, retrieve)
✅ Transaction recording and history
✅ Error handling and validation
✅ Health check endpoint

Run tests with:
```bash
npm test
```

## Port

Service runs on **port 3005** by default.

## Environment Variables

None required for local development. Configure the following in production:
- `PORT` - Service port (default: 3005)
- `NODE_ENV` - Environment (development/production)

## Integration

This service integrates with:
- **Users Identity Service** (port 3002) - For user validation
- **Payments Orders Service** (port 3003) - For NFT minting on purchases
- **API Gateway BFF** (port 3000) - For external access

## Future Enhancements

- Integration with actual blockchain (Web3.js/Ethers)
- PostgreSQL database for persistent storage
- Real wallet address validation
- Gas fee estimation
- Blockchain event listeners
- Wallet security features (multi-sig, hardware wallet support)

## License

MIT
