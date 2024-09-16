// Jest unit tests for convertConfessionalListsToActs

import { actSchema } from '../schemas/act.js';
import { ConfessionalList } from '../schemas/confessional-list.js';
import type { Participant } from '../schemas/participant.js';
import getActTitle from './act-title/index.js';
import convertConfessionalListsToActs from './convert-confessional-list-to-acts.js';
import getActId from './get-act-id.js';
import getParticipantFullName from './get-participant-full-name.js';

jest.mock('./get-act-id.js');
jest.mock('./act-title/index.js');
jest.mock('./get-participant-full-name.js');

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
        },
      ],
      settlements: 'City, Town',
      years: '2023',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getActId as jest.Mock).mockReturnValue('act-1');
    (getActTitle as jest.Mock).mockReturnValue('Act Title');
    (getParticipantFullName as jest.Mock).mockImplementation(
      (participant: Participant) =>
        `${participant.given_name} ${participant.surname}`,
    );
  });

  it('should convert confessional lists to acts', () => {
    const result = convertConfessionalListsToActs(mockConfessionalLists);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      act_type: 'сповідь',
      date: '2023-01-01',
      description: 'Note 1 John Smith;\nNote 2 Jane Smith',
      number: 1,
      objectID: 'act-1',
      page: '1',
      primaryParticipants: [
        {
          age: '30',
          role: 'прихожанин',
          given_name: 'John',
          middle_name: 'Doe',
          surname: 'Smith',
          note: 'Note 1',
        },
      ],
      secondaryParticipants: [
        {
          age: '25',
          role: 'прихожанин',
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
