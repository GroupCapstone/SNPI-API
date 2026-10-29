import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { logger } from '../config/logger';

export const clearDatabase = async (): Promise<void> => {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not established');
  }

  const collections = await db.listCollections().toArray();
  logger.info(
    `Clearing ${collections.length} collections from MongoDB database: ${db.databaseName}...`,
  );

  for (const collection of collections) {
    if (collection.name.startsWith('system.')) {
      continue;
    }
    try {
      await db.collection(collection.name).deleteMany({});
      logger.info(`Cleared all documents in collection: ${collection.name}`);
    } catch (err) {
      logger.warn({ err }, `Could not clear collection: ${collection.name}`);
    }
  }

  logger.info('Successfully cleared all data in MongoDB database!');
};

if (require.main === module) {
  clearDatabase()
    .then(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    })
    .catch(async (error) => {
      logger.error({ error }, 'Database clear failed');
      await disconnectFromDatabase();
      process.exit(1);
    });
}
