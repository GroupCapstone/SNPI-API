import { describe, expect, it } from 'vitest';

import { getChangedFields, redactSensitiveData } from '../src/utils/redact';

describe('audit redaction', () => {
  it('redacts sensitive values at nested levels without mutating safe fields', () => {
    const result = redactSensitiveData({
      username: 'dara',
      profile: { passwordHash: 'hash', apiKey: 'key', branchId: 'branch-1' },
      refreshToken: 'token',
    });

    expect(result).toEqual({
      username: 'dara',
      profile: { passwordHash: '[REDACTED]', apiKey: '[REDACTED]', branchId: 'branch-1' },
      refreshToken: '[REDACTED]',
    });
  });

  it('derives the top-level fields changed by an operation', () => {
    expect(
      getChangedFields({ status: 'active', name: 'A' }, { status: 'inactive', name: 'A' }),
    ).toEqual(['status']);
  });
});
