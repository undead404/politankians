import * as v from 'valibot';

import getActId from './get-act-id.js';
import getActTitle from './get-act-title.js';
import getParticipantFullName from './get-participant-full-name.js';
import { actSchema, type Act } from './schemas/act.js';
import type { Participant } from './schemas/participant.js';
import type { Row } from './schemas/row.js';

export default function convertRowsToActs(rows: Row[]) {
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
    const currentAct: Act = actRegister[currentActId] || {
      objectID: currentActId,
      participants: {},
      description: '',
      act_type: row.act_type,
      date: row.date,
      settlement: row.settlement,
      title: '',
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
  // check to ensure all fields are set
  return actsWithTitles.map((act) => v.parse(actSchema, act));
}
