import type { Act } from '../schemas/act.js';
import type { Settlement } from '../schemas/settlement.js';
import getBaseMicrodata from './participant-base-microdata.js';
import type { Person } from './types.js';

export default function getBirthMicrodata(
  act: Act,
  settlement: Settlement,
): Person | null {
  if (act.act_type !== 'народження') {
    throw new Error('Wrong act_type: ' + act.act_type);
  }
  const newlyBorn = act.primaryParticipants.find(
    ({ role }) => role === 'дитина',
  );
  if (!newlyBorn) {
    // throw new Error('No baby in birth');
    return null;
  }
  const godfather = act.tertiaryParticipants.find(
    ({ role }) => role === 'хрещений',
  );
  const godParents: Person[] = [];
  if (godfather) {
    const godfatherMicrodata = getBaseMicrodata(godfather);
    const godfatherParent = act.tertiaryParticipants.find(
      ({ role }) => role === 'батько хрещеного' || role === 'мати хрещеного',
    );
    if (godfatherParent) {
      godfatherMicrodata.parent = [getBaseMicrodata(godfatherParent)];
    }
    godParents.push(godfatherMicrodata);
  }

  const godmother = act.tertiaryParticipants.find(
    ({ role }) => role === 'хрещена',
  );
  if (godmother) {
    const godmotherMicrodata = getBaseMicrodata(godmother);
    const godmotherParent = act.tertiaryParticipants.find(
      ({ role }) => role === 'батько хрещеного' || role === 'мати хрещеного',
    );
    if (godmotherParent) {
      godmotherMicrodata.parent = [getBaseMicrodata(godmotherParent)];
    }
    const godmotherSpouse = act.tertiaryParticipants.find(
      ({ role }) => role === 'чоловік хрещеної',
    );
    if (godmotherSpouse) {
      godmotherMicrodata.spouse = getBaseMicrodata(godmotherSpouse);
    }
    godParents.push(godmotherMicrodata);
  }
  return {
    ...getBaseMicrodata(newlyBorn),
    birthDate: new Date(act.date).toISOString(),
    birthPlace: {
      '@type': 'City',
      ...settlement,
    },
    knows: godParents,
    parent: [
      act.secondaryParticipants.find(({ role }) => role === 'батько'),
      act.secondaryParticipants.find(({ role }) => role === 'мати'),
    ]
      .filter(Boolean)
      .map((parent) => getBaseMicrodata(parent!)),
  };
}
