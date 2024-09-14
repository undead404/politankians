// Jest unit tests for populate-index.ts

import populateIndex from './populate-index.js';
import algoliaClient from './algolia.js';
import environment from '../environment.js';
import type { Act } from '../schemas/act.js';

jest.mock('./algolia');

describe('populateIndex', () => {
  const mockData: Act[] = [
    {
      act_type: 'народження',
      date: '2023-09-14',
      description: 'Description 1',
      number: 1,
      objectID: '1',
      page: '1',
      participants: [
        { role: 'role1', given_name: 'Test', middle_name: '', surname: '' },
      ],
      settlement: 'Settlement 1',
      title: 'Title 1',
      year: 2023,
    },
  ];

  it('should call saveObjects with correct parameters', async () => {
    await populateIndex(mockData);

    expect(algoliaClient.saveObjects).toHaveBeenCalledWith({
      indexName: environment.ALGOLIA_INDEX_NAME,
      objects: mockData,
    });
  });

  it('should return the result of saveObjects', async () => {
    const mockResponse = { objectIDs: ['1'] };
    (algoliaClient.saveObjects as jest.Mock).mockResolvedValue(mockResponse);

    const result = await populateIndex(mockData);

    expect(result).toEqual(mockResponse);
  });

  it('should handle errors thrown by saveObjects', async () => {
    const mockError = new Error('Algolia error');
    (algoliaClient.saveObjects as jest.Mock).mockRejectedValue(mockError);

    await expect(populateIndex(mockData)).rejects.toThrow('Algolia error');
  });
});
