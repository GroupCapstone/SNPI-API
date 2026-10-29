import type { IncomingMessage, ServerResponse } from 'node:http';
import type express from 'express';
import { createApp } from '../src/app';
import { connectToDatabase } from '../src/config/database';

const app = createApp();
let isDbConnected = false;

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!isDbConnected) {
    try {
      await connectToDatabase();
      isDbConnected = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Database connection failed on serverless invocation:', err);
    }
  }

  return new Promise<void>((resolve, reject) => {
    app(req as unknown as express.Request, res as unknown as express.Response, (err?: unknown) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
