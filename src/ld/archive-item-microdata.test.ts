import type { ArchiveItem } from '../schemas/archive-item.js';
import type { Archive } from '../schemas/archive.js';
import getArchiveItemMicrodata from './archive-item-microdata.js';

describe('getArchiveItemMicrodata', () => {
  const archiveItem: ArchiveItem = {
    archive: 'DAKhmO',
    archivedAt: [
      'https://example.com/records/images/search-results?imageGroupNumbers=123456789',
    ],
    csvUrl:
      'https://example.com/spreadsheets/d/e/2PACX-1vTest/pub?gid=123456789&single=true&output=csv',
    dateCreated: '1800',
    dateModified: '1950-01-01',
    genre: 'Parish register',
    gssUrl: 'https://example.com/spreadsheets/d/123456789/edit?usp=sharing',
    identifier: '123-1-1234',
    documentLocale: 'ru',
    tableLocale: 'ru',
    title: 'Test Title',
  };

  const archive: Archive = {
    address: '123 Test Street, Test City, Test Country',
    currenciesAccepted: ['USD'],
    email: 'test@example.com',
    foundingDate: '1900',
    openingHours: 'Mo,Tu,We,Th 9:00-17:00',
    shortTitle: 'ДАХмО',
    title: 'Державний архів Хмельницької області',
    url: 'https://example.com',
  };

  it('should return the correct microdata for a given archive item and archive', () => {
    const result = getArchiveItemMicrodata(archiveItem, archive);
    expect(result).toEqual({
      '@type': 'ArchiveComponent',
      archivedAt: archiveItem.archivedAt,
      dateCreated: archiveItem.dateCreated,
      dateModified: archiveItem.dateModified,
      genre: archiveItem.genre,
      holdingArchive: {
        '@type': 'ArchiveOrganization',
        ...archive,
      },
      identifier: archiveItem.identifier,
      inLanguage: 'Russian',
      name: archiveItem.title,
    });
  });

  it('should handle optional dateModified field', () => {
    const modifiedArchiveItem = { ...archiveItem, dateModified: undefined };
    const result = getArchiveItemMicrodata(modifiedArchiveItem, archive);
    expect(result).toEqual({
      '@type': 'ArchiveComponent',
      archivedAt: modifiedArchiveItem.archivedAt,
      dateCreated: modifiedArchiveItem.dateCreated,
      dateModified: undefined,
      genre: modifiedArchiveItem.genre,
      holdingArchive: {
        '@type': 'ArchiveOrganization',
        ...archive,
      },
      identifier: modifiedArchiveItem.identifier,
      inLanguage: 'Russian',
      name: modifiedArchiveItem.title,
    });
  });
});
