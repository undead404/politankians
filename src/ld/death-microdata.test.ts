import { describe, it, expect } from '@jest/globals';

import getDeathMicrodata from './death-microdata.js';
import type { Act } from '../schemas/act.js';
import type { Settlement } from '../schemas/settlement.js';

describe('getDeathMicrodata', () => {
  const settlement: Settlement = {
    address: '12345, Fictional City, Imaginary State, Dreamland',
    name: 'Dreamland City',
  };

  it('should throw an error if act_type is not "смерть"', () => {
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

    expect(() => getDeathMicrodata(act, settlement)).toThrow(
      'Wrong act_type: народження',
    );
  });

  it('should throw an error if there is no deceased participant', () => {
    const act: Act = {
      act_type: 'смерть',
      date: '2023-01-01',
      description: 'Death record',
      number: 1,
      objectID: '1',
      page: '1',
      primaryParticipants: [],
      secondaryParticipants: [],
      settlement: 'Dreamland City',
      tertiaryParticipants: [],
      title: 'Death Act',
      year: 2023,
    };

    expect(() => getDeathMicrodata(act, settlement)).toThrow(
      'No deceased in death',
    );
  });

  it('should return correct microdata for a valid death act', () => {
    const act: Act = {
      act_type: 'смерть',
      date: '2023-01-01',
      description: 'Death record',
      number: 1,
      objectID: '1',
      page: '1',
      primaryParticipants: [
        {
          age: '70',
          given_name: 'John',
          middle_name: 'Doe',
          note: '',
          role: 'померла особа',
          surname: 'Smith',
        },
      ],
      secondaryParticipants: [],
      settlement: 'Dreamland City',
      tertiaryParticipants: [
        {
          age: '40',
          given_name: 'Jane',
          middle_name: 'Doe',
          note: '',
          role: 'заявник',
          surname: 'Smith',
        },
        {
          age: '75',
          given_name: 'Robert',
          middle_name: 'Doe',
          note: '',
          role: 'батько',
          surname: 'Smith',
        },
        {
          age: '70',
          given_name: 'Mary',
          middle_name: 'Doe',
          note: '',
          role: 'мати',
          surname: 'Smith',
        },
        {
          age: '72',
          given_name: 'Anna',
          middle_name: 'Doe',
          note: '',
          role: 'чоловік',
          surname: 'Smith',
        },
      ],
      title: 'Death Act',
      year: 2023,
    };

    const result = getDeathMicrodata(act, settlement);

    expect(result).toEqual({
      '@type': 'Person',
      additionalName: 'Doe',
      familyName: 'Smith',
      givenName: 'John',
      description: undefined,
      deathDate: '2023-01-01',
      deathPlace: {
        '@type': 'City',
        address: '12345, Fictional City, Imaginary State, Dreamland',
        name: 'Dreamland City',
      },
      knows: [
        {
          '@type': 'Person',
          additionalName: 'Doe',
          familyName: 'Smith',
          givenName: 'Jane',
          description: undefined,
        },
      ],
      parent: [
        {
          '@type': 'Person',
          additionalName: 'Doe',
          familyName: 'Smith',
          givenName: 'Robert',
          description: undefined,
        },
      ],
      spouse: {
        '@type': 'Person',
        additionalName: 'Doe',
        familyName: 'Smith',
        givenName: 'Anna',
        description: undefined,
      },
    });
  });
});
