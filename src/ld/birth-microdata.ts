import type { Act } from '../schemas/act.js';
import type { Settlement } from '../schemas/settlement.ts';
import getBaseMicrodata from './participant-base-microdata.js';
import type { Person } from './types.js';

export default function getBirthMicrodata(
  act: Act,
  settlement: Settlement,
): Person {
  if (act.act_type !== 'народження') {
    throw new Error('Wrong act_type: ' + act.act_type);
  }
  const newlyBorn = act.participants['дитина'];
  if (!newlyBorn) {
    throw new Error('No baby in birth');
  }
  const godParents: Person[] = [];
  if (act.participants['хрещений']) {
    const godfather = getBaseMicrodata(act.participants['хрещений']);
    if (
      act.participants['батько хрещеного'] ||
      act.participants['мати хрещеного']
    ) {
      godfather.parent = [
        getBaseMicrodata(
          (act.participants['батько хрещеного'] ||
            act.participants['мати хрещеного'])!,
        ),
      ];
    }
    godParents.push(godfather);
  }

  if (act.participants['хрещена']) {
    const godmother = getBaseMicrodata(act.participants['хрещена']);
    if (
      act.participants['батько хрещеної'] ||
      act.participants['мати хрещеної']
    ) {
      godmother.parent = [
        getBaseMicrodata(
          (act.participants['батько хрещеної'] ||
            act.participants['мати хрещеної'])!,
        ),
      ];
    }
    if (act.participants['чоловік хрещеної']) {
      godmother.spouse = getBaseMicrodata(act.participants['чоловік хрещеної']);
    }
    godParents.push(godmother);
  }
  return {
    ...getBaseMicrodata(newlyBorn),
    birthDate: act.date,
    birthPlace: {
      '@type': 'City',
      ...settlement,
    },
    knows: godParents,
    parent: [act.participants['батько'], act.participants['мати']]
      .filter(Boolean)
      .map((parent) => getBaseMicrodata(parent!)),
  };
}
