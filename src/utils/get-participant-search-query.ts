import type { Act } from '../schemas/act.ts';
import type { Participant } from '../schemas/participant.ts';

import cleanSurname from './clean-surname.ts';

export default function getParticipantSearchQuery(
  participant: Participant,
  act: Act,
): string {
  const index = act.participants.findIndex((item) => item === participant);
  const surname = cleanSurname(
    participant.surname ||
      (act.act_type === 'сповідь' &&
        act.participants.slice(0, index).find(({ surname }) => !!surname)
          ?.surname) ||
      '',
  );
  return [surname, participant.given_name, participant.middle_name]
    .filter(Boolean)
    .join(' ');
}
