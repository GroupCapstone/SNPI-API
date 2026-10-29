const SENSITIVE_KEY_PATTERN =
  /(?:password|passcode|credential|secret|token|authorization|cookie|api[-_]?key|private[-_]?key|hash|telegram[-_]?token|sms[-_]?secret|sms[-_]?key|salt|webhook[-_]?secret)/i;

const MAX_REDACTION_DEPTH = 12;

export const redactSensitiveData = (value: unknown, depth = 0): unknown => {
  if (depth > MAX_REDACTION_DEPTH) return '[MAX_DEPTH]';
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item, depth + 1));
  }
  if (typeof value !== 'object') return value;

  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(source).map(([key, nestedValue]) => [
      key,
      SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : redactSensitiveData(nestedValue, depth + 1),
    ]),
  );
};

export const getChangedFields = (
  oldValue?: Record<string, unknown>,
  newValue?: Record<string, unknown>,
): string[] => {
  if (!oldValue || !newValue) return [];
  const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
  return [...keys].filter((key) => {
    try {
      return JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key]);
    } catch {
      return oldValue[key] !== newValue[key];
    }
  });
};
