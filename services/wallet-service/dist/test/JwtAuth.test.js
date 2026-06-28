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
const JwtUtils_1 = require("../src/utils/JwtUtils");
const jose_1 = require("jose");
const crypto = __importStar(require("crypto"));
async function testJwtAuth() {
    console.log('--- Starting JWT Auth Test ---');
    // 1. Generate Wallet Secret Key Pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const method = 'POST';
    const host = 'localhost';
    const path = '/wallet.WalletService';
    const body = { type: 'SECP256K1' };
    // 2. Generate Token
    const now = Math.floor(Date.now() / 1000);
    const uri = `${method} ${host}${path}`;
    const reqHash = JwtUtils_1.JwtUtils.computeRequestHash(body);
    const ecKey = await (0, jose_1.importPKCS8)(privateKey, 'ES256');
    const token = await new jose_1.SignJWT({ uris: [uri], reqHash })
        .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
        .setIssuedAt(now)
        .setNotBefore(now)
        .setJti(crypto.randomBytes(16).toString('hex'))
        .sign(ecKey);
    console.log('Generated Token');
    // 3. Verify Token
    const isValid = await JwtUtils_1.JwtUtils.verifyWalletAuth(token, publicKey, method, host, path, body);
    console.log('JWT Verification result:', isValid);
    // 4. Test Invalid Hash
    const isInvalidHash = await JwtUtils_1.JwtUtils.verifyWalletAuth(token, publicKey, method, host, path, { type: 'ED25519' });
    console.log('JWT Verification with wrong body (should be false):', isInvalidHash);
    console.log('--- JWT Auth Test Complete ---');
}
testJwtAuth().catch(console.error);
//# sourceMappingURL=JwtAuth.test.js.map