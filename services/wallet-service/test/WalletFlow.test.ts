import { WalletManager } from '../src/domain/WalletManager';
import { KmsProvider } from '../src/infrastructure/KmsProvider';
import { StorageProvider } from '../src/infrastructure/StorageProvider';
import * as crypto from 'crypto';
import { ethers } from 'ethers';

async function testWalletFlow() {
  console.log('--- Starting Wallet Flow Test ---');
  const kms = new KmsProvider();
  const storage = new StorageProvider();
  const walletManager = new WalletManager(kms, storage);

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
  const decryptedPk = crypto.privateDecrypt(
    {
      key: clientPrivKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedPk
  );
  console.log('Exported PK matches original:', decryptedPk.length === 32);

  // 4. Import Key
  console.log('4. Importing Key...');
  const { publicKey: serverPubKey, privateKey: serverPrivKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  const newPk = crypto.randomBytes(32);
  const encryptedNewPk = crypto.publicEncrypt(
    {
      key: serverPubKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    newPk
  );
  const importedAddress = await walletManager.importKey(encryptedNewPk, 'secp256k1', serverPrivKey);
  console.log('Imported Wallet Address:', importedAddress);

  const expectedAddress = new ethers.Wallet(newPk.toString('hex')).address;
  console.log('Import matches expected address:', importedAddress === expectedAddress);

  console.log('--- Wallet Flow Test Complete ---');
}

testWalletFlow().catch(console.error);
