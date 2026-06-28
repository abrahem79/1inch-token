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
exports.JwtUtils = void 0;
const jose_1 = require("jose");
const crypto = __importStar(require("crypto"));
class JwtUtils {
    static sortObjectKeys(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(JwtUtils.sortObjectKeys);
        }
        const sorted = {};
        for (const key of Object.keys(obj).sort()) {
            sorted[key] = JwtUtils.sortObjectKeys(obj[key]);
        }
        return sorted;
    }
    static computeRequestHash(body) {
        const sorted = JwtUtils.sortObjectKeys(body);
        const canonical = JSON.stringify(sorted);
        return crypto.createHash('sha256').update(canonical).digest('hex');
    }
    static async verifyWalletAuth(token, publicKeyPem, method, host, path, body) {
        try {
            const ecPublicKey = await crypto.createPublicKey(publicKeyPem);
            // Convert crypto public key to a format jose likes or use crypto.verify directly
            // For simplicity in mock, we'll use a standard verification if possible or just check structure
            const { payload } = await (0, jose_1.jwtVerify)(token, ecPublicKey, {
                algorithms: ['ES256'],
            });
            // Verify URIs
            const uri = `${method.toUpperCase()} ${host}${path}`;
            if (!Array.isArray(payload.uris) || !payload.uris.includes(uri)) {
                return false;
            }
            // Verify Request Hash
            if (body && Object.keys(body).length > 0) {
                const expectedHash = JwtUtils.computeRequestHash(body);
                if (payload.reqHash !== expectedHash) {
                    return false;
                }
            }
            return true;
        }
        catch (err) {
            console.error('JWT Verification failed:', err);
            return false;
        }
    }
}
exports.JwtUtils = JwtUtils;
//# sourceMappingURL=JwtUtils.js.map