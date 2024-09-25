import getParticipantSearchQuery from './get-participant-search-query.js';
import type { Act } from '../schemas/act.js';
import { Participant } from '../schemas/participant.ts';
import cleanSurname from './clean-surname.ts';

const mockCleanSurname = cleanSurname as jest.Mock;

jest.mock('./clean-surname', () => jest.fn((surname) => surname));

describe('getParticipantSearchQuery', () => {
  const participant: Participant = {
    age: '30',
    given_name: 'Ivan',
    middle_name: 'Ivanovich',
    note: 'Test note',
    role: 'test role',
    surname: 'Ivanov',
  };

  const act: Act = {
    act_type: 'сповідь',
    date: 1694736000000,
    description: 'Test description',
    number: 1,
    id: '12345',
    page: '1',
    primaryParticipants: [participant],
    secondaryParticipants: [],
    settlement: 'Test settlement',
    tertiaryParticipants: [],
    title: 'Test title',
    year: 2023,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns correct search query with all name parts', () => {
    mockCleanSurname.mockReturnValue('Ivanov');
    const result = getParticipantSearchQuery(participant, act);
    expect(result).toBe('Ivanov Ivan Ivanovich');
  });

  test('returns correct search query without middle name', () => {
    const participantWithoutMiddleName = { ...participant, middle_name: '' };
    mockCleanSurname.mockReturnValue('Ivanov');
    const result = getParticipantSearchQuery(participantWithoutMiddleName, act);
    expect(result).toBe('Ivanov Ivan');
  });

  test('returns correct search query without surname', () => {
    const participantWithoutSurname = { ...participant, surname: '' };
    mockCleanSurname.mockReturnValue('');
    const result = getParticipantSearchQuery(participantWithoutSurname, act);
    expect(result).toBe('Ivan Ivanovich');
  });

  test('uses surname from previous participant if act type is "сповідь"', () => {
    const confessionAct: Act = {
      ...act,
      act_type: 'сповідь',
      primaryParticipants: [{ ...participant, surname: 'Petrov' }],
      secondaryParticipants: [{ ...participant, surname: '' }],
    };
    mockCleanSurname.mockReturnValue('Petrov');
    const result = getParticipantSearchQuery(
      confessionAct.secondaryParticipants[0]!,
      confessionAct,
    );
    expect(result).toBe('Petrov Ivan Ivanovich');
  });

  test('returns empty string if all name parts are missing', () => {
    const emptyParticipant = {
      ...participant,
      surname: '',
      given_name: '',
      middle_name: '',
    };
    mockCleanSurname.mockReturnValue('');
    const result = getParticipantSearchQuery(emptyParticipant, act);
    expect(result).toBe('');
  });
});
