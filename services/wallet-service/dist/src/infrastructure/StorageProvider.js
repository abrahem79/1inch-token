"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageProvider = void 0;
class StorageProvider {
    db = new Map();
    async saveWallet(data) {
        this.db.set(data.address.toLowerCase(), data);
    }
    async getWallet(address) {
        return this.db.get(address.toLowerCase());
    }
    async listWallets() {
        return Array.from(this.db.keys());
    }
}
exports.StorageProvider = StorageProvider;
//# sourceMappingURL=StorageProvider.js.map