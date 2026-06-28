import { jwtVerify } from 'jose';
import * as crypto from 'crypto';

export class JwtUtils {
  static sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(JwtUtils.sortObjectKeys);
    }
    const sorted: Record<string, any> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = JwtUtils.sortObjectKeys(obj[key]);
    }
    return sorted;
  }

  static computeRequestHash(body: any): string {
    const sorted = JwtUtils.sortObjectKeys(body);
    const canonical = JSON.stringify(sorted);
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  static async verifyWalletAuth(
    token: string,
    publicKeyPem: string,
    method: string,
    host: string,
    path: string,
    body?: any
  ): Promise<boolean> {
    try {
      const ecPublicKey = await crypto.createPublicKey(publicKeyPem);
      // Convert crypto public key to a format jose likes or use crypto.verify directly
      // For simplicity in mock, we'll use a standard verification if possible or just check structure
      const { payload } = await jwtVerify(token, ecPublicKey as any, {
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
    } catch (err) {
      console.error('JWT Verification failed:', err);
      return false;
    }
  }
}
