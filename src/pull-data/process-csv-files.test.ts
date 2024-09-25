import processCSVFiles from './process-csv-files.js';
import downloadAndConvertToJSON from './download-and-convert-to-json.js';
import getArchiveItems from './get-archive-items.js';

jest.mock('./download-and-convert-to-json');
jest.mock('./get-archive-items');

describe('processCSVFiles', () => {
  const mockArchiveItems = [
    {
      archive: 'DAKhmO',
      csvUrl:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhr0RJjOJcotVPolQd2iSKGLW_JxGa7wMMAGqSF443EPoC1sJjIayOwYiBdo-NeWynzzD2N8SMi5qF/pub?gid=1532887418&single=true&output=csv',
      genre: 'Parish register',
      identifier: '315-1-6679',
    },
  ];

  beforeEach(() => {
    (getArchiveItems as jest.Mock).mockResolvedValue(mockArchiveItems);
    (downloadAndConvertToJSON as jest.Mock).mockResolvedValue(null);
  });

  it('should call getArchiveItems to retrieve archive items', async () => {
    await processCSVFiles();
    expect(getArchiveItems).toHaveBeenCalled();
  });

  it('should call downloadAndConvertToJSON for each archive item', async () => {
    await processCSVFiles();
    expect(downloadAndConvertToJSON).toHaveBeenCalledWith(
      mockArchiveItems[0]!.csvUrl,
      mockArchiveItems[0]!.genre,
      `${mockArchiveItems[0]!.archive}-${mockArchiveItems[0]!.identifier}.json`,
    );
  });

  it('should handle errors thrown by getArchiveItems', async () => {
    const mockError = new Error('getArchiveItems error');
    (getArchiveItems as jest.Mock).mockRejectedValue(mockError);

    await expect(processCSVFiles()).rejects.toThrow('getArchiveItems error');
  });

  it('should handle errors thrown by downloadAndConvertToJSON', async () => {
    const mockError = new Error('downloadAndConvertToJSON error');
    (downloadAndConvertToJSON as jest.Mock).mockRejectedValue(mockError);

    await expect(processCSVFiles()).rejects.toThrow(
      'downloadAndConvertToJSON error',
    );
  });
});
