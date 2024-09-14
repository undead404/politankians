// Jest unit tests for get-archive-items.ts

import { readdir, readFile } from 'fs/promises';
import path from 'path';
import getArchiveItems from './get-archive-items.js';
import { archiveItemSchema } from '../schemas/archive-item.js';

jest.mock('fs/promises');

describe('getArchiveItems', () => {
  const mockFiles = ['item1.json', 'item2.json', 'not-json.txt'];
  const mockJSONContent = JSON.stringify({
    archive: 'ДАХмО',
    archivedAt: [
      'https://www.familysearch.org/records/images/search-results?imageGroupNumbers=114926675',
    ],
    csvUrl:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhr0RJjOJcotVPolQd2iSKGLW_JxGa7wMMAGqSF443EPoC1sJjIayOwYiBdo-NeWynzzD2N8SMi5qF/pub?gid=1532887418&single=true&output=csv',
    dateCreated: '1796',
    dateModified: '1954-06-22',
    genre: 'Parish register',
    gssUrl:
      'https://docs.google.com/spreadsheets/d/1oambY-cIilV6i8O2yHZAV-ovmrqb2vxrCLAofs3TTwU/edit?usp=sharing',
    identifier: '315-1-6679',
    inLanguage: 'Russian',
    title:
      'Метрическая книга записей актов гражданского состояния о рождении, браке и смерти по церквям Ямпольского уезда за 1796 г. Ямполь, села А-Я',
  });

  beforeEach(() => {
    (readdir as jest.Mock).mockResolvedValue(mockFiles);
    (readFile as jest.Mock).mockResolvedValue(mockJSONContent);
  });

  it('should read files from the archive items folder', async () => {
    await getArchiveItems();
    expect(readdir).toHaveBeenCalledWith('./src/content/archive-items');
  });

  it('should filter out non-JSON files', async () => {
    await getArchiveItems();
    expect(readdir).toHaveBeenCalledWith('./src/content/archive-items');
    expect(readFile).toHaveBeenCalledWith(
      path.join('./src/content/archive-items', 'item1.json'),
      'utf8',
    );
    expect(readFile).toHaveBeenCalledWith(
      path.join('./src/content/archive-items', 'item2.json'),
      'utf8',
    );
    expect(readFile).not.toHaveBeenCalledWith(
      path.join('./src/content/archive-items', 'not-json.txt'),
      'utf8',
    );
  });

  it('should parse JSON content and validate against schema', async () => {
    const result = await getArchiveItems();
    expect(result).toHaveLength(2);
    result.forEach((item) => {
      expect(() => archiveItemSchema.parse(item)).not.toThrow();
    });
  });

  it('should handle errors thrown by readdir', async () => {
    const mockError = new Error('readdir error');
    (readdir as jest.Mock).mockRejectedValue(mockError);

    await expect(getArchiveItems()).rejects.toThrow('readdir error');
  });

  it('should handle errors thrown by readFile', async () => {
    const mockError = new Error('readFile error');
    (readFile as jest.Mock).mockRejectedValue(mockError);

    await expect(getArchiveItems()).rejects.toThrow('readFile error');
  });
});
