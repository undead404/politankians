import { archiveItemSchema } from './archive-item.js';

describe('archiveItemSchema', () => {
  it('should validate a correct archive item', () => {
    const validArchiveItem = {
      archive: 'ДАХмО',
      archivedAt: [
        'https://www.familysearch.org/records/images/search-results?imageGroupNumbers=114929643',
      ],
      csvUrl:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj2mFKaMSuMggC4BYgLfd5p8blI1r0yN-anHaUiQuzH5HjervUqKuy_QZgtWoxhqbKqB7FcuEdnRJl/pub?gid=1532887418&single=true&output=csv',
      dateCreated: '1806',
      dateModified: '1954-06-21',
      genre: 'Parish register',
      gssUrl:
        'https://docs.google.com/spreadsheets/d/1MU7O2rF-zETJQV8Vvyl92njTkrxP9mW8hYuDIpc5dPU/edit?usp=sharing',
      identifier: '315-1-6859',
      inLanguage: 'Russian',
      title:
        'Метрическая книга регистрации актов о рождении, браке и смерти по церквям Ямпольского уезда за 1806 год.',
    };

    expect(() => archiveItemSchema.parse(validArchiveItem)).not.toThrow();
  });

  it('should invalidate an archive item with incorrect archive', () => {
    const invalidArchiveItem = {
      archive: 'Invalid Archive',
      archivedAt: [
        'https://www.familysearch.org/records/images/search-results?imageGroupNumbers=114929643',
      ],
      csvUrl:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj2mFKaMSuMggC4BYgLfd5p8blI1r0yN-anHaUiQuzH5HjervUqKuy_QZgtWoxhqbKqB7FcuEdnRJl/pub?gid=1532887418&single=true&output=csv',
      dateCreated: '1806',
      dateModified: '1954-06-21',
      genre: 'Parish register',
      gssUrl:
        'https://docs.google.com/spreadsheets/d/1MU7O2rF-zETJQV8Vvyl92njTkrxP9mW8hYuDIpc5dPU/edit?usp=sharing',
      identifier: '315-1-6859',
      inLanguage: 'Russian',
      title:
        'Метрическая книга регистрации актов о рождении, браке и смерти по церквям Ямпольского уезда за 1806 год.',
    };

    expect(() => archiveItemSchema.parse(invalidArchiveItem)).toThrow();
  });

  it('should invalidate an archive item with incorrect identifier format', () => {
    const invalidArchiveItem = {
      archive: 'ДАХмО',
      archivedAt: [
        'https://www.familysearch.org/records/images/search-results?imageGroupNumbers=114929643',
      ],
      csvUrl:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj2mFKaMSuMggC4BYgLfd5p8blI1r0yN-anHaUiQuzH5HjervUqKuy_QZgtWoxhqbKqB7FcuEdnRJl/pub?gid=1532887418&single=true&output=csv',
      dateCreated: '1806',
      dateModified: '1954-06-21',
      genre: 'Parish register',
      gssUrl:
        'https://docs.google.com/spreadsheets/d/1MU7O2rF-zETJQV8Vvyl92njTkrxP9mW8hYuDIpc5dPU/edit?usp=sharing',
      identifier: 'invalid-identifier',
      inLanguage: 'Russian',
      title:
        'Метрическая книга регистрации актов о рождении, браке и смерти по церквям Ямпольского уезда за 1806 год.',
    };

    expect(() => archiveItemSchema.parse(invalidArchiveItem)).toThrow();
  });
});
