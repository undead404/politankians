import { describe, it, expect } from '@jest/globals';

import getMarriageMicrodata from './marriage-microdata.js';
import type { Act } from '../schemas/act.js';
import type { Settlement } from '../schemas/settlement.js';
import type { MarryAction } from './types.js';

describe('getMarriageMicrodata', () => {
  const settlement: Settlement = {
    address: '12345, Fictional City, Imaginary State, Dreamland',
    name: 'Dreamland City',
  };

  it('should throw an error if act_type is not "шлюб"', () => {
    const act: Act = {
      act_type: 'народження',
      date: '2023-01-01',
      description: 'Birth record',
      number: 1,
      objectID: '1',
      page: '1',
      primaryParticipants: [],
      secondaryParticipants: [],
      settlement: 'Dreamland City',
      tertiaryParticipants: [],
      title: 'Birth Act',
      year: 2023,
    };

    expect(() => getMarriageMicrodata(act, settlement)).toThrow(
      'Wrong act_type: народження',
    );
  });

  it('should return correct microdata for a valid marriage act', () => {
    const act: Act = {
      act_type: 'шлюб',
      date: '2023-01-01',
      description: 'Marriage record',
      number: 1,
      objectID: '1',
      page: '1',
      primaryParticipants: [
        {
          age: '30',
          given_name: 'John',
          middle_name: 'A.',
          note: '',
          role: 'наречений',
          surname: 'Doe',
        },
        {
          age: '28',
          given_name: 'Jane',
          middle_name: 'B.',
          note: '',
          role: 'наречена',
          surname: 'Smith',
        },
      ],
      secondaryParticipants: [
        {
          age: '60',
          given_name: 'Michael',
          middle_name: 'C.',
          note: '',
          role: 'батько нареченого',
          surname: 'Doe',
        },
        {
          age: '58',
          given_name: 'Sarah',
          middle_name: 'D.',
          note: '',
          role: 'мати нареченого',
          surname: 'Doe',
        },
        {
          age: '62',
          given_name: 'Robert',
          middle_name: 'E.',
          note: '',
          role: 'батько нареченої',
          surname: 'Smith',
        },
        {
          age: '60',
          given_name: 'Emily',
          middle_name: 'F.',
          note: '',
          role: 'мати нареченої',
          surname: 'Smith',
        },
      ],
      settlement: 'Dreamland City',
      tertiaryParticipants: [
        {
          age: '35',
          given_name: 'Paul',
          middle_name: 'G.',
          note: '',
          role: 'поручитель',
          surname: 'Brown',
        },
      ],
      title: 'Marriage Act',
      year: 2023,
    };

    const expectedMicrodata: MarryAction = {
      '@type': 'MarryAction',
      agent: {
        '@type': 'Person',
        givenName: 'John',
        familyName: 'Doe',
        additionalName: 'A.',
        parent: [
          {
            '@type': 'Person',
            givenName: 'Michael',
            familyName: 'Doe',
            additionalName: 'C.',
          },
        ],
      },
      endTime: '2023-01-01',
      location: {
        '@type': 'City',
        address: '12345, Fictional City, Imaginary State, Dreamland',
        name: 'Dreamland City',
      },
      object: {
        '@type': 'Person',
        givenName: 'Jane',
        familyName: 'Smith',
        additionalName: 'B.',
        parent: [
          {
            '@type': 'Person',
            givenName: 'Robert',
            familyName: 'Smith',
            additionalName: 'E.',
          },
        ],
      },
      participants: [
        {
          '@type': 'Person',
          givenName: 'Paul',
          familyName: 'Brown',
          additionalName: 'G.',
        },
      ],
    };

    expect(getMarriageMicrodata(act, settlement)).toEqual(expectedMicrodata);
  });
});
