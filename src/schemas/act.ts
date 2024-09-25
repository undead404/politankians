import { z } from 'astro/zod';

import participantsHaveRole from '../utils/participants-have-role.js';
import parseDate from '../utils/parse-date.js';

import { actTypeSchema } from './act_type.js';
import { nonEmptyString } from './non-empty-string.js';
import { participantSchema } from './participant.js';

export const actSchema = z
  .object({
    act_type: actTypeSchema,
    date: z.union([
      z.number(),
      z
        .string()
        .regex(/\d{4}(?:-\d{2}(?:-\d{2})?)?/)
        .transform(parseDate),
    ]),
    description: nonEmptyString,
    id: nonEmptyString,
    number: z.number(),
    page: nonEmptyString,
    primaryParticipants: z
      .array(participantSchema)
      // .min(1, 'Every act must have some primary participant')
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
    secondaryParticipants: z.array(participantSchema),
    settlement: nonEmptyString,
    tertiaryParticipants: z.array(participantSchema),
    title: nonEmptyString,
    year: z.number().min(1500).max(new Date().getFullYear()),
  })
  .refine((input) => {
    if (input.act_type !== 'сповідь' && input.act_type !== 'ревізія') {
      return [
        ...input.primaryParticipants,
        ...input.secondaryParticipants,
        ...input.tertiaryParticipants,
      ].every((participant) => !!participant.role);
    }
    return true;
  }, 'If the act is not a confession, all participants must have roles');

export type Act = z.infer<typeof actSchema>;
