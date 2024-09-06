import type { Participant } from '../schemas/participant.js';

export default function getParticipantFullName(participant: Participant) {
  const name = [
    participant.surname,
    participant.given_name,
    participant.middle_name,
  ]
    .filter(Boolean)
    .join(' ');
  if (participant.age) {
    return `${name} (${participant.age})`;
  }
  return name;
}
