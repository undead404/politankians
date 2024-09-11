import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';

export const archiveItemSchema = z.object({
  csvUrl: nonEmptyString,
  gssUrl: nonEmptyString,
  scansUrl: nonEmptyString,
  title: nonEmptyString,
});

export type ArchiveItem = z.infer<typeof archiveItemSchema>;
