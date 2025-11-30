import request from 'supertest';
import app from '../src/app';
import * as walletService from '../src/services/walletService';

describe('Wallet Assets Service', () => {
  const testUserId = 'user-123';
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';

  describe('POST /wallets - Create Wallet', () => {
    test('should create a new wallet', async () => {
      const res = await request(app).post('/wallets').send({
        userId: testUserId,
        address: testAddress,
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.userId).toBe(testUserId);
      expect(res.body.address).toBe(testAddress);
      expect(res.body.balance).toBe('0');
    });

    test('should return 400 if userId or address is missing', async () => {
      const res = await request(app).post('/wallets').send({ userId: testUserId });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /wallets/:walletId - Get Wallet', () => {
    test('should retrieve a wallet by ID', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app).get(`/wallets/${wallet.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(wallet.id);
      expect(res.body.userId).toBe(testUserId);
    });

    test('should return 404 for non-existent wallet', async () => {
      const res = await request(app).get('/wallets/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /wallets/user/:userId - Get User Wallets', () => {
    test('should retrieve all wallets for a user', async () => {
      walletService.createWallet(testUserId, testAddress);
      walletService.createWallet(testUserId, '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');
      const res = await request(app).get(`/wallets/user/${testUserId}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    test('should return empty array for user with no wallets', async () => {
      const res = await request(app).get('/wallets/user/non-existent-user');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('PUT /wallets/:walletId/balance - Update Balance', () => {
    test('should update wallet balance', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app).put(`/wallets/${wallet.id}/balance`).send({ balance: 100 });
      expect(res.status).toBe(200);
      expect(res.body.balance).toBe(100);
    });

    test('should return 400 if balance is missing', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app).put(`/wallets/${wallet.id}/balance`).send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /wallets/:walletId/nfts - Add NFT Asset', () => {
    test('should add an NFT asset to wallet', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app)
        .post(`/wallets/${wallet.id}/nfts`)
        .send({
          contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          tokenId: '1',
          name: 'NFT Ticket #1',
          description: 'Event ticket',
          imageUrl: 'https://example.com/ticket.png',
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('NFT Ticket #1');
    });

    test('should return 400 if required fields are missing', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app)
        .post(`/wallets/${wallet.id}/nfts`)
        .send({ contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /wallets/:walletId/nfts - Get Wallet NFTs', () => {
    test('should retrieve all NFTs in wallet', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      walletService.addNFTAsset(wallet.id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1', 'NFT1', '', '');
      walletService.addNFTAsset(wallet.id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '2', 'NFT2', '', '');
      const res = await request(app).get(`/wallets/${wallet.id}/nfts`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('POST /wallets/:walletId/transactions - Record Transaction', () => {
    test('should record a wallet transaction', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app)
        .post(`/wallets/${wallet.id}/transactions`)
        .send({
          type: 'send',
          amount: '10',
          to: '0xrecipient',
          from: testAddress,
          hash: '0xtxhash',
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.type).toBe('send');
      expect(res.body.amount).toBe('10');
    });

    test('should return 400 if type or amount is missing', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      const res = await request(app).post(`/wallets/${wallet.id}/transactions`).send({ type: 'send' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /wallets/:walletId/transactions - Get Transactions', () => {
    test('should retrieve transaction history', async () => {
      const wallet = walletService.createWallet(testUserId, testAddress);
      walletService.recordTransaction(wallet.id, 'send', '5', 'to', testAddress, 'hash1');
      walletService.recordTransaction(wallet.id, 'receive', '10', '', testAddress, 'hash2');
      const res = await request(app).get(`/wallets/${wallet.id}/transactions`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /health - Health Check', () => {
    test('should return service health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('wallet-assets-service');
    });
  });
});
