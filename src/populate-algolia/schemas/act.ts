import * as v from 'valibot';

import { actTypeSchema } from './act_type.js';
import { nonEmptyString } from '../../utils/non-empty-string.ts';
import { participantSchema } from './participant.js';

export const actSchema = v.object({
  act_type: actTypeSchema,
  date: v.date(),
  description: nonEmptyString,
  objectID: nonEmptyString,
  participants: v.pipe(
    v.record(nonEmptyString, participantSchema),
    v.check(
      (input) => Object.entries(input).length > 0,
      'An act must have at least one participant',
    ),
    v.check((input) => {
      if (input['дитина'] && (input['наречений'] || input['наречена'])) {
        return false;
      }
      if (input['померла особа'] && (input['наречений'] || input['наречена'])) {
        return false;
      }
      if (input['померла особа'] && input['дитина']) {
        return false;
      }
      return true;
    }, 'Неприпустима комбінація учасників'),
  ),
  settlement: nonEmptyString,
  title: nonEmptyString,
});

export type Act = v.InferOutput<typeof actSchema>;
