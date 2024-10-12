import { describe, expect, it } from 'vitest';

import type { Participant } from '../schemas/participant.js';
import participantsHaveRole from './participants-have-role.js';

describe('participantsHaveRole', () => {
  it('should return true if at least one participant has the specified role', () => {
    const participants: Participant[] = [
      {
        age: '30',
        given_name: 'John',
        middle_name: 'A.',
        note: 'Note 1',
        role: 'admin',
        surname: 'Doe',
      },
      {
        age: '25',
        given_name: 'Jane',
        middle_name: 'B.',
        note: 'Note 2',
        role: 'user',
        surname: 'Smith',
      },
    ];
    const role = 'admin';
    const result = participantsHaveRole(participants, role);
    expect(result).toBe(true);
  });

  it('should return false if no participants have the specified role', () => {
    const participants: Participant[] = [
      {
        age: '30',
        given_name: 'John',
        middle_name: 'A.',
        note: 'Note 1',
        role: 'admin',
        surname: 'Doe',
      },
      {
        age: '25',
        given_name: 'Jane',
        middle_name: 'B.',
        note: 'Note 2',
        role: 'user',
        surname: 'Smith',
      },
    ];
    const role = 'moderator';
    const result = participantsHaveRole(participants, role);
    expect(result).toBe(false);
  });

  it('should return false if the participants array is empty', () => {
    const participants: Participant[] = [];
    const role = 'admin';
    const result = participantsHaveRole(participants, role);
    expect(result).toBe(false);
  });

  it('should handle multiple participants with the same role', () => {
    const participants: Participant[] = [
      {
        age: '30',
        given_name: 'John',
        middle_name: 'A.',
        note: 'Note 1',
        role: 'user',
        surname: 'Doe',
      },
      {
        age: '25',
        given_name: 'Jane',
        middle_name: 'B.',
        note: 'Note 2',
        role: 'user',
        surname: 'Smith',
      },
    ];
    const role = 'user';
    const result = participantsHaveRole(participants, role);
    expect(result).toBe(true);
  });

  it('should be case-sensitive when comparing roles', () => {
    const participants: Participant[] = [
      {
        age: '30',
        given_name: 'John',
        middle_name: 'A.',
        note: 'Note 1',
        role: 'Admin',
        surname: 'Doe',
      },
      {
        age: '25',
        given_name: 'Jane',
        middle_name: 'B.',
        note: 'Note 2',
        role: 'user',
        surname: 'Smith',
      },
    ];
    const role = 'admin';
    const result = participantsHaveRole(participants, role);
    expect(result).toBe(false);
  });
});
