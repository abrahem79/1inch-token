import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../proto/wallet.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet as any;

export class WalletServiceClient {
  private client: any;

  constructor(address: string) {
    this.client = new walletProto.WalletService(
      address,
      grpc.credentials.createInsecure()
    );
  }

  async generateKey(type: string, authToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const metadata = new grpc.Metadata();
      metadata.add('X-Wallet-Auth', authToken);

      this.client.GenerateKey({ type }, metadata, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  async signTransaction(address: string, transactionPayload: Buffer, authToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const metadata = new grpc.Metadata();
      metadata.add('X-Wallet-Auth', authToken);

      this.client.SignTransaction({ address, transactionPayload }, metadata, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  async importKey(encryptedPrivateKey: Buffer, keyType: string, authToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const metadata = new grpc.Metadata();
      metadata.add('X-Wallet-Auth', authToken);

      this.client.ImportKey({ encryptedPrivateKey, keyType }, metadata, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  async exportKey(address: string, ephemeralPublicKey: string, authToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const metadata = new grpc.Metadata();
      metadata.add('X-Wallet-Auth', authToken);

      this.client.ExportKey({ address, ephemeralPublicKey }, metadata, (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }
}
