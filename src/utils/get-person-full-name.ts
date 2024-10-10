import type { Participant } from '../schemas/participant.js';

export default function getPersonFullName(
  participant: Pick<
    Participant,
    'age' | 'given_name' | 'middle_name' | 'surname'
  >,
  withAge = true,
) {
  const name = [
    participant.surname,
    participant.given_name,
    participant.middle_name,
  ]
    .filter(Boolean)
    .join(' ');
  if (withAge && participant.age) {
    return `${name} (${participant.age})`;
  }
  return name;
}
