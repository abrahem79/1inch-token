import { JwtUtils } from '../src/utils/JwtUtils';
import { SignJWT, importPKCS8 } from 'jose';
import * as crypto from 'crypto';

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
  const reqHash = JwtUtils.computeRequestHash(body);

  const ecKey = await importPKCS8(privateKey, 'ES256');
  const token = await new SignJWT({ uris: [uri], reqHash })
    .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
    .setIssuedAt(now)
    .setNotBefore(now)
    .setJti(crypto.randomBytes(16).toString('hex'))
    .sign(ecKey);

  console.log('Generated Token');

  // 3. Verify Token
  const isValid = await JwtUtils.verifyWalletAuth(token, publicKey, method, host, path, body);
  console.log('JWT Verification result:', isValid);

  // 4. Test Invalid Hash
  const isInvalidHash = await JwtUtils.verifyWalletAuth(token, publicKey, method, host, path, { type: 'ED25519' });
  console.log('JWT Verification with wrong body (should be false):', isInvalidHash);

  console.log('--- JWT Auth Test Complete ---');
}

testJwtAuth().catch(console.error);
