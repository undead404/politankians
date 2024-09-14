import { Act } from '../../schemas/act.js';
import getMarriageTitle from './marriage-title.js';
import formatDate from '../format-date.js';
import getParticipantFullName from '../get-participant-full-name.js';

jest.mock('../format-date.js');
jest.mock('../get-participant-full-name.js');

describe('getMarriageTitle', () => {
  const mockAct: Act = {
    act_type: 'шлюб',
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
    settlement: 'Test settlement',
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
      participants: mockAct.participants.filter(
        ({ role }) => role !== 'наречений',
      ),
    };
    expect(() => getMarriageTitle(actWithoutGroom)).toThrowError(
      `No groom in this act: ${mockAct.objectID}`,
    );
  });

  it('should throw an error if there is no bride', () => {
    const actWithoutBride = {
      ...mockAct,
      participants: mockAct.participants.filter(
        ({ role }) => role !== 'наречена',
      ),
    };
    expect(() => getMarriageTitle(actWithoutBride)).toThrowError(
      `No bride in this act: ${mockAct.objectID}`,
    );
  });
});
