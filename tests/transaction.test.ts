import mongoose from 'mongoose';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { runInTransaction } from '../src/utils/transaction';

describe('critical workflow transaction wrapper', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
  });

  it('does not execute a workflow if a session cannot be started', async () => {
    process.env.NODE_ENV = 'production';
    vi.spyOn(mongoose, 'startSession').mockRejectedValue(new Error('Session unavailable'));
    const operation = vi.fn();

    await expect(runInTransaction(operation)).rejects.toThrow('Session unavailable');
    expect(operation).not.toHaveBeenCalled();
  });

  it.each(['production', 'development'])(
    'does not retry outside a transaction on standalone MongoDB in %s',
    async (environment) => {
      process.env.NODE_ENV = environment;
      const failure = new Error(
        'Transaction numbers are only allowed on a replica set member or mongos',
      );
      const endSession = vi.fn().mockResolvedValue(undefined);
      const session = {
        withTransaction: vi
          .fn()
          .mockImplementation(async (callback: () => Promise<void>) => callback()),
        endSession,
      };
      vi.spyOn(mongoose, 'startSession').mockResolvedValue(session as never);
      const operation = vi.fn().mockRejectedValue(failure);

      await expect(runInTransaction(operation)).rejects.toThrow(failure.message);
      expect(operation).toHaveBeenCalledOnce();
      expect(operation).toHaveBeenCalledWith(session);
      expect(endSession).toHaveBeenCalledOnce();
    },
  );

  it('returns the result only after the transaction completes', async () => {
    process.env.NODE_ENV = 'production';
    const endSession = vi.fn().mockResolvedValue(undefined);
    const session = {
      withTransaction: vi
        .fn()
        .mockImplementation(async (callback: () => Promise<void>) => callback()),
      endSession,
    };
    vi.spyOn(mongoose, 'startSession').mockResolvedValue(session as never);
    const operation = vi.fn().mockResolvedValue({ receipt: 'PAY-000001' });

    await expect(runInTransaction(operation)).resolves.toEqual({ receipt: 'PAY-000001' });
    expect(operation).toHaveBeenCalledWith(session);
    expect(endSession).toHaveBeenCalledOnce();
  });

  it('propagates workflow failures and always closes the session', async () => {
    process.env.NODE_ENV = 'production';
    const endSession = vi.fn().mockResolvedValue(undefined);
    const withTransaction = vi.fn().mockImplementation(async (callback: () => Promise<void>) => {
      await callback();
    });
    vi.spyOn(mongoose, 'startSession').mockResolvedValue({
      withTransaction,
      endSession,
    } as never);

    await expect(
      runInTransaction(async () => {
        throw new Error('simulated destination enrollment failure');
      }),
    ).rejects.toThrow('simulated destination enrollment failure');
    expect(withTransaction).toHaveBeenCalledOnce();
    expect(endSession).toHaveBeenCalledOnce();
  });

  it('accepts workflows that commit without a return value', async () => {
    process.env.NODE_ENV = 'production';
    const endSession = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(mongoose, 'startSession').mockResolvedValue({
      withTransaction: vi.fn(async (callback: () => Promise<void>) => callback()),
      endSession,
    } as never);
    const operation = vi.fn().mockResolvedValue(undefined);

    await expect(runInTransaction(operation)).resolves.toBeUndefined();
    expect(operation).toHaveBeenCalledOnce();
    expect(endSession).toHaveBeenCalledOnce();
  });
});
