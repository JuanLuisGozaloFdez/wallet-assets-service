import { Request, Response } from 'express';
import * as walletService from '../services/walletService';

export const createWallet = (req: Request, res: Response) => {
  try {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ error: 'userId and address are required' });
    }
    const wallet = walletService.createWallet(userId, address);
    res.status(201).json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getWalletHandler = (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const wallet = walletService.getWallet(walletId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserWallets = (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const wallets = walletService.getUserWallets(userId);
    res.json(wallets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBalance = (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const { balance } = req.body;
    if (!balance) return res.status(400).json({ error: 'balance is required' });
    const wallet = walletService.updateWalletBalance(walletId, balance);
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addNFT = (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const { contractAddress, tokenId, name, description, imageUrl } = req.body;
    if (!contractAddress || !tokenId || !name) {
      return res.status(400).json({ error: 'contractAddress, tokenId, and name are required' });
    }
    const nft = walletService.addNFTAsset(walletId, contractAddress, tokenId, name, description, imageUrl);
    res.status(201).json(nft);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getWalletNFTs = (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const nfts = walletService.getWalletNFTs(walletId);
    res.json(nfts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const recordTransaction = (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const { type, amount, to, from, hash } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ error: 'type and amount are required' });
    }
    const transaction = walletService.recordTransaction(walletId, type, amount, to, from, hash);
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getWalletTransactions = (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const txs = walletService.getWalletTransactions(walletId);
    res.json(txs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
