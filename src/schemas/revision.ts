import { z } from 'astro/zod';

import getRowArchiveItemId from '../utils/get-row-archive-item-id.js';
import getSettlements from '../utils/get-settlements.js';
import getYears from '../utils/get-years.js';

import { revisionRowSchema } from './revision-row.js';

export const revisionSchema = z
  .array(revisionRowSchema)
  //   .transform((rows) => rows.map((row) => revisionRowSchema.parse(row)))
  .refine(
    (rows) => {
      const firstRow = rows.at(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((firstRow as any)['Акт']) {
        throw new Error('Did not transform...');
      }
      if (!firstRow) {
        return false;
      }
      const firstRowArchiveItemId = getRowArchiveItemId(firstRow);
      return rows.every(
        (row) => getRowArchiveItemId(row) === firstRowArchiveItemId,
      );
    },
    {
      message: 'All rows in a revision must belong to the same archive item',
    },
  )
  .transform((rows) => ({
    id: getRowArchiveItemId(rows[0]!),
    rows,
    settlements: getSettlements(rows),
    years: getYears(rows),
  }))
  .refine(({ settlements, years }) => {
    console.log(settlements, years);
    return !!settlements && !!years;
  });

export type Revision = z.infer<typeof revisionSchema>;
