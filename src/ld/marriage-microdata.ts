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
  const groom = getBaseMicrodata(act.participants['наречений']!);
  if (
    act.participants['батько нареченого'] ||
    act.participants['мати нареченого']
  ) {
    groom.parent = [
      getBaseMicrodata(
        (act.participants['батько нареченого'] ||
          act.participants['мати нареченого'])!,
      ),
    ];
  }
  const bride = getBaseMicrodata(act.participants['наречена']!);
  if (
    act.participants['батько нареченої'] ||
    act.participants['мати нареченої']
  ) {
    bride.parent = [
      getBaseMicrodata(
        (act.participants['батько нареченої'] ||
          act.participants['мати нареченої'])!,
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
    participants: Object.values(act.participants)
      .filter(({ role }) => role.includes('поручитель'))
      .map(getBaseMicrodata),
  };
}
