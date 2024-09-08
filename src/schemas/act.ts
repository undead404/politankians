import { z } from 'zod';

import { actTypeSchema } from './act_type.js';
import { nonEmptyString } from './non-empty-string.js';
import { participantSchema } from './participant.js';

export const actSchema = z.object({
  act_type: actTypeSchema,
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  description: nonEmptyString,
  number: z.number().min(1),
  objectID: nonEmptyString,
  page: nonEmptyString,
  participants: z
    .record(nonEmptyString, participantSchema)
    .refine((input) => Object.entries(input).length > 0, {
      message: 'An act must have at least one participant',
    })
    .refine(
      (input) => {
        if (input['дитина'] && (input['наречений'] || input['наречена'])) {
          return false;
        }
        if (
          input['померла особа'] &&
          (input['наречений'] || input['наречена'])
        ) {
          return false;
        }
        if (input['померла особа'] && input['дитина']) {
          return false;
        }
        return true;
      },
      { message: 'Неприпустима комбінація учасників' },
    ),
  settlement: nonEmptyString,
  title: nonEmptyString,
});

export type Act = z.infer<typeof actSchema>;
