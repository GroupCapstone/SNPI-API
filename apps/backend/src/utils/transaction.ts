import mongoose from 'mongoose';
import type { ClientSession } from 'mongoose';

/**
 * Runs a critical workflow atomically. Unit tests that do not connect to MongoDB
 * execute the callback without a session; connected runtimes require transaction
 * support and must use a replica set or sharded MongoDB deployment.
 */
export const runInTransaction = async <T>(
  operation: (session: ClientSession | undefined) => Promise<T>,
): Promise<T> => {
  if (process.env.NODE_ENV === 'test' && mongoose.connection.readyState !== 1) {
    return operation(undefined);
  }

  const session = await mongoose.startSession();

  try {
    let outcome: { value: T } | undefined;
    await session.withTransaction(
      async () => {
        outcome = { value: await operation(session) };
      },
      {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      },
    );

    if (!outcome) {
      throw new Error('Transaction completed without executing the workflow');
    }
    return outcome.value;
  } finally {
    await session.endSession();
  }
};
