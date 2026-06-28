import { SignJWT, importPKCS8 } from 'jose';
import * as crypto from 'crypto';

export class AuthUtils {
  static sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(AuthUtils.sortObjectKeys);
    }
    const sorted: Record<string, any> = {};
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = AuthUtils.sortObjectKeys(obj[key]);
    }
    return sorted;
  }

  static computeRequestHash(body: any): string {
    if (!body || Object.keys(body).length === 0) return '';
    const sorted = AuthUtils.sortObjectKeys(body);
    const canonical = JSON.stringify(sorted);
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  static async generateWalletAuthToken(
    privateKeyPem: string,
    method: string,
    host: string,
    path: string,
    body?: any
  ): Promise<string> {
    const ecKey = await importPKCS8(privateKeyPem, 'ES256');

    const now = Math.floor(Date.now() / 1000);
    const uri = `${method.toUpperCase()} ${host}${path}`;

    const claims: Record<string, any> = {
      uris: [uri],
    };

    const reqHash = AuthUtils.computeRequestHash(body);
    if (reqHash) {
      claims.reqHash = reqHash;
    }

    return await new SignJWT(claims)
      .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
      .setIssuedAt(now)
      .setNotBefore(now)
      .setJti(crypto.randomBytes(16).toString('hex'))
      .sign(ecKey);
  }
}
