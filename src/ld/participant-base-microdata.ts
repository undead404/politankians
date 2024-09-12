import type { Participant } from '../schemas/participant.js';
import type { Person } from './types.js';

export default function getBaseMicrodata(person: Participant): Person {
  return {
    '@type': 'Person',
    additionalName: person.middle_name,
    familyName: person.surname,
    givenName: person.given_name,
    description: person.note || undefined,
  };
}
