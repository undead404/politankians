import getActId from '../populate-algolia/get-act-id.ts';
import getActTitle from '../populate-algolia/get-act-title.ts';
import getParticipantFullName from './get-participant-full-name.ts';
import type { Row } from '../schemas/row.ts';
import { actSchema, type Act } from '../schemas/act.ts';
import type { ParishRegister } from '../schemas/parish-register.ts';
import type { Participant } from '../schemas/participant.ts';

export default function convertParishRegistersToActs(
  parishRegisters: ParishRegister[],
) {
  const rows = parishRegisters.map(({ rows }) => rows).flat();
  const actRegister: Record<string, Act> = {};
  let currentActNumber = 0;
  let currentActId: string;
  let currentActType: Row['act_type'];
  rows.forEach((row) => {
    if (row.act !== currentActNumber || currentActType !== row.act_type) {
      currentActId = getActId(row);
      currentActNumber = row.act;
      currentActType = row.act_type;
    }
    const year = Number.parseInt(row.date.slice(0, 4));
    const currentAct: Act = actRegister[currentActId] || {
      act_type: row.act_type,
      date: row.date,
      description: '',
      number: row.act,
      objectID: currentActId,
      page: row.page,
      participants: {},
      settlement: row.settlement,
      title: '',
      year: year,
    };

    const participant: Participant = {
      age: row.age,
      role: row.role,
      given_name: row.given_name,
      middle_name: row.middle_name,
      surname: row.surname,
      note: row.note,
    };
    currentAct.participants[participant.role] = participant;
    // Update the description field
    const descriptionAddition = `${row.role}: ${getParticipantFullName(participant)}`;
    if (currentAct.description) {
      currentAct.description += `;\n${descriptionAddition}`;
    } else {
      currentAct.description = descriptionAddition;
    }

    actRegister[currentActId] = currentAct;
  });

  const actsWithTitles = Object.values(actRegister).map((act) => ({
    ...act,
    title: getActTitle(act),
  }));
  if (actsWithTitles.length === 0) {
    throw new Error('no acts');
  }
  // check to ensure all fields are set
  return actsWithTitles.map((act) => actSchema.parse(act));
}
