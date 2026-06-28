export declare class AttestationProvider {
    /**
     * Simulates the remote attestation process.
     * In GCP Confidential Space, this would return an OIDC token from the STS
     * containing claims about the SEV-SNP hardware and the container image digest.
     */
    getAttestationToken(): Promise<string>;
    verifyAttestation(token: string): Promise<boolean>;
}
