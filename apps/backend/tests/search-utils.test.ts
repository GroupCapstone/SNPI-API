import { describe, expect, it } from 'vitest';

import { createSafeExactRegex, createSafeSearchRegex } from '../src/utils/search';

describe('safe search expressions', () => {
  it('treats user-provided regex syntax as literal text', () => {
    const expression = createSafeSearchRegex('(a+)+$');

    expect(expression.test('prefix (a+)+$ suffix')).toBe(true);
    expect(expression.test('aaaaaaaaaaaaaaaa')).toBe(false);
  });

  it('supports escaped, case-insensitive exact matching', () => {
    const expression = createSafeExactRegex(' Dara.SNP ');

    expect(expression.test('dara.snp')).toBe(true);
    expect(expression.test('prefix dara.snp')).toBe(false);
  });

  it('bounds excessively long input', () => {
    const expression = createSafeSearchRegex('x'.repeat(1_000));

    expect(expression.source.length).toBe(100);
  });
});
