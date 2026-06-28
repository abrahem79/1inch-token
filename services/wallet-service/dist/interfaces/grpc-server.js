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
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const WalletManager_1 = require("../domain/WalletManager");
const KmsProvider_1 = require("../infrastructure/KmsProvider");
const StorageProvider_1 = require("../infrastructure/StorageProvider");
const JwtUtils_1 = require("../utils/JwtUtils");
const PROTO_PATH = path.resolve(__dirname, '../../proto/wallet.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet;
class WalletServiceHandler {
    walletManager;
    serverRsaPublicKey;
    serverRsaPrivateKey;
    constructor() {
        const kms = new KmsProvider_1.KmsProvider();
        const storage = new StorageProvider_1.StorageProvider();
        this.walletManager = new WalletManager_1.WalletManager(kms, storage);
        // Generate server RSA key pair for Key Import
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        this.serverRsaPublicKey = publicKey;
        this.serverRsaPrivateKey = privateKey;
    }
    // Middleware simulation for JWT Auth
    async authenticate(call) {
        const metadata = call.metadata.get('X-Wallet-Auth');
        if (metadata.length === 0)
            return false;
        const token = metadata[0];
        const walletSecretPublicKey = process.env.WALLET_SECRET_PUBLIC_KEY;
        if (!walletSecretPublicKey) {
            console.warn('WALLET_SECRET_PUBLIC_KEY not set, skipping auth for demo');
            return true;
        }
        return JwtUtils_1.JwtUtils.verifyWalletAuth(token, walletSecretPublicKey, 'POST', // Mocked
        'localhost', '/wallet.WalletService', call.request);
    }
    async GenerateKey(call, callback) {
        try {
            const type = call.request.type === 'ED25519' ? 'ed25519' : 'secp256k1';
            const result = await this.walletManager.generateWallet(type);
            callback(null, result);
        }
        catch (err) {
            callback({ code: grpc.status.INTERNAL, message: err.message });
        }
    }
    async SignTransaction(call, callback) {
        try {
            const { address, transactionPayload } = call.request;
            const signature = await this.walletManager.signTransaction(address, Buffer.from(transactionPayload));
            callback(null, { signature });
        }
        catch (err) {
            callback({ code: grpc.status.INTERNAL, message: err.message });
        }
    }
    async ImportKey(call, callback) {
        try {
            const { encryptedPrivateKey, keyType } = call.request;
            const address = await this.walletManager.importKey(Buffer.from(encryptedPrivateKey), keyType, this.serverRsaPrivateKey);
            callback(null, { address });
        }
        catch (err) {
            callback({ code: grpc.status.INTERNAL, message: err.message });
        }
    }
    async ExportKey(call, callback) {
        try {
            const { address, ephemeralPublicKey } = call.request;
            const encryptedPrivateKey = await this.walletManager.exportKey(address, ephemeralPublicKey);
            callback(null, { encryptedPrivateKey });
        }
        catch (err) {
            callback({ code: grpc.status.INTERNAL, message: err.message });
        }
    }
    getServerPublicKey() {
        return this.serverRsaPublicKey;
    }
}
function main() {
    const server = new grpc.Server();
    const handler = new WalletServiceHandler();
    server.addService(walletProto.WalletService.service, {
        GenerateKey: handler.GenerateKey.bind(handler),
        SignTransaction: handler.SignTransaction.bind(handler),
        ImportKey: handler.ImportKey.bind(handler),
        ExportKey: handler.ExportKey.bind(handler),
    });
    const port = process.env.PORT || '50051';
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Wallet Service listening on ${boundPort}`);
        server.start();
    });
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=grpc-server.js.map