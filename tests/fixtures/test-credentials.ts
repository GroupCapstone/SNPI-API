import { randomBytes } from 'node:crypto';

export const TEST_PASSWORD = `Test-${randomBytes(32).toString('base64url')}!A1`;
