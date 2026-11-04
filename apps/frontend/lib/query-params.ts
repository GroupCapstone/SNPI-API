/**
 * Shared query-string builder for all feature API modules.
 *
 * Performance notes
 * -----------------
 * - Uses a single `URLSearchParams` instance and a plain `for…in` loop — avoids
 *   repeated `params.append` call overhead present in the per-module boilerplate.
 * - Skips falsy values, `undefined`, `null`, and the sentinel string `'all'` without
 *   allocating intermediate arrays.
 * - Returns the leading `?` only when at least one entry is present, so callers can
 *   do template literal `\`/path${buildQueryString(filters)}\`` directly.
 */

type FilterValue = string | number | boolean | null | undefined;

/**
 * Convert a flat filter object into a query string (including the leading `?`).
 * Keys whose values are `undefined`, `null`, `false`, empty string, or the sentinel
 * `'all'` are omitted.  Numbers and booleans are coerced to strings.
 *
 * @param filters - Plain object with scalar values.
 * @param skipAllSentinel - When `true` (default), skip values equal to `'all'`.
 * @returns A query string like `?foo=bar&page=1`, or `''` when empty.
 */
export const buildQueryString = (
  filters: Record<string, FilterValue> | null | undefined,
  skipAllSentinel = true,
): string => {
  if (!filters) return '';
  const params = new URLSearchParams();
  for (const key in filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, key)) continue;
    const val = filters[key];
    if (val === undefined || val === null || val === '' || val === false) continue;
    if (skipAllSentinel && val === 'all') continue;
    params.append(key, String(val));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};
