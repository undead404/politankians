import path from 'path';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import parseCsv from '../utils/parse-csv.js';
import downloadAndConvertToJSON from './download-and-convert-to-json.js';

jest.mock('fs-extra');
jest.mock('node-fetch');
jest.mock('../utils/parse-csv.js');

describe('downloadAndConvertToJSON', () => {
  const mockUrl = 'http://example.com/test.csv';
  const mockGenre = 'Confessional list';
  const mockFileName = 'test.json';
  const mockCsvData = 'name,age\nJohn Doe,30\nJane Doe,28';
  const mockJsonData = [
    { name: 'John Doe', age: 30 },
    { name: 'Jane Doe', age: 28 },
  ];

  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockCsvData),
    });
    (parseCsv as jest.Mock).mockReturnValue(mockJsonData);
    (fs.outputJson as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should download CSV, convert to JSON, and save to file', async () => {
    await downloadAndConvertToJSON(mockUrl, mockGenre, mockFileName);

    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(parseCsv).toHaveBeenCalledWith(mockCsvData);
    expect(fs.outputJson).toHaveBeenCalledWith(
      path.join('./src/content/confessional-lists', mockFileName),
      mockJsonData,
      { spaces: 2 },
    );
  });

  it('should handle errors and exit process', async () => {
    const mockError = new Error('Test error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    await expect(
      downloadAndConvertToJSON(mockUrl, mockGenre, mockFileName),
    ).rejects.toThrow('process.exit called');

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
