import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { Act } from '../../schemas/act.js';

import getBirthTitle from './birth-title.js';
import getConfessionTitle from './confession-title.js';
import getDeathTitle from './death-title.js';
import getActTitle from './index.js';
import getMarriageTitle from './marriage-title.js';

vi.mock('./birth-title.js');
vi.mock('./confession-title.js');
vi.mock('./death-title.js');
vi.mock('./marriage-title.js');

describe('getActTitle', () => {
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
    (getBirthTitle as Mock).mockReturnValue('Birth Title');
    (getConfessionTitle as Mock).mockReturnValue('Confession Title');
    (getDeathTitle as Mock).mockReturnValue('Death Title');
    (getMarriageTitle as Mock).mockReturnValue('Marriage Title');
  });

  it('should return the correct title for marriage act type', () => {
    const result = getActTitle(mockAct);
    expect(result).toBe('Marriage Title');
  });

  it('should return the correct title for birth act type', () => {
    const birthAct: Act = { ...mockAct, act_type: 'народження' };
    const result = getActTitle(birthAct);
    expect(result).toBe('Birth Title');
  });

  it('should return the correct title for death act type', () => {
    const deathAct: Act = { ...mockAct, act_type: 'смерть' };
    const result = getActTitle(deathAct);
    expect(result).toBe('Death Title');
  });

  it('should return the correct title for confession act type', () => {
    const confessionAct: Act = { ...mockAct, act_type: 'сповідь' };
    const result = getActTitle(confessionAct);
    expect(result).toBe('Confession Title');
  });

  it('should throw an error for unknown act type', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknownAct: Act = { ...mockAct, act_type: 'unknown' as any };
    expect(() => getActTitle(unknownAct)).toThrow('Unknown act type: unknown');
  });
});
