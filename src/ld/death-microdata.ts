import type { Act } from '../schemas/act.js';
import getBaseMicrodata from './participant-base-microdata.js';
import type { Settlement } from '../schemas/settlement.js';

export default function getDeathMicrodata(act: Act, settlement: Settlement) {
  if (act.act_type !== 'смерть') {
    throw new Error('Wrong act_type: ' + act.act_type);
  }
  const deceased = act.primaryParticipants.find(
    ({ role }) => role === 'померла особа',
  );
  if (!deceased) {
    throw new Error('No deceased in death');
  }
  const reporter = act.tertiaryParticipants.find(
    ({ role }) => role === 'заявник',
  );
  const father = act.tertiaryParticipants.find(({ role }) => role === 'батько');
  const mother = act.tertiaryParticipants.find(({ role }) => role === 'мати');
  const spouse = act.tertiaryParticipants.find(
    ({ role }) => role === 'чоловік',
  );
  const data = {
    ...getBaseMicrodata(deceased),
    deathDate: act.date,
    deathPlace: {
      '@type': 'City',
      ...settlement,
    },
    knows: reporter ? [getBaseMicrodata(reporter)] : undefined,
    parent:
      father || mother ? [getBaseMicrodata((father || mother)!)] : undefined,
    spouse: spouse ? getBaseMicrodata(spouse) : undefined,
  };
  return data;
}
