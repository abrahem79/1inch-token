export declare class KmsProvider {
    private static readonly KEK_ALGORITHM;
    private readonly kek;
    constructor();
    encrypt(plaintext: Buffer, aad: string): Promise<{
        ciphertext: Buffer;
        iv: Buffer;
        tag: Buffer;
    }>;
    decrypt(ciphertext: Buffer, iv: Buffer, tag: Buffer, aad: string): Promise<Buffer>;
    asymmetricDecrypt(encryptedData: Buffer, privateKeyPem: string): Promise<Buffer>;
    asymmetricEncrypt(data: Buffer, publicKeyPem: string): Promise<Buffer>;
}
