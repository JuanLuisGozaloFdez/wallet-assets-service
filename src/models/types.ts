export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: string;
  createdAt: string;
}

export interface NFTAsset {
  id: string;
  walletId: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'send' | 'receive' | 'mint' | 'burn';
  amount: string;
  tokenAddress?: string;
  to?: string;
  from?: string;
  hash?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
