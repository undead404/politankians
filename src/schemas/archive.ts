import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';

export const archiveSchema = z.object({
  address: nonEmptyString,
  currenciesAccepted: z.array(nonEmptyString),
  email: z.string().email(),
  foundingDate: z.string().regex(/\d{4}/),
  openingHours: z.union([nonEmptyString, z.array(nonEmptyString)]),
  shortTitle: nonEmptyString,
  title: nonEmptyString,
  url: z.string().url(),
});

export type Archive = z.infer<typeof archiveSchema>;
