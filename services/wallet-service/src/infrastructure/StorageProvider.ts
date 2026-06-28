export interface EncryptedWalletData {
  address: string;
  keyType: 'secp256k1' | 'ed25519';
  encryptedPrivateKey: {
    ciphertext: string; // hex
    iv: string; // hex
    tag: string; // hex
  };
  encryptedDek: {
    ciphertext: string; // hex
    iv: string; // hex
    tag: string; // hex
  };
}

export class StorageProvider {
  private db: Map<string, EncryptedWalletData> = new Map();

  async saveWallet(data: EncryptedWalletData): Promise<void> {
    this.db.set(data.address.toLowerCase(), data);
  }

  async getWallet(address: string): Promise<EncryptedWalletData | undefined> {
    return this.db.get(address.toLowerCase());
  }

  async listWallets(): Promise<string[]> {
    return Array.from(this.db.keys());
  }
}
