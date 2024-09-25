import type { Act } from '../schemas/act.js';
import getBaseMicrodata from './participant-base-microdata.js';
import type { MarryAction } from './types.js';
import type { Settlement } from '../schemas/settlement.js';

export default function getMarriageMicrodata(
  act: Act,
  settlement: Settlement,
): MarryAction {
  if (act.act_type !== 'шлюб') {
    throw new Error('Wrong act_type: ' + act.act_type);
  }
  const groom = getBaseMicrodata(
    act.primaryParticipants.find(({ role }) => role === 'наречений')!,
  );
  if (
    act.secondaryParticipants.find(
      ({ role }) => role === 'батько нареченого',
    ) ||
    act.secondaryParticipants.find(({ role }) => role === 'мати нареченого')
  ) {
    groom.parent = [
      getBaseMicrodata(
        (act.secondaryParticipants.find(
          ({ role }) => role === 'батько нареченого',
        ) ||
          act.secondaryParticipants.find(
            ({ role }) => role === 'мати нареченого',
          ))!,
      ),
    ];
  }
  const bride = getBaseMicrodata(
    act.primaryParticipants.find(({ role }) => role === 'наречена')!,
  );
  if (
    act.secondaryParticipants.find(({ role }) => role === 'батько нареченої') ||
    act.secondaryParticipants.find(({ role }) => role === 'мати нареченої')
  ) {
    bride.parent = [
      getBaseMicrodata(
        (act.secondaryParticipants.find(
          ({ role }) => role === 'батько нареченої',
        ) ||
          act.secondaryParticipants.find(
            ({ role }) => role === 'мати нареченої',
          ))!,
      ),
    ];
  }
  return {
    '@type': 'MarryAction',
    agent: groom,
    endTime: new Date(act.date).toISOString(),
    location: {
      '@type': 'City',
      ...settlement,
    },
    object: bride,
    participants: act.tertiaryParticipants.map(getBaseMicrodata),
  };
}
