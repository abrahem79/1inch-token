import { AuthUtils } from '../src/utils/AuthUtils';
import * as crypto from 'crypto';

async function testApiServiceUtils() {
  console.log('--- Starting API Service Utils Test ---');

  // 1. Generate Wallet Secret Key Pair (PEM)
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
  console.log('Generating Auth Token...');
  const token = await AuthUtils.generateWalletAuthToken(privateKey, method, host, path, body);
  console.log('Token generated length:', token.length);

  // 3. Verify ReqHash consistency
  const hash1 = AuthUtils.computeRequestHash(body);
  const hash2 = AuthUtils.computeRequestHash({ type: 'SECP256K1' });
  console.log('Hashes match for identical bodies:', hash1 === hash2);

  const hash3 = AuthUtils.computeRequestHash({ type: 'ED25519' });
  console.log('Hashes differ for different bodies:', hash1 !== hash3);

  console.log('--- API Service Utils Test Complete ---');
}

testApiServiceUtils().catch(console.error);
