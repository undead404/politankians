import { Act } from '../../schemas/act.js';
import getMarriageTitle from './marriage-title.js';
import formatDate from '../format-date.js';
import getParticipantFullName from '../get-participant-full-name.js';

jest.mock('../format-date.js');
jest.mock('../get-participant-full-name.js');

describe('getMarriageTitle', () => {
  const mockAct: Act = {
    act_type: 'шлюб',
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
        role: 'наречений',
        surname: 'Smith',
      },
      {
        age: '28',
        given_name: 'Jane',
        middle_name: 'Doe',
        note: 'Test note',
        role: 'наречена',
        surname: 'Doe',
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
    (getParticipantFullName as jest.Mock)
      .mockReturnValueOnce('John Doe Smith')
      .mockReturnValueOnce('Jane Doe');
  });

  it('should return the correct marriage title', () => {
    const result = getMarriageTitle(mockAct);
    expect(result).toBe('шлюб, 14-09-2023: John Doe Smith і Jane Doe');
  });

  it('should throw an error if there is no groom', () => {
    const actWithoutGroom = {
      ...mockAct,
      primaryParticipants: mockAct.primaryParticipants.filter(
        ({ role }) => role !== 'наречений',
      ),
    };
    expect(() => getMarriageTitle(actWithoutGroom)).toThrow(
      `No groom in this act: ${mockAct.id}`,
    );
  });

  it('should throw an error if there is no bride', () => {
    const actWithoutBride = {
      ...mockAct,
      primaryParticipants: mockAct.primaryParticipants.filter(
        ({ role }) => role !== 'наречена',
      ),
    };
    expect(() => getMarriageTitle(actWithoutBride)).toThrow(
      `No bride in this act: ${mockAct.id}`,
    );
  });
});
