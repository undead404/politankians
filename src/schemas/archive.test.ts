// Jest unit tests for archive.ts

import { archiveSchema } from './archive.js';

describe('archiveSchema', () => {
  it('should validate a correct archive', () => {
    const validArchive = {
      address: '29000, Ukraine, Khmelnytskyi, vul. Heroiv Maidanu, 99',
      currenciesAccepted: ['UAH'],
      email: 'archive_km@arch.gov.ua',
      foundingDate: '1922',
      openingHours: 'Mo,Tu,We,Th 9:00-17:00',
      shortTitle: 'ДАХмО',
      title: 'Державний архів Хмельницької області',
      url: 'https://dahmo.gov.ua/',
    };

    expect(() => archiveSchema.parse(validArchive)).not.toThrow();
  });

  it('should invalidate an archive with incorrect email', () => {
    const invalidArchive = {
      address: '29000, Ukraine, Khmelnytskyi, vul. Heroiv Maidanu, 99',
      currenciesAccepted: ['UAH'],
      email: 'invalid-email',
      foundingDate: '1922',
      openingHours: 'Mo,Tu,We,Th 9:00-17:00',
      shortTitle: 'ДАХмО',
      title: 'Державний архів Хмельницької області',
      url: 'https://dahmo.gov.ua/',
    };

    expect(() => archiveSchema.parse(invalidArchive)).toThrow();
  });

  it('should invalidate an archive with incorrect foundingDate format', () => {
    const invalidArchive = {
      address: '29000, Ukraine, Khmelnytskyi, vul. Heroiv Maidanu, 99',
      currenciesAccepted: ['UAH'],
      email: 'archive_km@arch.gov.ua',
      foundingDate: '22',
      openingHours: 'Mo,Tu,We,Th 9:00-17:00',
      shortTitle: 'ДАХмО',
      title: 'Державний архів Хмельницької області',
      url: 'https://dahmo.gov.ua/',
    };

    expect(() => archiveSchema.parse(invalidArchive)).toThrow();
  });

  it('should invalidate an archive with incorrect URL format', () => {
    const invalidArchive = {
      address: '29000, Ukraine, Khmelnytskyi, vul. Heroiv Maidanu, 99',
      currenciesAccepted: ['UAH'],
      email: 'archive_km@arch.gov.ua',
      foundingDate: '1922',
      openingHours: 'Mo,Tu,We,Th 9:00-17:00',
      shortTitle: 'ДАХмО',
      title: 'Державний архів Хмельницької області',
      url: 'invalid-url',
    };

    expect(() => archiveSchema.parse(invalidArchive)).toThrow();
  });
});
