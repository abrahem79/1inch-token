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
const WalletManager_1 = require("../src/domain/WalletManager");
const KmsProvider_1 = require("../src/infrastructure/KmsProvider");
const StorageProvider_1 = require("../src/infrastructure/StorageProvider");
const crypto = __importStar(require("crypto"));
const ethers_1 = require("ethers");
async function testWalletFlow() {
    console.log('--- Starting Wallet Flow Test ---');
    const kms = new KmsProvider_1.KmsProvider();
    const storage = new StorageProvider_1.StorageProvider();
    const walletManager = new WalletManager_1.WalletManager(kms, storage);
    // 1. Generate SECP256K1 Wallet
    console.log('1. Generating SECP256K1 Wallet...');
    const wallet = await walletManager.generateWallet('secp256k1');
    console.log('Generated Wallet Address:', wallet.address);
    // 2. Sign Transaction
    console.log('2. Signing Transaction...');
    const payload = Buffer.from('test-transaction-payload');
    const signature = await walletManager.signTransaction(wallet.address, payload);
    console.log('Signature length:', signature.length);
    // 3. Export Key
    console.log('3. Exporting Key...');
    const { publicKey: clientPubKey, privateKey: clientPrivKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const encryptedPk = await walletManager.exportKey(wallet.address, clientPubKey);
    const decryptedPk = crypto.privateDecrypt({
        key: clientPrivKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }, encryptedPk);
    console.log('Exported PK matches original:', decryptedPk.length === 32);
    // 4. Import Key
    console.log('4. Importing Key...');
    const { publicKey: serverPubKey, privateKey: serverPrivKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const newPk = crypto.randomBytes(32);
    const encryptedNewPk = crypto.publicEncrypt({
        key: serverPubKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }, newPk);
    const importedAddress = await walletManager.importKey(encryptedNewPk, 'secp256k1', serverPrivKey);
    console.log('Imported Wallet Address:', importedAddress);
    const expectedAddress = new ethers_1.ethers.Wallet(newPk.toString('hex')).address;
    console.log('Import matches expected address:', importedAddress === expectedAddress);
    console.log('--- Wallet Flow Test Complete ---');
}
testWalletFlow().catch(console.error);
//# sourceMappingURL=WalletFlow.test.js.map