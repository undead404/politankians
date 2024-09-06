import type { Act } from './schemas/act.js';
import getParticipantFullName from './get-participant-full-name.js';
import formatDate from './format-date.ts';

function getBirthTitle(act: Act) {
  const baptized =
    act.participants['дитина'] ||
    act.participants['миропомазаний'] ||
    act.participants['миропомазана'];
  if (!baptized) {
    throw new Error(`No baptized in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(baptized)}`;
}

function getMarriageTitle(act: Act) {
  const groom = act.participants['наречений'];
  if (!groom) {
    throw new Error(`No groom in this act: ${act.objectID}`);
  }
  const bride = act.participants['наречена'];
  if (!bride) {
    throw new Error(`No bride in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(
    groom,
  )} і ${getParticipantFullName(bride)}`;
}

function getDeathTitle(act: Act) {
  const deceased = act.participants['померла особа'];
  if (!deceased) {
    throw new Error(`No deceased in this act: ${act.objectID}`);
  }
  return `${act.act_type}, ${formatDate(act.date)}: ${getParticipantFullName(deceased)}`;
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
  throw new Error(`Unknown act type: ${act.act_type}`);
}
