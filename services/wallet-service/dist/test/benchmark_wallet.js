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
const ethers_1 = require("ethers");
const crypto = __importStar(require("crypto"));
async function benchmark() {
    const iterations = 100;
    console.log(`Benchmarking ${iterations} wallet generations...`);
    // Benchmark ethers.Wallet.createRandom()
    const startEthers = Date.now();
    for (let i = 0; i < iterations; i++) {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        const privateKey = Buffer.from(wallet.privateKey.substring(2), 'hex');
        const address = wallet.address;
    }
    const endEthers = Date.now();
    console.log(`ethers.Wallet.createRandom(): ${endEthers - startEthers}ms (avg: ${(endEthers - startEthers) / iterations}ms)`);
    // Benchmark direct instantiation
    const startDirect = Date.now();
    for (let i = 0; i < iterations; i++) {
        const privKey = crypto.randomBytes(32);
        const wallet = new ethers_1.ethers.Wallet(privKey.toString('hex'));
        const privateKey = Buffer.from(wallet.privateKey.substring(2), 'hex');
        const address = wallet.address;
    }
    const endDirect = Date.now();
    console.log(`Direct instantiation from random bytes: ${endDirect - startDirect}ms (avg: ${(endDirect - startDirect) / iterations}ms)`);
    const speedup = (endEthers - startEthers) / (endDirect - startDirect);
    console.log(`Speedup: ${speedup.toFixed(2)}x`);
}
benchmark().catch(console.error);
//# sourceMappingURL=benchmark_wallet.js.map