import { Act } from '../../schemas/act.js';
import formatDate from '../format-date.ts';
import getPersonFullName from '../get-person-full-name.js';

export default function getConfessionTitle(act: Act) {
  const head = act.primaryParticipants[0]!;
  return `${act.act_type}, ${formatDate(act.date)} (${[head.role, getPersonFullName(head)].filter(Boolean).join(' ')})`;
}
