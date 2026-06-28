import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { z } from 'zod';
import { validateRequest, rateLimiter, auditLogger } from './middleware';
import { WalletServiceClient } from '../infrastructure/WalletServiceClient';
import { AuthUtils } from '../utils/AuthUtils';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(auditLogger);

const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'localhost:50051';
const WALLET_SECRET_PRIVATE_KEY = process.env.WALLET_SECRET_PRIVATE_KEY || 'MC4CAQAwBQYDK2VwBCIEIL+z9v...'; // Placeholder

const walletClient = new WalletServiceClient(WALLET_SERVICE_URL);

// Schemas
const CreateWalletSchema = z.object({
  body: z.object({
    type: z.enum(['SECP256K1', 'ED25519']),
  }),
});

const SignTransactionSchema = z.object({
  params: z.object({
    address: z.string(),
  }),
  body: z.object({
    payload: z.string(), // base64
  }),
});

// Routes
app.post('/v1/wallets', rateLimiter(10, 60000), validateRequest(CreateWalletSchema), async (req: express.Request, res: express.Response) => {
  try {
    const { type } = req.body;
    const token = await AuthUtils.generateWalletAuthToken(
      WALLET_SECRET_PRIVATE_KEY,
      'POST',
      'localhost',
      '/wallet.WalletService',
      req.body
    );
    const result = await walletClient.generateKey(type, token);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/v1/wallets/:address/sign', rateLimiter(100, 60000), validateRequest(SignTransactionSchema), async (req: express.Request, res: express.Response) => {
  try {
    const { address } = req.params as { address: string };
    const { payload } = req.body;
    const token = await AuthUtils.generateWalletAuthToken(
      WALLET_SECRET_PRIVATE_KEY,
      'POST',
      'localhost',
      '/wallet.WalletService',
      req.body
    );
    const result = await walletClient.signTransaction(address, Buffer.from(payload, 'base64'), token);
    res.json({ signature: Buffer.from(result.signature).toString('base64') });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Service listening on port ${port}`);
});
