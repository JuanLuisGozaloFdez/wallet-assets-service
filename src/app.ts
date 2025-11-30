import express, { Express } from 'express';
import cors from 'cors';
import walletRoutes from './routes/wallets';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/wallets', walletRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wallet-assets-service' });
});

export default app;
