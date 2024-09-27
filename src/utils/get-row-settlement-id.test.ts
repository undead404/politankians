import { transliterateUaToLatin } from 'ua2latin';

import getRowSettlementId from './get-row-settlement-id.js';

jest.mock('ua2latin', () => ({
  transliterateUaToLatin: jest.fn(),
}));

describe('getRowSettlementId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct settlement ID', () => {
    (transliterateUaToLatin as jest.Mock).mockReturnValue('Kyiv');
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
