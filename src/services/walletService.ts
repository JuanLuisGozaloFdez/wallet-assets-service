const { v4: uuidv4 } = require('uuid');
import { Wallet, NFTAsset, Transaction } from '../models/types';

const wallets: Wallet[] = [];
const nftAssets: NFTAsset[] = [];
const transactions: Transaction[] = [];

export const createWallet = (userId: string, address: string) => {
  const wallet: Wallet = {
    id: uuidv4(),
    userId,
    address,
    balance: '0',
    createdAt: new Date().toISOString()
  };
  wallets.push(wallet);
  return wallet;
};

export const getWallet = (walletId: string) => {
  return wallets.find((w) => w.id === walletId);
};

export const getUserWallets = (userId: string) => {
  return wallets.filter((w) => w.userId === userId);
};

export const updateWalletBalance = (walletId: string, balance: string) => {
  const wallet = wallets.find((w) => w.id === walletId);
  if (!wallet) throw new Error('Wallet not found');
  wallet.balance = balance;
  return wallet;
};

export const addNFTAsset = (
  walletId: string,
  contractAddress: string,
  tokenId: string,
  name: string,
  description?: string,
  imageUrl?: string
) => {
  const nft: NFTAsset = {
    id: uuidv4(),
    walletId,
    contractAddress,
    tokenId,
    name,
    description,
    imageUrl,
    createdAt: new Date().toISOString()
  };
  nftAssets.push(nft);
  return nft;
};

export const removeNFTAsset = (nftId: string) => {
  const index = nftAssets.findIndex((n) => n.id === nftId);
  if (index === -1) return false;
  nftAssets.splice(index, 1);
  return true;
};

export const getWalletNFTs = (walletId: string) => {
  return nftAssets.filter((n) => n.walletId === walletId);
};

export const recordTransaction = (
  walletId: string,
  type: 'send' | 'receive' | 'mint' | 'burn',
  amount: string,
  to?: string,
  from?: string,
  hash?: string
) => {
  const transaction: Transaction = {
    id: uuidv4(),
    walletId,
    type,
    amount,
    to,
    from,
    hash,
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  transactions.push(transaction);
  return transaction;
};

export const getWalletTransactions = (walletId: string) => {
  return transactions.filter((t) => t.walletId === walletId);
};

export const getAllWallets = () => wallets;
export const getAllNFTs = () => nftAssets;
export const getAllTransactions = () => transactions;
