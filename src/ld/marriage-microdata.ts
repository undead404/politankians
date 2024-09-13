import type { Act } from '../schemas/act.js';
import getBaseMicrodata from './participant-base-microdata.js';
import type { MarryAction } from './types.js';
import type { Settlement } from '../schemas/settlement.ts';

export default function getMarriageMicrodata(
  act: Act,
  settlement: Settlement,
): MarryAction {
  if (act.act_type !== 'шлюб') {
    throw new Error('Wrong act_type: ' + act.act_type);
  }
  const groom = getBaseMicrodata(
    act.participants.find(({ role }) => role === 'наречений')!,
  );
  if (
    act.participants.find(({ role }) => role === 'батько нареченого') ||
    act.participants.find(({ role }) => role === 'мати нареченого')
  ) {
    groom.parent = [
      getBaseMicrodata(
        (act.participants.find(({ role }) => role === 'батько нареченого') ||
          act.participants.find(({ role }) => role === 'мати нареченого'))!,
      ),
    ];
  }
  const bride = getBaseMicrodata(
    act.participants.find(({ role }) => role === 'наречена')!,
  );
  if (
    act.participants.find(({ role }) => role === 'батько нареченої') ||
    act.participants.find(({ role }) => role === 'мати нареченої')
  ) {
    bride.parent = [
      getBaseMicrodata(
        (act.participants.find(({ role }) => role === 'батько нареченої') ||
          act.participants.find(({ role }) => role === 'мати нареченої'))!,
      ),
    ];
  }
  return {
    '@type': 'MarryAction',
    agent: groom,
    endTime: act.date,
    location: {
      '@type': 'City',
      ...settlement,
    },
    object: bride,
    participants: act.participants
      .filter(({ role }) => role.includes('поручитель'))
      .map(getBaseMicrodata),
  };
}
