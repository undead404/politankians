import { Act } from '../../schemas/act.js';
import getConfessionTitle from './confession-title.js';
import getParticipantFullName from '../get-participant-full-name.js';

jest.mock('../get-participant-full-name.js');

describe('getConfessionTitle', () => {
  const mockAct: Act = {
    act_type: 'сповідь',
    date: '2023-09-14',
    description: 'Test description',
    number: 1,
    objectID: '12345',
    page: '1',
    participants: [
      {
        age: '30',
        given_name: 'John',
        middle_name: 'Doe',
        note: 'Test note',
        role: 'сповідник',
        surname: 'Smith',
      },
    ],
    settlement: 'Test settlement',
    title: 'Test title',
    year: 2023,
  };

  beforeEach(() => {
    (getParticipantFullName as jest.Mock).mockReturnValue('John Doe Smith');
  });

  it('should return the correct confession title', () => {
    const result = getConfessionTitle(mockAct);
    expect(result).toBe('сповідь (Test note John Doe Smith)');
  });

  it('should handle missing note gracefully', () => {
    const actWithoutNote: Act = {
      ...mockAct,
      participants: [
        {
          ...mockAct.participants[0]!,
          note: undefined,
        },
      ],
    };
    const result = getConfessionTitle(actWithoutNote);
    expect(result).toBe('сповідь (John Doe Smith)');
  });
});
