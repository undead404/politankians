import type { Act } from '../schemas/act.js';
import getParticipantFullName from '../utils/get-participant-full-name.js';
import formatDate from '../utils/format-date.js';

function getBirthTitle(act: Act) {
  const baptized = act.participants.find(({ role }) =>
    ['дитина', 'миропомазаний', 'миропомазана'].includes(role),
  );
  if (!baptized) {
    throw new Error(`No baptized in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(baptized)}`;
}

function getMarriageTitle(act: Act) {
  const groom = act.participants.find(({ role }) => role === 'наречений');
  if (!groom) {
    throw new Error(`No groom in this act: ${act.objectID}`);
  }
  const bride = act.participants.find(({ role }) => role === 'наречена');
  if (!bride) {
    throw new Error(`No bride in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(
    groom,
  )} і ${getParticipantFullName(bride)}`;
}

function getDeathTitle(act: Act) {
  const deceased = act.participants.find(
    ({ role }) => role === 'померла особа',
  );
  if (!deceased) {
    throw new Error(`No deceased in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(deceased)}`;
}

function getConfessionTitle(act: Act) {
  const head = act.participants[0]!;
  return `${act.act_type} (${[head.note, getParticipantFullName(head)].filter(Boolean).join(' ')})`;
}

export default function getActTitle(act: Act) {
  if (
    act.act_type === 'хрещення' ||
    act.act_type === 'народження' ||
    act.act_type === 'миропомазання'
  ) {
    return getBirthTitle(act);
  }
  if (act.act_type === 'шлюб') {
    return getMarriageTitle(act);
  }
  if (act.act_type === 'відспівування' || act.act_type === 'смерть') {
    return getDeathTitle(act);
  }
  if (act.act_type === 'сповідь') {
    return getConfessionTitle(act);
  }
  console.log(act);
  throw new Error(`Unknown act type: ${act.act_type}`);
}
