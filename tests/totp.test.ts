import { describe, expect, it } from 'vitest';

import {
  base32Decode,
  base32Encode,
  generateBackupCodes,
  generateTotpCode,
  generateTotpQrDataUrl,
  generateTotpSecret,
  generateTotpUri,
  verifyBackupCode,
  verifyTotpCode,
} from '../src/utils/totp';

describe('RFC 6238 TOTP Utility Suite', () => {
  it('should round-trip encode and decode Base32 buffers', () => {
    const raw = Buffer.from('SNPI-SMS-Security-2026', 'utf-8');
    const encoded = base32Encode(raw);
    const decoded = base32Decode(encoded);
    expect(decoded.toString('utf-8')).toBe('SNPI-SMS-Security-2026');
  });

  it('should generate a valid 32-character Base32 TOTP secret', () => {
    const secret = generateTotpSecret(20);
    expect(secret).toHaveLength(32);
    expect(secret).toMatch(/^[A-Z2-7]+$/);
  });

  it('should generate standard otpauth:// URI', () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const uri = generateTotpUri(secret, 'admin@snp.edu.kh', 'SNPI-SMS');
    expect(uri).toContain('otpauth://totp/SNPI-SMS:admin%40snp.edu.kh');
    expect(uri).toContain('secret=JBSWY3DPEHPK3PXP');
    expect(uri).toContain('issuer=SNPI-SMS');
  });

  it('should generate a valid QR code base64 data URL', async () => {
    const uri = 'otpauth://totp/SNPI-SMS:test?secret=JBSWY3DPEHPK3PXP';
    const dataUrl = await generateTotpQrDataUrl(uri);
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('should correctly generate and verify a 6-digit TOTP code', () => {
    const secret = generateTotpSecret();
    const now = Date.now();
    const code = generateTotpCode(secret, now);

    expect(code).toHaveLength(6);
    expect(code).toMatch(/^\d{6}$/);

    const isValid = verifyTotpCode(code, secret, { timeMs: now });
    expect(isValid).toBe(true);
  });

  it('should verify codes within +/- 1 step window (clock drift tolerance)', () => {
    const secret = generateTotpSecret();
    const now = Date.now();

    // Code generated 25 seconds in the past (within 30s step)
    const pastCode = generateTotpCode(secret, now - 25000);
    expect(verifyTotpCode(pastCode, secret, { timeMs: now, window: 1 })).toBe(true);

    // Code generated 25 seconds in the future
    const futureCode = generateTotpCode(secret, now + 25000);
    expect(verifyTotpCode(futureCode, secret, { timeMs: now, window: 1 })).toBe(true);

    // Code generated 90 seconds in the past (outside 30s * 1 window)
    const oldCode = generateTotpCode(secret, now - 90000);
    expect(verifyTotpCode(oldCode, secret, { timeMs: now, window: 1 })).toBe(false);
  });

  it('should reject invalid codes', () => {
    const secret = generateTotpSecret();
    expect(verifyTotpCode('000000', secret)).toBe(false);
    expect(verifyTotpCode('abc', secret)).toBe(false);
    expect(verifyTotpCode('', secret)).toBe(false);
  });

  describe('Backup Recovery Codes', () => {
    it('should generate 8 formatted single-use backup recovery codes', () => {
      const { plainCodes, hashedCodes } = generateBackupCodes(8);
      expect(plainCodes).toHaveLength(8);
      expect(hashedCodes).toHaveLength(8);

      for (const code of plainCodes) {
        expect(code).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/);
      }
    });

    it('should verify a valid backup code and identify its index', () => {
      const { plainCodes, hashedCodes } = generateBackupCodes(4);
      const codeToTest = plainCodes[2]!;

      const matchedIndex = verifyBackupCode(codeToTest, hashedCodes);
      expect(matchedIndex).toBe(2);

      // Verify normalization (without hyphen or lowercase)
      const unhyphenated = codeToTest.replace('-', '').toLowerCase();
      expect(verifyBackupCode(unhyphenated, hashedCodes)).toBe(2);
    });

    it('should reject already used backup codes', () => {
      const { plainCodes, hashedCodes } = generateBackupCodes(2);
      const codeToTest = plainCodes[0]!;

      // Mark first code as used
      hashedCodes[0]!.usedAt = new Date();

      const matchedIndex = verifyBackupCode(codeToTest, hashedCodes);
      expect(matchedIndex).toBe(-1);
    });

    it('should reject invalid backup codes', () => {
      const { hashedCodes } = generateBackupCodes(2);
      expect(verifyBackupCode('INVALID-CODE', hashedCodes)).toBe(-1);
      expect(verifyBackupCode('', hashedCodes)).toBe(-1);
    });
  });
});
