import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { actSchema } from '../schemas/act.js';
import { ConfessionalList } from '../schemas/confessional-list.js';
import type { Participant } from '../schemas/participant.js';

import getActTitle from './act-title/index.js';
import convertConfessionalListsToActs from './convert-confessional-list-to-acts.js';
import getActId from './get-act-id.js';
import getPersonFullName from './get-person-full-name.js';

vi.mock('./get-act-id.js');
vi.mock('./act-title/index.js');
vi.mock('./get-person-full-name.js');

describe('convertConfessionalListsToActs', () => {
  const mockConfessionalLists: ConfessionalList[] = [
    {
      id: 'mock-item',
      rows: [
        {
          act: 1,
          date: '2023-01-01',
          page: '1',
          settlement: 'Some Settlement',
          age: '30',
          given_name: 'John',
          middle_name: 'Doe',
          surname: 'Smith',
          note: 'Note 1',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
          postal_code: '21000',
          role: '',
        },
        {
          act: 1,
          date: '2023-01-01',
          page: '1',
          settlement: 'Some Settlement',
          age: '25',
          given_name: 'Jane',
          middle_name: 'Doe',
          surname: 'Smith',
          note: 'Note 2',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
          postal_code: '21000',
          role: 'жена его',
        },
      ],
      settlements: 'City, Town',
      years: '2023',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (getActId as Mock).mockReturnValue('act-1');
    (getActTitle as Mock).mockReturnValue('Act Title');
    (getPersonFullName as Mock).mockImplementation(
      (participant: Participant) =>
        `${participant.given_name} ${participant.surname}`,
    );
  });

  it('should convert confessional lists to acts', () => {
    const result = convertConfessionalListsToActs(mockConfessionalLists);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      act_type: 'сповідь',
      date: 1672531200000,
      description: 'John Smith;\nжена его Jane Smith',
      number: 1,
      id: 'act-1',
      page: '1',
      primaryParticipants: [
        {
          age: '30',
          role: '',
          given_name: 'John',
          middle_name: 'Doe',
          surname: 'Smith',
          note: 'Note 1',
        },
      ],
      secondaryParticipants: [
        {
          age: '25',
          role: 'жена его',
          given_name: 'Jane',
          middle_name: 'Doe',
          surname: 'Smith',
          note: 'Note 2',
        },
      ],
      settlement: 'Some Settlement',
      tertiaryParticipants: [],
      title: 'Act Title',
      year: 2023,
    });
  });

  it('should throw an error if no acts are found', () => {
    expect(() => convertConfessionalListsToActs([])).toThrow('no acts');
  });

  it('should validate the acts with actSchema', () => {
    const result = convertConfessionalListsToActs(mockConfessionalLists);
    result.forEach((act) => {
      expect(() => actSchema.parse(act)).not.toThrow();
    });
  });
});
