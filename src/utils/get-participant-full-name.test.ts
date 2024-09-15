import type { Participant } from '../schemas/participant.js';

import getParticipantFullName from './get-participant-full-name.js';

describe('getParticipantFullName', () => {
  it('should return full name with age if age is provided', () => {
    const participant: Participant = {
      surname: 'Doe',
      given_name: 'John',
      middle_name: 'Michael',
      age: '30',
      role: 'Speaker',
    };
    expect(getParticipantFullName(participant)).toBe('Doe John Michael (30)');
  });

  it('should return full name without age if age is not provided', () => {
    const participant: Participant = {
      surname: 'Doe',
      given_name: 'John',
      middle_name: 'Michael',
      role: 'Speaker',
    };
    expect(getParticipantFullName(participant)).toBe('Doe John Michael');
  });

  it('should handle missing middle name', () => {
    const participant: Participant = {
      surname: 'Doe',
      given_name: 'John',
      middle_name: '',
      age: '30',
      role: 'Speaker',
    };
    expect(getParticipantFullName(participant)).toBe('Doe John (30)');
  });

  it('should handle missing given name', () => {
    const participant: Participant = {
      given_name: '',
      surname: 'Doe',
      middle_name: 'Michael',
      age: '30',
      role: 'Speaker',
    };
    expect(getParticipantFullName(participant)).toBe('Doe Michael (30)');
  });

  it('should handle missing surname', () => {
    const participant: Participant = {
      given_name: 'John',
      middle_name: 'Michael',
      age: '30',
      role: 'Speaker',
      surname: '',
    };
    expect(getParticipantFullName(participant)).toBe('John Michael (30)');
  });

  it('should handle only one name part', () => {
    const participant: Participant = {
      given_name: 'John',
      middle_name: '',
      role: 'Speaker',
      surname: '',
    };
    expect(getParticipantFullName(participant)).toBe('John');
  });

  it('should consider withAge argument', () => {
    const participant: Participant = {
      age: '12',
      given_name: 'John',
      middle_name: '',
      role: 'Speaker',
      surname: '',
    };
    expect(getParticipantFullName(participant, false)).toBe('John');
  });
});
