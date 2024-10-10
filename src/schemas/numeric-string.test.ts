import { describe, expect, it } from 'vitest';

import { numericString } from './numeric-string.js';

describe('numericString', () => {
  it('should validate a numeric string', () => {
    const result = numericString.safeParse('123');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(123);
    }
  });

  it('should throw an error for a non-numeric string', () => {
    const result = numericString.safeParse('abc');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe('Invalid input');
    }
  });

  it('should throw an error for an empty string', () => {
    const result = numericString.safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'String must contain at least 1 character(s)',
      );
    }
  });

  it('should throw an error for a non-string value', () => {
    const result = numericString.safeParse(123);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'Expected string, received number',
      );
    }
  });
});
