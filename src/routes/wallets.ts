import { Router } from 'express';
import * as walletController from '../controllers/walletController';

const router = Router();

// Wallet CRUD
router.post('/', walletController.createWallet);
router.get('/:walletId', walletController.getWalletHandler);
router.get('/user/:userId', walletController.getUserWallets);
router.put('/:walletId/balance', walletController.updateBalance);

// NFT management
router.post('/:walletId/nfts', walletController.addNFT);
router.get('/:walletId/nfts', walletController.getWalletNFTs);

// Transaction tracking
router.post('/:walletId/transactions', walletController.recordTransaction);
router.get('/:walletId/transactions', walletController.getWalletTransactions);

export default router;
