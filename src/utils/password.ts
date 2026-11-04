import { scryptSync, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

const COMMON_WEAK_PASSWORDS = new Set([
  'password123',
  'password123!',
  'admin123456',
  'administrator',
  'welcome123',
  'welcome123!',
  'changeme123',
  'changeme123!',
  'letmein123',
  'letmein123!',
  'school1234',
  'school1234!',
  '12345678',
  '123456789',
  'qwerty12345',
]);

export class PasswordUtil {
  public static hash(password: string): string {
    return bcrypt.hashSync(password, BCRYPT_ROUNDS);
  }

  public static isWeakCommonPassword(password: string): boolean {
    const normalized = password.toLowerCase().trim();
    if (COMMON_WEAK_PASSWORDS.has(normalized)) {
      return true;
    }
    if (/^(.)\1{7,}$/i.test(password)) {
      return true;
    }
    return false;
  }

  public static compare(password: string, storedHash: string): boolean {
    if (storedHash.startsWith('$2')) {
      return bcrypt.compareSync(password, storedHash);
    }

    // Backward-compatible verification for accounts created before the bcrypt migration.
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;

    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedKey = scryptSync(password, salt, 64);

    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(keyBuffer, derivedKey);
  }

  public static needsRehash(storedHash: string): boolean {
    return !storedHash.startsWith('$2') || bcrypt.getRounds(storedHash) < BCRYPT_ROUNDS;
  }
}
