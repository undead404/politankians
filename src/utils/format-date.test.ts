import { describe, expect, it } from 'vitest';

import formatDate from './format-date.js';

describe('formatDate', () => {
  it('should format date from YYYY-MM-DD to DD.MM.YYYY', () => {
    expect(formatDate('2024-09-14')).toBe('14.09.2024');
  });

  it('should handle incomplete date strings', () => {
    expect(formatDate('2024-09')).toBe('09.2024');
    expect(formatDate('2024')).toBe('2024');
  });

  it('should throw an error for invalid date strings', () => {
    expect(() => formatDate('invalid-date')).toThrow(
      'Not a date: invalid-date',
    );
  });

  it('should throw an error for empty input', () => {
    expect(() => formatDate('')).toThrow('Not a date: ');
  });
});
