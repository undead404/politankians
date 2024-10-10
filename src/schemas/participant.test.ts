import { describe, expect, it } from 'vitest';

import { participantSchema } from './participant.js';

describe('participantSchema', () => {
  const validParticipant = {
    age: '30',
    given_name: 'John',
    middle_name: 'Doe',
    note: 'Test note',
    role: 'participant',
    surname: 'Smith',
  };

  it('should validate a correct participant', () => {
    const result = participantSchema.safeParse(validParticipant);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validParticipant);
    }
  });

  it('should throw an error if given_name is missing', () => {
    const invalidParticipant = { ...validParticipant, given_name: undefined };
    const result = participantSchema.safeParse(invalidParticipant);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe('Required');
    }
  });

  it('should validate a participant without optional fields', () => {
    const minimalParticipant = {
      given_name: 'Jane',
      middle_name: 'Doe',
      role: 'participant',
      surname: 'Doe',
    };
    const result = participantSchema.safeParse(minimalParticipant);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(minimalParticipant);
    }
  });
});
