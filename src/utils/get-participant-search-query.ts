import type { Act } from '../schemas/act.ts';
import type { Participant } from '../schemas/participant.ts';

import cleanSurname from './clean-surname.ts';
import getActParticipants from './get-act-participants.ts';

export default function getParticipantSearchQuery(
  participant: Participant,
  act: Act,
): string {
  const surname = cleanSurname(
    participant.surname ||
      (act.act_type === 'сповідь' &&
        act.primaryParticipants.find(({ surname }) => !!surname)?.surname) ||
      (act.act_type === 'ревізія' &&
        getActParticipants(act).find(({ surname }) => !!surname)?.surname) ||
      '',
  );
  return [surname, participant.given_name, participant.middle_name]
    .filter(Boolean)
    .join(' ');
}
