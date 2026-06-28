export declare class CryptoUtils {
    static readonly DEK_ALGORITHM = "aes-256-gcm";
    static generateRandomBytes(length: number): Buffer;
    static encryptWithDek(plaintext: Buffer, dek: Buffer): Promise<{
        ciphertext: Buffer;
        iv: Buffer;
        tag: Buffer;
    }>;
    static decryptWithDek(ciphertext: Buffer, dek: Buffer, iv: Buffer, tag: Buffer): Promise<Buffer>;
}
