import parseCsv from './parse-csv.js';

describe('parseCsv', () => {
  it('should parse CSV string into an array of objects', async () => {
    const csvString = `name,age,city\nJohn,30,New York\nJane,25,Los Angeles`;
    const expectedOutput = [
      { name: 'John', age: '30', city: 'New York' },
      { name: 'Jane', age: '25', city: 'Los Angeles' },
    ];
    const result = await parseCsv(csvString);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty array for an empty CSV string', async () => {
    const csvString = '';
    const result = await parseCsv(csvString);
    expect(result).toEqual([]);
  });

  it('should handle CSV string with only headers', async () => {
    const csvString = `name,age,city`;
    const result = await parseCsv(csvString);
    expect(result).toEqual([]);
  });

  it('should handle CSV string with missing values', async () => {
    const csvString = `name,age,city\nJohn,30,\nJane,,Los Angeles`;
    const expectedOutput = [
      { name: 'John', age: '30', city: '' },
      { name: 'Jane', age: '', city: 'Los Angeles' },
    ];
    const result = await parseCsv(csvString);
    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error for invalid CSV format', async () => {
    const csvString = `name,age,city\nJohn,30\nJane,25,Los Angeles`;
    await expect(parseCsv(csvString)).rejects.toThrow();
  });
});
