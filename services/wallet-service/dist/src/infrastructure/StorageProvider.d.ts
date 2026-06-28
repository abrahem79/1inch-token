export interface EncryptedWalletData {
    address: string;
    keyType: 'secp256k1' | 'ed25519';
    encryptedPrivateKey: {
        ciphertext: string;
        iv: string;
        tag: string;
    };
    encryptedDek: {
        ciphertext: string;
        iv: string;
        tag: string;
    };
}
export declare class StorageProvider {
    private db;
    saveWallet(data: EncryptedWalletData): Promise<void>;
    getWallet(address: string): Promise<EncryptedWalletData | undefined>;
    listWallets(): Promise<string[]>;
}
