import { Act } from '../schemas/act.ts';
import { Participant } from '../schemas/participant.ts';

export default function addParticipant(
  act: Act,
  participant: Participant,
  importance: 'PRIMARY' | 'SECONDARY' | 'TERTIARY',
) {
  if (act.act_type === 'сповідь' || act.act_type === 'ревізія') {
    if (act.primaryParticipants.length === 0) {
      act.primaryParticipants.push(participant);
      return;
    }
    act.secondaryParticipants.push(participant);
    return;
  }
  switch (importance) {
    case 'PRIMARY':
      act.primaryParticipants.push(participant);
      break;
    case 'SECONDARY':
      act.secondaryParticipants.push(participant);
      break;
    default:
      act.tertiaryParticipants.push(participant);
  }
}
