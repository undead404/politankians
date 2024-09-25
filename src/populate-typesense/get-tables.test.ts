import { jest } from '@jest/globals';
import { z } from 'astro/zod';

import getTables from './get-tables.js';
import readJSONFiles from './read-json-files.js';

jest.mock('./read-json-files');

describe('getTables', () => {
  const mockSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const mockData = [
    { data: { id: 1, name: 'Table 1' } },
    { data: { id: 2, name: 'Table 2' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse JSON files and return tables', async () => {
    (readJSONFiles as jest.Mock).mockReturnValue(mockData);

    const result = await getTables('mock-directory', mockSchema);

    expect(result).toEqual([
      { id: 1, name: 'Table 1' },
      { id: 2, name: 'Table 2' },
    ]);
  });

  it('should handle empty directory', async () => {
    (readJSONFiles as jest.Mock).mockReturnValue([]);

    const result = await getTables('mock-directory', mockSchema);

    expect(result).toEqual([]);
  });

  it('should throw an error if schema validation fails', async () => {
    const invalidData = [{ data: { id: 'invalid', name: 'Table 1' } }];
    (readJSONFiles as jest.Mock).mockReturnValue(invalidData);

    await expect(getTables('mock-directory', mockSchema)).rejects.toThrow();
  });
});
