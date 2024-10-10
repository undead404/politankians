import { Act } from '../../schemas/act.js';
import getBirthTitle from './birth-title.js';
import formatDate from '../format-date.js';
import getPersonFullName from '../get-person-full-name.js';

jest.mock('../format-date.js');
jest.mock('../get-person-full-name.js');

describe('getBirthTitle', () => {
  const mockAct: Act = {
    act_type: 'народження',
    date: 1694649600000,
    description: 'Test description',
    number: 1,
    id: '12345',
    page: '1',
    primaryParticipants: [
      {
        age: '1',
        given_name: 'John',
        middle_name: 'Doe',
        note: 'Test note',
        role: 'дитина',
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
    (formatDate as jest.Mock).mockReturnValue('14.09.2023');
    (getPersonFullName as jest.Mock).mockReturnValue('John Doe Smith');
  });

  it('should return the correct birth title', () => {
    const result = getBirthTitle(mockAct);
    expect(result).toBe('народження, 14.09.2023: John Doe Smith');
  });

  it('should return ? if no baptized participant is found', () => {
    const invalidAct = { ...mockAct, primaryParticipants: [] };
    expect(getBirthTitle(invalidAct)).toEqual('народження, 14.09.2023: ?');
  });
});
