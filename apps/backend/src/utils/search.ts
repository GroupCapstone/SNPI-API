const REGEX_META_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

/**
 * Builds a literal, bounded MongoDB search expression from untrusted input.
 * Escaping prevents users from injecting expensive regular-expression patterns.
 */
export const createSafeSearchRegex = (value: string, maxLength = 100): RegExp => {
  const normalized = value.trim().slice(0, maxLength);
  return new RegExp(normalized.replace(REGEX_META_CHARACTERS, '\\$&'), 'i');
};

export const createSafeExactRegex = (value: string, maxLength = 100): RegExp => {
  const normalized = value.trim().slice(0, maxLength);
  const escaped = normalized.replace(REGEX_META_CHARACTERS, '\\$&');
  return new RegExp(`^${escaped}$`, 'i');
};
