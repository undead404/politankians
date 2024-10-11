import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.ts';

export const unstructuredRecordSchema = z.object({
  page: nonEmptyString,
  archive: nonEmptyString,
  age: z.optional(z.string()),
  date: z.number(),
  given_name: z.string(),
  series: nonEmptyString,
  middle_name: z.string(),
  postal_code: nonEmptyString,
  settlement: nonEmptyString,
  role: z.string(),
  note: z.string(),
  surname: z.string(),
  item: nonEmptyString,
  act_type: nonEmptyString,
  fonds: nonEmptyString,
});

export type UnstructuredRecord = z.infer<typeof unstructuredRecordSchema>;
