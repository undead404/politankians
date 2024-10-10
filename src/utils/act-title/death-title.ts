import { Act } from '../../schemas/act.js';
import formatDate from '../format-date.js';
import getPersonFullName from '../get-person-full-name.js';

export default function getDeathTitle(act: Act) {
  const deceased = act.primaryParticipants.find(
    ({ role }) => role === 'померла особа',
  );
  if (!deceased) {
    throw new Error(`No deceased in this act: ${act.id}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getPersonFullName(deceased)}`;
}
