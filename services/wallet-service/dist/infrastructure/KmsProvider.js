"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KmsProvider = void 0;
const crypto = __importStar(require("crypto"));
class KmsProvider {
    static KEK_ALGORITHM = 'aes-256-gcm';
    kek;
    constructor() {
        // In a real TEE, this would be backed by Cloud KMS HSM
        // For mock, we generate a random KEK on start or use a fixed one if provided
        this.kek = crypto.scryptSync('mock-kms-master-key', 'salt', 32);
    }
    async encrypt(plaintext, aad) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(KmsProvider.KEK_ALGORITHM, this.kek, iv);
        cipher.setAAD(Buffer.from(aad));
        const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        const tag = cipher.getAuthTag();
        return { ciphertext, iv, tag };
    }
    async decrypt(ciphertext, iv, tag, aad) {
        const decipher = crypto.createDecipheriv(KmsProvider.KEK_ALGORITHM, this.kek, iv);
        decipher.setAAD(Buffer.from(aad));
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }
    // Mock RSA Asymmetric Decrypt for Key Import
    async asymmetricDecrypt(encryptedData, privateKeyPem) {
        return crypto.privateDecrypt({
            key: privateKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, encryptedData);
    }
    // Mock RSA Asymmetric Encrypt for Key Export
    async asymmetricEncrypt(data, publicKeyPem) {
        return crypto.publicEncrypt({
            key: publicKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, data);
    }
}
exports.KmsProvider = KmsProvider;
//# sourceMappingURL=KmsProvider.js.map