import type { ClientSession } from 'mongoose';

import { SequenceModel } from './sequence.model';

export class SequenceService {
  /**
   * Generates the next sequential ID atomically using MongoDB findOneAndUpdate.
   * Format example: EMP-000001, STU-000001
   */
  public static async getNextSequence(
    key: string,
    prefix: string = key,
    padding: number = 6,
    session?: ClientSession,
  ): Promise<string> {
    const sequenceDoc = await SequenceModel.findOneAndUpdate(
      { key },
      {
        $inc: { currentSequence: 1 },
        $setOnInsert: { prefix, padding },
      },
      {
        new: true,
        upsert: true,
        ...(session ? { session } : {}),
      },
    ).exec();

    const seqNum = sequenceDoc.currentSequence;
    const paddedNumber = String(seqNum).padStart(padding, '0');
    return `${prefix}-${paddedNumber}`;
  }
}
