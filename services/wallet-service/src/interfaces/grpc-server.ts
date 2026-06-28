import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import * as crypto from 'crypto';
import { WalletManager } from '../domain/WalletManager';
import { KmsProvider } from '../infrastructure/KmsProvider';
import { StorageProvider } from '../infrastructure/StorageProvider';
import { JwtUtils } from '../utils/JwtUtils';

const PROTO_PATH = path.resolve(__dirname, '../../proto/wallet.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet as any;

class WalletServiceHandler {
  private walletManager: WalletManager;
  private serverRsaPublicKey: string;
  private serverRsaPrivateKey: string;

  constructor() {
    const kms = new KmsProvider();
    const storage = new StorageProvider();
    this.walletManager = new WalletManager(kms, storage);

    // Generate server RSA key pair for Key Import
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    this.serverRsaPublicKey = publicKey;
    this.serverRsaPrivateKey = privateKey;
  }

  // Middleware simulation for JWT Auth
  private async authenticate(call: grpc.ServerUnaryCall<any, any>): Promise<boolean> {
    const metadata = call.metadata.get('X-Wallet-Auth');
    if (metadata.length === 0) return false;

    const token = metadata[0] as string;
    const walletSecretPublicKey = process.env.WALLET_SECRET_PUBLIC_KEY;
    if (!walletSecretPublicKey) {
      console.warn('WALLET_SECRET_PUBLIC_KEY not set, skipping auth for demo');
      return true;
    }

    return JwtUtils.verifyWalletAuth(
      token,
      walletSecretPublicKey,
      'POST', // Mocked
      'localhost',
      '/wallet.WalletService',
      call.request
    );
  }

  async GenerateKey(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const type = call.request.type === 'ED25519' ? 'ed25519' : 'secp256k1';
      const result = await this.walletManager.generateWallet(type);
      callback(null, result);
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  }

  async SignTransaction(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { address, transactionPayload } = call.request;
      const signature = await this.walletManager.signTransaction(address, Buffer.from(transactionPayload));
      callback(null, { signature });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  }

  async ImportKey(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { encryptedPrivateKey, keyType } = call.request;
      const address = await this.walletManager.importKey(
        Buffer.from(encryptedPrivateKey),
        keyType as any,
        this.serverRsaPrivateKey
      );
      callback(null, { address });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  }

  async ExportKey(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
    try {
      const { address, ephemeralPublicKey } = call.request;
      const encryptedPrivateKey = await this.walletManager.exportKey(address, ephemeralPublicKey);
      callback(null, { encryptedPrivateKey });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  }

  getServerPublicKey() {
    return this.serverRsaPublicKey;
  }
}

function main() {
  const server = new grpc.Server();
  const handler = new WalletServiceHandler();

  server.addService(walletProto.WalletService.service, {
    GenerateKey: handler.GenerateKey.bind(handler),
    SignTransaction: handler.SignTransaction.bind(handler),
    ImportKey: handler.ImportKey.bind(handler),
    ExportKey: handler.ExportKey.bind(handler),
  });

  const port = process.env.PORT || '50051';
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Wallet Service listening on ${boundPort}`);
    server.start();
  });
}

if (require.main === module) {
  main();
}
