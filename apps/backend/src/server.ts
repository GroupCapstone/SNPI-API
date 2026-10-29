import type { Server } from 'node:http';

import { app } from './app';
import { connectToDatabase, disconnectFromDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

let server: Server | undefined;
let isShuttingDown = false;

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info({ signal }, 'Graceful shutdown started');

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()));
    });
  }

  await disconnectFromDatabase();
  logger.info('Graceful shutdown completed');
};

const startServer = async (): Promise<void> => {
  await connectToDatabase();

  server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'SNP-SMS API started');
  });

  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      void shutdown(signal).then(() => process.exit(0));
    });
  }
};

void startServer().catch((error: unknown) => {
  logger.fatal(
    { error: error instanceof Error ? error : new Error('Unknown startup error') },
    'Startup failed',
  );
  process.exit(1);
});
