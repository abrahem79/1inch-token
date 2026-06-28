import * as crypto from 'crypto';

export class KmsProvider {
  private static readonly KEK_ALGORITHM = 'aes-256-gcm';
  private readonly kek: Buffer;

  constructor() {
    // In a real TEE, this would be backed by Cloud KMS HSM
    // For mock, we generate a random KEK on start or use a fixed one if provided
    this.kek = crypto.scryptSync('mock-kms-master-key', 'salt', 32);
  }

  async encrypt(plaintext: Buffer, aad: string): Promise<{ ciphertext: Buffer; iv: Buffer; tag: Buffer }> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(KmsProvider.KEK_ALGORITHM, this.kek, iv);
    cipher.setAAD(Buffer.from(aad));

    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();

    return { ciphertext, iv, tag };
  }

  async decrypt(ciphertext: Buffer, iv: Buffer, tag: Buffer, aad: string): Promise<Buffer> {
    const decipher = crypto.createDecipheriv(KmsProvider.KEK_ALGORITHM, this.kek, iv);
    decipher.setAAD(Buffer.from(aad));
    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }

  // Mock RSA Asymmetric Decrypt for Key Import
  async asymmetricDecrypt(encryptedData: Buffer, privateKeyPem: string): Promise<Buffer> {
    return crypto.privateDecrypt(
      {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      encryptedData
    );
  }

  // Mock RSA Asymmetric Encrypt for Key Export
  async asymmetricEncrypt(data: Buffer, publicKeyPem: string): Promise<Buffer> {
    return crypto.publicEncrypt(
      {
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      data
    );
  }
}
