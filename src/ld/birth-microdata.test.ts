import type { Act } from '../schemas/act.js';
import type { ActType } from '../schemas/act_type.js';
import type { Settlement } from '../schemas/settlement.js';
import getBirthMicrodata from './birth-microdata.js';

describe('getBirthMicrodata', () => {
  const mockAct: Act = {
    act_type: 'народження',
    date: '2023-01-01',
    description: 'Birth record',
    number: 1,
    objectID: '12345',
    page: '1',
    primaryParticipants: [
      {
        role: 'дитина',
        given_name: 'Ivan',
        middle_name: 'Ivanovich',
        surname: 'Ivanov',
      },
    ],
    secondaryParticipants: [
      {
        role: 'батько',
        given_name: 'Petr',
        middle_name: 'Petrovich',
        surname: 'Petrov',
      },
      {
        role: 'мати',
        given_name: 'Maria',
        middle_name: 'Ivanovna',
        surname: 'Ivanova',
      },
    ],
    settlement: 'Test Settlement',
    tertiaryParticipants: [
      {
        role: 'хрещений',
        given_name: 'Sergey',
        middle_name: 'Sergeevich',
        surname: 'Sergeev',
      },
      {
        role: 'хрещена',
        given_name: 'Anna',
        middle_name: 'Anatolievna',
        surname: 'Anatolieva',
      },
    ],
    title: 'Birth Act',
    year: 2023,
  };

  const mockSettlement: Settlement = {
    address: '123 Test St, Test City, Test Country',
    name: 'Test City',
  };

  it('should throw an error if act_type is not "народження"', () => {
    const invalidAct = { ...mockAct, act_type: 'шлюб' as ActType };
    expect(() => getBirthMicrodata(invalidAct, mockSettlement)).toThrow(
      'Wrong act_type: шлюб',
    );
  });

  it('should throw an error if no baby is found in participants', () => {
    const invalidAct = {
      ...mockAct,
      primaryParticipants: mockAct.primaryParticipants.filter(
        (p) => p.role !== 'дитина',
      ),
    };
    expect(getBirthMicrodata(invalidAct, mockSettlement)).toEqual(null);
  });

  it('should return correct microdata for a valid birth act', () => {
    const result = getBirthMicrodata(mockAct, mockSettlement);
    expect(result).toEqual({
      '@type': 'Person',
      givenName: 'Ivan',
      additionalName: 'Ivanovich',
      familyName: 'Ivanov',
      birthDate: '2023-01-01',
      birthPlace: {
        '@type': 'City',
        address: '123 Test St, Test City, Test Country',
        name: 'Test City',
      },
      knows: [
        {
          '@type': 'Person',
          givenName: 'Sergey',
          additionalName: 'Sergeevich',
          familyName: 'Sergeev',
        },
        {
          '@type': 'Person',
          givenName: 'Anna',
          additionalName: 'Anatolievna',
          familyName: 'Anatolieva',
        },
      ],
      parent: [
        {
          '@type': 'Person',
          givenName: 'Petr',
          additionalName: 'Petrovich',
          familyName: 'Petrov',
        },
        {
          '@type': 'Person',
          givenName: 'Maria',
          additionalName: 'Ivanovna',
          familyName: 'Ivanova',
        },
      ],
    });
  });
});
