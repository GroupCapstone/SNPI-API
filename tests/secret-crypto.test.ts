import { decryptTotpSecret, encryptTotpSecret } from '../src/utils/secret-crypto';

describe('secret-crypto', () => {
  it('round-trips a TOTP secret through encryption', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const encrypted = encryptTotpSecret(secret);
    expect(encrypted).not.toBe(secret);
    expect(encrypted.startsWith('v1:')).toBe(true);
    expect(decryptTotpSecret(encrypted)).toBe(secret);
  });

  it('produces a different ciphertext for the same secret on every call', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    expect(encryptTotpSecret(secret)).not.toBe(encryptTotpSecret(secret));
  });

  it('returns legacy plaintext secrets unchanged', () => {
    const legacySecret = 'JBSWY3DPEHPK3PXP';
    expect(decryptTotpSecret(legacySecret)).toBe(legacySecret);
  });

  it('rejects tampered ciphertext', () => {
    const encrypted = encryptTotpSecret('JBSWY3DPEHPK3PXP');
    const tampered = `${encrypted.slice(0, -1)}${encrypted.endsWith('A') ? 'B' : 'A'}`;
    expect(() => decryptTotpSecret(tampered)).toThrow();
  });
});
