import { Act } from '../../schemas/act.js';
import getBirthTitle from './birth-title.js';
import formatDate from '../format-date.js';
import getParticipantFullName from '../get-participant-full-name.js';

jest.mock('../format-date.js');
jest.mock('../get-participant-full-name.js');

describe('getBirthTitle', () => {
  const mockAct: Act = {
    act_type: 'народження',
    date: '2023-09-14',
    description: 'Test description',
    number: 1,
    objectID: '12345',
    page: '1',
    participants: [
      {
        age: '1',
        given_name: 'John',
        middle_name: 'Doe',
        note: 'Test note',
        role: 'дитина',
        surname: 'Smith',
      },
    ],
    settlement: 'Test settlement',
    title: 'Test title',
    year: 2023,
  };

  beforeEach(() => {
    (formatDate as jest.Mock).mockReturnValue('14.09.2023');
    (getParticipantFullName as jest.Mock).mockReturnValue('John Doe Smith');
  });

  it('should return the correct birth title', () => {
    const result = getBirthTitle(mockAct);
    expect(result).toBe('народження, 14.09.2023: John Doe Smith');
  });

  it('should throw an error if no baptized participant is found', () => {
    const invalidAct = { ...mockAct, participants: [] };
    expect(() => getBirthTitle(invalidAct)).toThrow(
      'No baptized in this act: 12345',
    );
  });
});
