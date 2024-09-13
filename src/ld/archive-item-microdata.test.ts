import { describe, expect, it } from '@jest/globals';

import type { Archive } from '../schemas/archive.ts';
import type { ArchiveItem } from '../schemas/archive-item.ts';
import getArchiveItemMicrodata from './archive-item-microdata.ts';

describe('getArchiveItemMicrodata', () => {
  it('should return the correct microdata object with valid input', () => {
    const validArchiveItem: ArchiveItem = {
      archive: 'ДАХмО',
      archivedAt: ['2023-10-15'],
      csvUrl: 'https://example.com/archive.csv',
      dateCreated: '2023-09-01',
      genre: 'Parish register',
      gssUrl: 'https://example.com/gss',
      identifier: '123-456-789',
      inLanguage: 'Russian',
      title: 'My Archive',
    };

    const validArchive: Archive = {
      address: '123 Main St',
      currenciesAccepted: ['USD', 'EUR'],
      email: 'info@example.com',
      foundingDate: '1900',
      openingHours: 'Mon-Fri 9:00-17:00',
      title: 'Example Archive',
      url: 'https://example.com/archive',
    };

    const result = getArchiveItemMicrodata(validArchiveItem, validArchive);

    expect(result).toEqual({
      '@type': 'ArchiveComponent',
      archivedAt: '2023-10-15',
      dateCreated: '2023-09-01',
      dateModified: null,
      genre: 'Parish register',
      holdingArchive: {
        '@type': 'ArchiveOrganization',
        address: '123 Main St',
        currenciesAccepted: ['USD', 'EUR'],
        email: 'info@example.com',
        foundingDate: '1900',
        openingHours: 'Mon-Fri 9:00-17:00',
        title: 'Example Archive',
        url: 'https://example.com/archive',
      },
      identifier: '123-456-789',
      inLanguage: 'Russian',
      name: 'My Archive',
    });
  });

  // ... other test cases
});
