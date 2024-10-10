import { Act } from '../../schemas/act.js';
import formatDate from '../format-date.js';
import getPersonFullName from '../get-person-full-name.js';

export default function getBirthTitle(act: Act) {
  const baptized = act.primaryParticipants.find(({ role }) =>
    ['дитина', 'миропомазаний', 'миропомазана'].includes(role),
  );
  return `${act.act_type}, ${formatDate(act.date)}: ${baptized ? getPersonFullName(baptized) : '?'}`;
}
