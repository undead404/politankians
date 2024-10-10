import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';

const LOOSE_DATE_REGEXP = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;

export const archiveItemSchema = z.object({
  archive: z.enum(['DAViO', 'DAKhmO', 'DAZhO']),
  archivedAt: z.array(nonEmptyString),
  csvUrl: nonEmptyString,
  dateCreated: z.string().regex(LOOSE_DATE_REGEXP),
  dateModified: z.string().regex(LOOSE_DATE_REGEXP).optional(),
  documentLocale: z.enum(['ru', 'uk']),
  genre: z.enum([
    'Confessional list',
    'Parish register',
    'Revision',
    'Unstructured',
  ]),
  gssUrl: nonEmptyString,
  identifier: z.string().regex(/^\d+-\d+[а-я]?-\d+$/),
  isPartial: z.optional(z.boolean()),
  tableLocale: z.enum(['ru', 'uk']),
  title: nonEmptyString,
});

export type ArchiveItem = z.infer<typeof archiveItemSchema>;
