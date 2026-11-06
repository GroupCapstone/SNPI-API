import crypto from 'node:crypto';
import QRCode from 'qrcode';
import { decryptTotpSecret } from './secret-crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encodes a buffer to an RFC 4648 Base32 string (unpadded).
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]!;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodes an RFC 4648 Base32 string to a Buffer.
 */
export function base32Decode(input: string): Buffer {
  const cleaned = input.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]!);
    if (idx === -1) {
      continue;
    }

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generates a cryptographically secure 20-byte random Base32 TOTP secret.
 */
export function generateTotpSecret(bytes = 20): string {
  const randomBytes = crypto.randomBytes(bytes);
  return base32Encode(randomBytes);
}

/**
 * Generates an RFC 6238 TOTP URI for QR code generation.
 */
export function generateTotpUri(secret: string, accountName: string, issuer = 'SNPI-SMS'): string {
  const encodedAccount = encodeURIComponent(accountName);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates a base64 PNG data URL from a TOTP URI for QR scanning.
 */
export async function generateTotpQrDataUrl(uri: string): Promise<string> {
  return QRCode.toDataURL(uri, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 256,
  });
}

/**
 * Computes a 6-digit TOTP code for a given timestamp based on RFC 6238.
 */
export function generateTotpCode(secret: string, timeMs = Date.now(), stepSec = 30): string {
  const secretBuffer = base32Decode(secret);
  const counter = Math.floor(timeMs / 1000 / stepSec);

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', secretBuffer).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const binary =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verifies a 6-digit TOTP code allowing for slight clock drift (+/- 1 step = 30s).
 */
export function verifyTotpCode(
  code: string,
  secret: string,
  options: { window?: number; timeMs?: number; stepSec?: number } = {},
): boolean {
  if (!code || code.trim().length !== 6) {
    return false;
  }

  const { window = 1, timeMs = Date.now(), stepSec = 30 } = options;
  const cleanCode = code.trim();

  for (let step = -window; step <= window; step++) {
    const checkTime = timeMs + step * stepSec * 1000;
    const generated = generateTotpCode(decryptTotpSecret(secret), checkTime, stepSec);

    // Constant-time string comparison
    if (
      cleanCode.length === generated.length &&
      crypto.timingSafeEqual(Buffer.from(cleanCode), Buffer.from(generated))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Normalizes a backup recovery code by removing hyphens and converting to uppercase.
 */
export function normalizeBackupCode(code: string): string {
  return code.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Hashes a backup recovery code using SHA-256 for secure database storage.
 */
export function hashBackupCode(code: string): string {
  const normalized = normalizeBackupCode(code);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export interface BackupCodeItem {
  codeHash: string;
  usedAt: Date | null;
}

/**
 * Generates 8 single-use formatted backup recovery codes (e.g. '8F2K-92JA').
 */
export function generateBackupCodes(count = 8): {
  plainCodes: string[];
  hashedCodes: BackupCodeItem[];
} {
  const plainCodes: string[] = [];
  const hashedCodes: BackupCodeItem[] = [];

  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString('hex').toUpperCase();
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    plainCodes.push(formatted);
    hashedCodes.push({
      codeHash: hashBackupCode(formatted),
      usedAt: null,
    });
  }

  return { plainCodes, hashedCodes };
}

/**
 * Verifies if an entered code matches an unused backup recovery code.
 * Returns the index of the matching code in the array, or -1 if invalid or already used.
 */
export function verifyBackupCode(code: string, backupCodes: BackupCodeItem[]): number {
  if (!code || code.trim().length < 8) {
    return -1;
  }

  const inputHash = hashBackupCode(code);
  const inputBuffer = Buffer.from(inputHash, 'hex');

  for (let i = 0; i < backupCodes.length; i++) {
    const item = backupCodes[i]!;
    if (item.usedAt !== null) {
      continue; // Code already used
    }

    const storedBuffer = Buffer.from(item.codeHash, 'hex');
    if (
      inputBuffer.length === storedBuffer.length &&
      crypto.timingSafeEqual(inputBuffer, storedBuffer)
    ) {
      return i;
    }
  }

  return -1;
}
