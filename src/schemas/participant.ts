import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';

export const participantSchema = z
  .object({
    age: z.nullable(z.string()),
    given_name: z.string(),
    middle_name: z.string(),
    note: z.nullable(z.string()),
    role: nonEmptyString,
    surname: z.string(),
  })
  // At least a name or a surname must be present
  .refine(
    (input) => {
      return !!(input.given_name || input.middle_name || input.surname);
    },
    {
      message:
        'A participant must have at least either given name or middle name or surname',
    },
  );

export type Participant = z.infer<typeof participantSchema>;
