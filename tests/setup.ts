import { randomBytes } from 'node:crypto';

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.MONGODB_URI =
  'mongodb://127.0.0.1:27017/snp_sms_test?replicaSet=rs0&directConnection=true';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.TELEGRAM_BOT_TOKEN = '';
process.env.TWILIO_ACCOUNT_SID = '';
process.env.TWILIO_AUTH_TOKEN = '';
process.env.TWILIO_FROM_NUMBER = '';
process.env.JWT_ACCESS_SECRET = randomBytes(48).toString('base64url');
process.env.JWT_REFRESH_SECRET = randomBytes(48).toString('base64url');
process.env.COOKIE_SECRET = randomBytes(48).toString('base64url');
process.env.CLIENT_API_KEY = randomBytes(32).toString('base64url');
process.env.SUPER_ADMIN_USERNAME = 'test-admin';
process.env.SUPER_ADMIN_EMAIL = 'test-admin@example.invalid';
process.env.SUPER_ADMIN_PASSWORD = randomBytes(32).toString('base64url');
