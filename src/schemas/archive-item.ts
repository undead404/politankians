import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';

const LOOSE_DATE_REGEXP = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;

export const archiveItemSchema = z.object({
  archive: z.enum(['ДАВіО', 'ДАХмО']),
  archivedAt: z.array(nonEmptyString),
  csvUrl: nonEmptyString,
  dateCreated: z.string().regex(LOOSE_DATE_REGEXP),
  dateModified: z.string().regex(LOOSE_DATE_REGEXP).optional(),
  genre: z.enum(['Confessional list', 'Parish register', 'Revision']),
  gssUrl: nonEmptyString,
  identifier: z.string().regex(/\d+-\d+-\d+/),
  inLanguage: z.enum(['Russian']),
  title: nonEmptyString,
});

export type ArchiveItem = z.infer<typeof archiveItemSchema>;
