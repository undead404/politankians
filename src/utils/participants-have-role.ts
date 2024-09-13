import type { Participant } from '../schemas/participant.ts';

export default function participantsHaveRole(
  participants: Participant[],
  role: string,
) {
  return participants.some(({ role: itemRole }) => role === itemRole);
}
