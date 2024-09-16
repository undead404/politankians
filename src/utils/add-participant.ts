import { Act } from '../schemas/act.ts';
import { Participant } from '../schemas/participant.ts';
import getParticipantImportance from './get-participant-importance.ts';

export default function addParticipant(act: Act, participant: Participant) {
  if (act.act_type === 'сповідь') {
    if (act.primaryParticipants.length === 0) {
      act.primaryParticipants.push(participant);
      return;
    }
    act.secondaryParticipants.push(participant);
    return;
  }
  switch (getParticipantImportance(participant, act.act_type)) {
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
