import { transliterateUaToLatin } from 'ua2latin';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import getRowSettlementId from './get-row-settlement-id.js';

vi.mock('ua2latin', () => ({
  transliterateUaToLatin: vi.fn(),
}));

describe('getRowSettlementId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct settlement ID', () => {
    (transliterateUaToLatin as Mock).mockReturnValue('Kyiv');
    const result = getRowSettlementId('01001', 'Київ');
    expect(result).toBe('01001-Kyiv');
    expect(transliterateUaToLatin).toHaveBeenCalledWith('Київ');
  });

  it('should throw an error if postal code is not supplied', () => {
    expect(() => getRowSettlementId('', 'Львів')).toThrow(
      'Postal code not supplied',
    );
  });

  it('should throw an error if settlement name is not supplied', () => {
    expect(() => getRowSettlementId('02002', '')).toThrow(
      'Settlement name not supplied',
    );
  });

  it('should throw an error if both postal code and settlement name are not supplied', () => {
    expect(() => getRowSettlementId('', '')).toThrow(
      'Postal code not supplied',
    );
  });
});
