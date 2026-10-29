import type { IncomingMessage, ServerResponse } from 'node:http';
import type express from 'express';
import { createApp } from './apps/backend/src/app';
import { connectToDatabase } from './apps/backend/src/config/database';

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

  const app = getApp();

  return new Promise<void>((resolve, reject) => {
    app(req as unknown as express.Request, res as unknown as express.Response, (err?: unknown) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
