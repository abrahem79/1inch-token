import * as crypto from 'crypto';

export class CryptoUtils {
  static readonly DEK_ALGORITHM = 'aes-256-gcm';

  static generateRandomBytes(length: number): Buffer {
    return crypto.randomBytes(length);
  }

  static async encryptWithDek(plaintext: Buffer, dek: Buffer): Promise<{ ciphertext: Buffer; iv: Buffer; tag: Buffer }> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.DEK_ALGORITHM, dek, iv);

    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();

    return { ciphertext, iv, tag };
  }

  static async decryptWithDek(ciphertext: Buffer, dek: Buffer, iv: Buffer, tag: Buffer): Promise<Buffer> {
    const decipher = crypto.createDecipheriv(this.DEK_ALGORITHM, dek, iv);
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }
}
