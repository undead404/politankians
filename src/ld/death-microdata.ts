import type { Act } from '../schemas/act.js';
import getBaseMicrodata from './participant-base-microdata.js';
import type { Settlement } from '../schemas/settlement.js';

export default function getDeathMicrodata(act: Act, settlement: Settlement) {
  if (act.act_type !== 'смерть') {
    throw new Error('Wrong act_type: ' + act.act_type);
  }
  const deceased = act.participants['померла особа'];
  if (!deceased) {
    throw new Error('No deceased in death');
  }
  const data = {
    ...getBaseMicrodata(deceased),
    deathDate: act.date,
    deathPlace: {
      '@type': 'City',
      ...settlement,
    },
    knows: act.participants['заявник']
      ? [getBaseMicrodata(act.participants['заявник'])]
      : undefined,
    parent:
      act.participants['батько'] || act.participants['мати']
        ? [
            getBaseMicrodata(
              (act.participants['батько'] || act.participants['мати'])!,
            ),
          ]
        : undefined,
    spouse: act.participants['чоловік']
      ? getBaseMicrodata(act.participants['чоловік']!)
      : undefined,
  };
  return data;
}
