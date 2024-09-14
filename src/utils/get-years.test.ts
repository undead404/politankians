import getYears, { RowWithDate } from './get-years.js';

describe('getYears', () => {
  it('should return a single year when all dates are in the same year', () => {
    const rows: RowWithDate[] = [
      { date: '2023-01-01' },
      { date: '2023-05-15' },
      { date: '2023-12-31' },
    ];

    const result = getYears(rows);
    expect(result).toBe('2023');
  });

  it('should return a range of years when dates span multiple years', () => {
    const rows: RowWithDate[] = [
      { date: '2021-03-10' },
      { date: '2022-07-22' },
      { date: '2023-11-05' },
    ];

    const result = getYears(rows);
    expect(result).toBe('2021-2023');
  });

  it('should throw an error when no rows are supplied', () => {
    const rows: RowWithDate[] = [];

    expect(() => getYears(rows)).toThrow('No rows supplied');
  });

  it('should handle a single row correctly', () => {
    const rows: RowWithDate[] = [{ date: '2022-08-19' }];

    const result = getYears(rows);
    expect(result).toBe('2022');
  });

  it('should handle rows with non-sequential years', () => {
    const rows: RowWithDate[] = [
      { date: '2020-04-12' },
      { date: '2023-09-30' },
      { date: '2021-06-18' },
    ];

    const result = getYears(rows);
    expect(result).toBe('2020-2023');
  });
});
