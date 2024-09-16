import { Act } from '../../schemas/act.js';
import formatDate from '../format-date.js';
import getParticipantFullName from '../get-participant-full-name.js';

export default function getBirthTitle(act: Act) {
  const baptized = act.primaryParticipants.find(({ role }) =>
    ['дитина', 'миропомазаний', 'миропомазана'].includes(role),
  );
  if (!baptized) {
    throw new Error(`No baptized in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(baptized)}`;
}
