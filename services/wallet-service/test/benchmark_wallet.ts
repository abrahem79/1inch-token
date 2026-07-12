import { ethers } from 'ethers';
import * as crypto from 'crypto';

async function benchmark() {
  const iterations = 100;

  console.log(`Benchmarking ${iterations} wallet generations...`);

  // Benchmark ethers.Wallet.createRandom()
  const startEthers = Date.now();
  for (let i = 0; i < iterations; i++) {
    const wallet = ethers.Wallet.createRandom();
    const privateKey = Buffer.from(wallet.privateKey.substring(2), 'hex');
    const address = wallet.address;
  }
  const endEthers = Date.now();
  console.log(`ethers.Wallet.createRandom(): ${endEthers - startEthers}ms (avg: ${(endEthers - startEthers) / iterations}ms)`);

  // Benchmark direct instantiation
  const startDirect = Date.now();
  for (let i = 0; i < iterations; i++) {
    const privKey = crypto.randomBytes(32);
    const wallet = new ethers.Wallet('0x' + privKey.toString('hex'));
    const privateKey = Buffer.from(wallet.privateKey.substring(2), 'hex');
    const address = wallet.address;
  }
  const endDirect = Date.now();
  console.log(`Direct instantiation from random bytes: ${endDirect - startDirect}ms (avg: ${(endDirect - startDirect) / iterations}ms)`);

  const speedup = (endEthers - startEthers) / (endDirect - startDirect);
  console.log(`Speedup: ${speedup.toFixed(2)}x`);
}

benchmark().catch(console.error);
