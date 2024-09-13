import { z } from 'astro/zod';

import { actTypeSchema } from './act_type.js';
import { nonEmptyString } from './non-empty-string.js';
import { participantSchema } from './participant.js';
import participantsHaveRole from '../utils/participants-have-role.ts';

export const actSchema = z.object({
  act_type: actTypeSchema,
  date: z.string().regex(/\d{4}(?:-\d{2}(?:-\d{2})?)?/),
  description: nonEmptyString,
  number: z.number().min(1),
  objectID: nonEmptyString,
  page: nonEmptyString,
  participants: z
    .array(participantSchema)
    .refine((input) => input.length > 0, {
      message: 'An act must have at least one participant',
    })
    .refine(
      (input) => {
        if (
          participantsHaveRole(input, 'дитина') &&
          (participantsHaveRole(input, 'наречений') ||
            participantsHaveRole(input, 'наречена'))
        ) {
          return false;
        }
        if (
          participantsHaveRole(input, 'померла особа') &&
          (participantsHaveRole(input, 'наречений') ||
            participantsHaveRole(input, 'наречена'))
        ) {
          return false;
        }
        if (
          participantsHaveRole(input, 'померла особа') &&
          participantsHaveRole(input, 'дитина')
        ) {
          return false;
        }
        return true;
      },
      { message: 'Неприпустима комбінація учасників' },
    ),
  settlement: nonEmptyString,
  title: nonEmptyString,
  year: z.number().min(1500).max(new Date().getFullYear()),
});

export type Act = z.infer<typeof actSchema>;
