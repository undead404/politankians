import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';

export const settlementSchema = z.object({
  address: nonEmptyString,
  name: nonEmptyString,
});

export type Settlement = z.infer<typeof settlementSchema>;
