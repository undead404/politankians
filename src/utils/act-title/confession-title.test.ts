import { Act } from '../../schemas/act.js';
import getConfessionTitle from './confession-title.js';
import getParticipantFullName from '../get-participant-full-name.js';

jest.mock('../get-participant-full-name.js');

describe('getConfessionTitle', () => {
  const mockAct: Act = {
    act_type: 'сповідь',
    date: 1694649600000,
    description: 'Test description',
    number: 1,
    id: '12345',
    page: '1',
    primaryParticipants: [
      {
        age: '30',
        given_name: 'John',
        middle_name: 'Doe',
        note: 'Test note',
        role: '',
        surname: 'Smith',
      },
    ],
    secondaryParticipants: [],
    settlement: 'Test settlement',
    tertiaryParticipants: [],
    title: 'Test title',
    year: 2023,
  };

  beforeEach(() => {
    (getParticipantFullName as jest.Mock).mockReturnValue('John Doe Smith');
  });

  it('should return the correct confession title', () => {
    const result = getConfessionTitle(mockAct);
    expect(result).toBe('сповідь, 14.09.2023 (John Doe Smith)');
  });

  it('should handle missing note gracefully', () => {
    const actWithoutNote: Act = {
      ...mockAct,
      primaryParticipants: [
        {
          ...mockAct.primaryParticipants[0]!,
          note: undefined,
        },
      ],
    };
    const result = getConfessionTitle(actWithoutNote);
    expect(result).toBe('сповідь, 14.09.2023 (John Doe Smith)');
  });
});
