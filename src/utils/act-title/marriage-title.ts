import { Act } from '../../schemas/act.js';
import formatDate from '../format-date.js';
import getPersonFullName from '../get-person-full-name.js';

export default function getMarriageTitle(act: Act) {
  const groom = act.primaryParticipants.find(
    ({ role }) => role === 'наречений',
  );
  if (!groom) {
    throw new Error(`No groom in this act: ${act.id}`);
  }
  const bride = act.primaryParticipants.find(({ role }) => role === 'наречена');
  if (!bride) {
    throw new Error(`No bride in this act: ${act.id}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getPersonFullName(
    groom,
  )} і ${getPersonFullName(bride)}`;
}
