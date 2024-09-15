import type { Participant } from '../schemas/participant.js';

export default function getParticipantFullName(
  participant: Participant,
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
