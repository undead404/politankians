import { Act } from '../../schemas/act.js';
import getDeathTitle from './death-title.js';
import formatDate from '../format-date.js';
import getParticipantFullName from '../get-participant-full-name.js';

jest.mock('../format-date.js');
jest.mock('../get-participant-full-name.js');

describe('getDeathTitle', () => {
  const mockAct: Act = {
    act_type: 'смерть',
    date: 1694649600000,
    description: 'Test description',
    number: 1,
    id: '12345',
    page: '1',
    primaryParticipants: [
      {
        age: '70',
        given_name: 'Jane',
        middle_name: 'Doe',
        note: 'Test note',
        role: 'померла особа',
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
    (formatDate as jest.Mock).mockReturnValue('14-09-2023');
    (getParticipantFullName as jest.Mock).mockReturnValue('Jane Doe Smith');
  });

  it('should return the correct death title', () => {
    const result = getDeathTitle(mockAct);
    expect(result).toBe('смерть, 14-09-2023: Jane Doe Smith');
  });

  it('should throw an error if there is no deceased participant', () => {
    const actWithoutDeceased = {
      ...mockAct,
      primaryParticipants: [],
    };
    expect(() => getDeathTitle(actWithoutDeceased)).toThrow(
      `No deceased in this act: ${mockAct.id}`,
    );
  });
});
