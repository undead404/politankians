import { describe, it, expect } from '@jest/globals';

import getBaseMicrodata from './participant-base-microdata.js';
import type { Participant } from '../schemas/participant.js';
import type { Person } from './types.js';

describe('getBaseMicrodata', () => {
  it('should return correct microdata for a participant with all fields', () => {
    const participant: Participant = {
      age: '30',
      given_name: 'John',
      middle_name: 'A.',
      note: 'Some note',
      role: 'наречений',
      surname: 'Doe',
    };

    const expectedPerson: Person = {
      '@type': 'Person',
      additionalName: 'A.',
      familyName: 'Doe',
      givenName: 'John',
      description: 'Some note',
    };

    expect(getBaseMicrodata(participant)).toEqual(expectedPerson);
  });

  it('should return correct microdata for a participant without optional fields', () => {
    const participant: Participant = {
      given_name: 'Jane',
      middle_name: 'B.',
      role: 'наречена',
      surname: 'Smith',
    };

    const expectedPerson: Person = {
      '@type': 'Person',
      additionalName: 'B.',
      familyName: 'Smith',
      givenName: 'Jane',
      description: undefined,
    };

    expect(getBaseMicrodata(participant)).toEqual(expectedPerson);
  });

  it('should handle missing middle_name gracefully', () => {
    const participant: Participant = {
      given_name: 'Alice',
      middle_name: '',
      role: 'поручитель',
      surname: 'Johnson',
    };

    const expectedPerson: Person = {
      '@type': 'Person',
      additionalName: '',
      familyName: 'Johnson',
      givenName: 'Alice',
      description: undefined,
    };

    expect(getBaseMicrodata(participant)).toEqual(expectedPerson);
  });
});
