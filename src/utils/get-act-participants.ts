import type { Act } from '../schemas/act.ts';
import type { Participant } from '../schemas/participant.ts';

export default function getActParticipants(act: Act): Participant[] {
  return [
    ...act.primaryParticipants,
    ...act.secondaryParticipants,
    ...act.tertiaryParticipants,
  ];
}
