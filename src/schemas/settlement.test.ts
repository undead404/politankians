import { describe, expect, it } from 'vitest';

import { settlementSchema } from './settlement.js';

describe('settlementSchema', () => {
  const validSettlement = {
    address:
      '23542, Ukraine, Sharhorod municipality, Vinnytsia oblast, Politanky',
    name: 'Політанки',
  };

  it('should validate a correct settlement', () => {
    const result = settlementSchema.safeParse(validSettlement);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validSettlement);
    }
  });

  it('should throw an error if address is missing', () => {
    const invalidSettlement = { ...validSettlement, address: undefined };
    const result = settlementSchema.safeParse(invalidSettlement);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe('Required');
    }
  });

  it('should throw an error if name is an empty string', () => {
    const invalidSettlement = { ...validSettlement, name: '' };
    const result = settlementSchema.safeParse(invalidSettlement);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'String must contain at least 1 character(s)',
      );
    }
  });

  it('should validate a settlement with minimal valid fields', () => {
    const minimalSettlement = {
      address: '12345, Some Address',
      name: 'Some Name',
    };
    const result = settlementSchema.safeParse(minimalSettlement);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(minimalSettlement);
    }
  });
});
