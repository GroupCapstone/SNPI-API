import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface ISequence extends Document {
  key: string;
  prefix: string;
  currentSequence: number;
  padding: number;
  createdAt: Date;
  updatedAt: Date;
}

const sequenceSchema = new Schema<ISequence>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    currentSequence: {
      type: Number,
      required: true,
      default: 0,
    },
    padding: {
      type: Number,
      required: true,
      default: 6,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SequenceModel = mongoose.model<ISequence>('Sequence', sequenceSchema);
