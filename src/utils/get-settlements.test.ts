// Jest unit tests for get-settlements.ts

import getSettlements, { type RowWithSettlement } from './get-settlements.js';

describe('getSettlements', () => {
  it('should return unique settlements as a comma-separated string', () => {
    const rows: RowWithSettlement[] = [
      { settlement: 'Kyiv' },
      { settlement: 'Lviv' },
      { settlement: 'Kyiv' },
      { settlement: 'Odesa' },
    ];

    const result = getSettlements(rows);
    expect(result).toBe('Kyiv, Lviv, Odesa');
  });

  it('should return an empty string for an empty array', () => {
    const rows: RowWithSettlement[] = [];

    const result = getSettlements(rows);
    expect(result).toBe('');
  });

  it('should handle a single row correctly', () => {
    const rows: RowWithSettlement[] = [{ settlement: 'Kyiv' }];

    const result = getSettlements(rows);
    expect(result).toBe('Kyiv');
  });

  it('should handle rows with all identical settlements', () => {
    const rows: RowWithSettlement[] = [
      { settlement: 'Kyiv' },
      { settlement: 'Kyiv' },
      { settlement: 'Kyiv' },
    ];

    const result = getSettlements(rows);
    expect(result).toBe('Kyiv');
  });

  it('should handle rows with different settlements', () => {
    const rows: RowWithSettlement[] = [
      { settlement: 'Kyiv' },
      { settlement: 'Lviv' },
      { settlement: 'Odesa' },
      { settlement: 'Dnipro' },
    ];

    const result = getSettlements(rows);
    expect(result).toBe('Kyiv, Lviv, Odesa, Dnipro');
  });
});
