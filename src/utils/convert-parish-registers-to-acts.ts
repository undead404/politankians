import type { ParishRegisterRow } from '../schemas/parish-register-row.js';
import { actSchema, type Act } from '../schemas/act.js';
import type { ParishRegister } from '../schemas/parish-register.js';
import type { Participant } from '../schemas/participant.js';

import getActTitle from './act-title/index.js';
import getActId from './get-act-id.js';
import getParticipantFullName from './get-participant-full-name.js';
import addParticipant from './add-participant.ts';

export default function convertParishRegistersToActs(
  parishRegisters: ParishRegister[],
) {
  const rows = parishRegisters.map(({ rows }) => rows).flat();
  const actRegister: Record<string, Act> = {};
  let currentActNumber = 0;
  let currentActId: string;
  let currentActType: ParishRegisterRow['act_type'];
  let currentActDate: string;
  rows.forEach((row) => {
    if (
      row.act !== currentActNumber ||
      currentActType !== row.act_type ||
      currentActDate !== row.date
    ) {
      currentActId = getActId(row);
      currentActNumber = row.act;
      currentActType = row.act_type;
      currentActDate = row.date;
    }
    const year = Number.parseInt(row.date.slice(0, 4));
    const currentAct: Act = actRegister[currentActId] || {
      act_type: currentActType,
      date: currentActDate,
      description: '',
      number: currentActNumber,
      objectID: currentActId,
      page: row.page,
      primaryParticipants: [],
      secondaryParticipants: [],
      settlement: row.settlement,
      tertiaryParticipants: [],
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
    addParticipant(currentAct, participant);
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
