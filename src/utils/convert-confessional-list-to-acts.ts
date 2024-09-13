import getFamilyTitle from '../populate-algolia/get-act-title.ts';
import getParticipantFullName from './get-participant-full-name.ts';

import type { Participant } from '../schemas/participant.ts';
import { actSchema, type Act } from '../schemas/act.ts';
import type { ConfessionalList } from '../schemas/confessional-list.ts';
import getActId from './get-act-id.ts';

export default function convertConfessionalListsToActs(
  confessionalLists: ConfessionalList[],
) {
  console.log(confessionalLists);
  const rows = confessionalLists.map(({ rows }) => rows).flat();
  const actRegister: Record<string, Act> = {};
  let currentFamilyNumber = 0;
  let currentFamilyId: string;
  rows.forEach((row) => {
    // console.log(row);
    if (row.act !== currentFamilyNumber) {
      currentFamilyId = getActId({ act_type: 'сповідь', ...row });
      currentFamilyNumber = row.act;
    }
    const currentFamily: Act = actRegister[currentFamilyId] || {
      act_type: 'сповідь',
      date: row.date,
      description: '',
      number: row.act,
      objectID: currentFamilyId,
      page: row.page,
      participants: [],
      settlement: row.settlement,
      title: '',
      year: Number.parseInt(row.date),
    };

    const participant: Participant = {
      age: row.age,
      role: 'прихожанин',
      given_name: row.given_name,
      middle_name: row.middle_name,
      surname: row.surname,
      note: row.note,
    };
    currentFamily.participants.push(participant);
    // Update the description field
    const descriptionAddition = `${row.note} ${getParticipantFullName(participant)}`;
    if (currentFamily.description) {
      currentFamily.description += `;\n${descriptionAddition}`;
    } else {
      currentFamily.description = descriptionAddition;
    }

    actRegister[currentFamilyId] = currentFamily;
  });

  const actsWithTitles = Object.values(actRegister).map((act) => ({
    ...act,
    title: getFamilyTitle(act),
  }));
  if (actsWithTitles.length === 0) {
    throw new Error('no acts');
  }
  // check to ensure all fields are set
  return actsWithTitles.map((act) => actSchema.parse(act));
}
