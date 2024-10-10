import { describe, expect, test } from 'vitest';

import { dateStringSchema } from './date_string.js';

describe('dateStringSchema', () => {
  test('valid ISO date', () => {
    const result = dateStringSchema.parse('2023-10-10');
    expect(result).toBe('2023-10-10');
  });

  test('valid Ukrainian date', () => {
    const result = dateStringSchema.parse('10.10.2023');
    expect(result).toBe('2023-10-10');
  });

  test('valid American date', () => {
    const result = dateStringSchema.parse('10/10/2023');
    expect(result).toBe('2023-10-10');
  });

  test('invalid date format', () => {
    expect(() => dateStringSchema.parse('10-10-2023')).toThrow(
      'Invalid date format',
    );
  });

  test('empty date string', () => {
    expect(() => dateStringSchema.parse('')).toThrow('Invalid date format');
  });

  test('partial ISO date', () => {
    const result = dateStringSchema.parse('2023-10');
    expect(result).toBe('2023-10');
  });

  test('partial Ukrainian date', () => {
    const result = dateStringSchema.parse('10.2023');
    expect(result).toBe('2023-10');
  });

  test('partial American date', () => {
    const result = dateStringSchema.parse('10/2023');
    expect(result).toBe('2023-10');
  });
});
