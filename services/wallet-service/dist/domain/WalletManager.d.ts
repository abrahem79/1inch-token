import { KmsProvider } from '../infrastructure/KmsProvider';
import { StorageProvider } from '../infrastructure/StorageProvider';
export declare class WalletManager {
    private kms;
    private storage;
    constructor(kms: KmsProvider, storage: StorageProvider);
    generateWallet(type: 'secp256k1' | 'ed25519'): Promise<{
        address: string;
        publicKey: string;
    }>;
    signTransaction(address: string, payload: Buffer): Promise<Buffer>;
    importKey(encryptedPrivateKey: Buffer, type: 'secp256k1' | 'ed25519', rsaPrivateKeyPem: string): Promise<string>;
    exportKey(address: string, ephemeralPublicKeyPem: string): Promise<Buffer>;
    private saveEnvelopedWallet;
    private decryptEnvelopedPrivateKey;
}
