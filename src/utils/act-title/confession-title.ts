import { Act } from '../../schemas/act.js';
import getParticipantFullName from '../get-participant-full-name.js';

export default function getConfessionTitle(act: Act) {
  const head = act.participants[0]!;
  return `${act.act_type} (${[head.note, getParticipantFullName(head)].filter(Boolean).join(' ')})`;
}
