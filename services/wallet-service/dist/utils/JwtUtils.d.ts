export declare class JwtUtils {
    static sortObjectKeys(obj: any): any;
    static computeRequestHash(body: any): string;
    static verifyWalletAuth(token: string, publicKeyPem: string, method: string, host: string, path: string, body?: any): Promise<boolean>;
}
