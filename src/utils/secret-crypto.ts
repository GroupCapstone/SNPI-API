import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';

import { env } from '../config/env';

/**
 * Envelope encryption for per-user secrets that must stay usable after they
 * are stored. A TOTP shared secret cannot be one-way hashed, because the
 * server needs the secret itself to verify codes, so it is protected at rest
 * with AES-256-GCM instead of being stored in plaintext.
 *
 * The encryption key is derived from COOKIE_SECRET with HKDF and a distinct
 * context string, so it is independent of the key material used for cookie
 * signing. Rotating COOKIE_SECRET therefore also rotates the TOTP encryption
 * key: previously encrypted secrets can no longer be decrypted, and affected
 * users must re-enrol two-factor authentication. A dedicated
 * TOTP_ENCRYPTION_KEY environment variable is the upgrade path if the two
 * keys ever need to rotate independently.
 */
const ENCRYPTED_PREFIX = 'v1:';
const KEY_CONTEXT = 'snpi-totp-secret-encryption-v1';
const KEY_SALT = 'snpi-totp-secret-encryption-salt';
const AAD = 'snpi-totp-secret';
const IV_LENGTH_BYTES = 12;
const AUTH_TAG_LENGTH_BYTES = 16;

const getEncryptionKey = (): Buffer =>
  Buffer.from(
    hkdfSync(
      'sha256',
      Buffer.from(env.COOKIE_SECRET, 'utf8'),
      Buffer.from(KEY_SALT, 'utf8'),
      Buffer.from(KEY_CONTEXT, 'utf8'),
      32,
    ),
  );

export const encryptTotpSecret = (plaintext: string): string => {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(AAD, 'utf8'));
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${ENCRYPTED_PREFIX}${Buffer.concat([iv, authTag, ciphertext]).toString('base64url')}`;
};

export const decryptTotpSecret = (stored: string): string => {
  if (!stored) {
    return stored;
  }
  if (!stored.startsWith(ENCRYPTED_PREFIX)) {
    // Secrets enrolled before encryption existed are stored in plaintext;
    // return them unchanged so existing users keep working until they
    // re-enrol.
    return stored;
  }
  const payload = Buffer.from(stored.slice(ENCRYPTED_PREFIX.length), 'base64url');
  const iv = payload.subarray(0, IV_LENGTH_BYTES);
  const authTag = payload.subarray(IV_LENGTH_BYTES, IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES);
  const ciphertext = payload.subarray(IV_LENGTH_BYTES + AUTH_TAG_LENGTH_BYTES);
  const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
  decipher.setAAD(Buffer.from(AAD, 'utf8'));
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
};
