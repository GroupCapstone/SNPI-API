import type { IncomingMessage, ServerResponse } from 'node:http';
import type express from 'express';
import { createApp } from '../src/app';
import { connectToDatabase } from '../src/config/database';

let cachedApp: express.Express | null = null;

function getApp(): express.Express {
  if (!cachedApp) {
    cachedApp = createApp();
  }
  return cachedApp;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    await connectToDatabase();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Database connection failed on serverless invocation:', err);
  }

  if (req.url && (req.url.startsWith('/api/index') || req.url === '/api')) {
    const matched =
      (req.headers['x-matched-path'] as string | undefined) ||
      (req.headers['x-forwarded-uri'] as string | undefined);
    if (matched) {
      req.url = matched;
    }
  }

  const app = getApp();

  return new Promise<void>((resolve, reject) => {
    res.on('finish', () => resolve());
    res.on('close', () => resolve());
    res.on('error', (err) => reject(err));
    app(req as unknown as express.Request, res as unknown as express.Response, (err?: unknown) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
