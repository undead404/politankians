import { z } from 'astro/zod';
import { nonEmptyString } from './non-empty-string.js';

export const archiveSchema = z.object({
  address: nonEmptyString,
  currenciesAccepted: z.array(nonEmptyString).min(1),
  email: z.string().email(),
  foundingDate: z.string().regex(/\d{4}/),
  openingHours: nonEmptyString,
  title: nonEmptyString,
  url: z.string().url(),
});

export type Archive = z.infer<typeof archiveSchema>;
